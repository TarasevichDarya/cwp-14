const Sequelize = require('sequelize');
const config = require('./config.json');
const db = require('./models')(Sequelize, config);
let films = require('./data/films.json');
const actors = require('./data/actors.json');

(async () => {
    await db.sequelize.sync({force: true});

    console.log('1. Валидация полей budget, year и rating фильма');
    try
    {
        await db.films.create({
            title: 'Баллада о солдате',
            rating: 8.241,
            year: 1959,
            budget: 24423,
            gross: 35020,
            poster: 'j96bAh4otsgj3lKydm3K7kdtA3iKf2m6MY2iSYCzCm5a1zmHo1g',
            position: 100
        });
    }
    catch (e) {
        console.log(`\t >> Exception: ${e.message} <<`);
     }

    console.log('2. Пакетная вставка 3 фильмов');
    await db.films.bulkCreate(films.slice(1,4));

    console.log('3. Пакетное обновление поля liked у актеров с 3 фильмами');
    await db.actors.update({
        liked: 999
    },
    {
        where:{
            films: 3
        }
    });

    console.log('4. Пакетное удаление актеров с liked равным 0');
    await db.actors.destroy({
        where: {
            liked: 0
        }
    });

    console.log('5. Получение за один запрос фильм со всеми его актерами ');
    (await db.films.findById(1, {//связываем 2 табл
        include: [{
            model: db.actors,
            as: 'Actors'
        }]
    })).Actors.forEach((e) => {
        console.log(`>> ${e.name}`);
    });

    console.log('6. Создание и применение scope для фильмов вышедших с 2007 года');
    (await db.films.scope('new')
    .findAll()).forEach((film) => {
        console.log(`>> ${film.title}`);
    });

//хуки это технология перехвата вызовов функций в чужих процессах.
//суть - заставит программу поверить, что нужня ей функци находится в другом месте.
 //некое условие которое должно выполниться
    console.log('7. Создание и вызов хуков beforeCreate, afterCreate');
    db.sequelize.addHook('beforeBulkCreate', () => {
        console.log('beforeBulkCreate');
    });

    db.sequelize.addHook('afterBulkCreate', () => {
        console.log('afterBulkCreate');
    });

    await db.actors.bulkCreate(actors.slice(1,4));

    await db.actorfilms.bulkCreate([
        {actorId: 2, filmId: 2}
    ]);

    console.log('8. Транзакция: считываем всех актеров, пакетно обновляем им liked на 0, ждем 10 секунд, откатываем транзакцию');
    await db.sequelize.transaction().then((_t) => {
        return db.actors.update({//то что надо добавить
            liked: 0
        },
        {
            where: {},
            transaction: _t
        }).then(() => {
            console.log('sleep(10000)');
            setTimeout(function () {
               // console.log("rollback");
               //_t.commit();
               return _t.rollback();     //
            }, 1000);
        });
    });

    console.log('End');

})();

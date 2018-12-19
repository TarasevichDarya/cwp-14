'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => { //редактируем файл,чтобы вставить в него(преобразование в новое состояние)

    return queryInterface.removeColumn(
        'films',
        'genres'
    );

},

down: (queryInterface, Sequelize) => {//для возврата изменений
    return queryInterface.addColumn(
        'films',
        'genres',
        Sequelize.STRING
    );
}
};

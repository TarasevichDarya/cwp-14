'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => { //редактируем файл,чтобы вставить в него(преобразование в новое состояние)
        queryInterface.removeColumn(
            'films',
            'g'
        );
    },

    down: (queryInterface, Sequelize) => {//для возврата изменений
        queryInterface.addColumn(
            'films',
            'g',
            Sequelize.STRING
        );
    }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => { //редактируем файл,чтобы вставить в него(преобразование в новое состояние)
    queryInterface.addColumn(
		'films',
		'genres',
		Sequelize.STRING
	);
  },

  down: (queryInterface, Sequelize) => {//для возврата изменений
    queryInterface.removeColumn(
		'films',
		'genres'
    );
  }
};

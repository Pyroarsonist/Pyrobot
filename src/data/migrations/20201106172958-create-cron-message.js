module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('CronMessage', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      message: {
        type: Sequelize.STRING(4096),
        allowNull: false,
      },
      cron: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      chatId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chat',
          key: 'id',
        },
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('CronMessage'),
};

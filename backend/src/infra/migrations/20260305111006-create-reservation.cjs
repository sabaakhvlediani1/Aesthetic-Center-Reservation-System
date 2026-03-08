"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      specialistId: {
        type: Sequelize.UUID,
        references: { model: "Staffs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      startTime: { type: Sequelize.TIME, allowNull: false },
      duration: { type: Sequelize.INTEGER, allowNull: false }, 
      endTime: { type: Sequelize.TIME, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable("ReservationServices", {
      reservationId: {
        type: Sequelize.UUID,
        references: { model: "Reservations", key: "id" },
        onDelete: "CASCADE",
        primaryKey: true
      },
      serviceId: {
        type: Sequelize.UUID,
        references: { model: "Services", key: "id" },
        onDelete: "CASCADE",
        primaryKey: true
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ReservationServices");
    await queryInterface.dropTable("Reservations");
  },
};

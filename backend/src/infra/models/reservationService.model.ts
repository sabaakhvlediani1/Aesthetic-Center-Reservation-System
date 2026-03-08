import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize.js";

export class ReservationService extends Model {}

ReservationService.init(
  {
    reservationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "ReservationService",
    timestamps: false
  }
);
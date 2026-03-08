import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize.js";

export class Reservation extends Model {
  declare id: string;
  declare specialistId: string;
  declare date: string;
  declare startTime: string;
  declare duration: number;
  declare endTime: string;
}

Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    specialistId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Reservation",
    timestamps: true
  }
);
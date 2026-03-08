import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize.js";

export class Service extends Model {
  declare id: string;
  declare name: string;
  declare price: number;
  declare color: string;
  declare customFields: object;
}

Service.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customFields: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: "Service",
    paranoid: true, // enables deletedAt
    timestamps: true
  }
);
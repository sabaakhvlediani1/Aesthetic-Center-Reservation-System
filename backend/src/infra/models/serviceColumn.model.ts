import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize.js";

export class ServiceColumn extends Model {
  declare id: string;
  declare name: string;
  declare order: number;
}

ServiceColumn.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "ServiceColumn", timestamps: true }
);

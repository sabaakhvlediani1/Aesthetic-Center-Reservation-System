import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/sequelize.js";

interface StaffAttributes {
  id: string;
  firstName: string; 
  lastName: string;
  photo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface StaffCreationAttributes
  extends Optional<StaffAttributes, "id" | "photo"> {}

export class Staff
  extends Model<StaffAttributes, StaffCreationAttributes>
  implements StaffAttributes
{
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public photo?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Staff.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { 
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100], 
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
  },
  {
    sequelize,
    tableName: "Staffs",
    timestamps: true, 
    paranoid: true, 
  }
);
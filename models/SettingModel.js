import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Setting = sequelize.define(
  "Setting",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requireApproval: { type: DataTypes.INTEGER, allowNull: false },
    isUserDelete: { type: DataTypes.INTEGER, allowNull: false },
    isUserUpload: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "settings",
    timestamps: false,
  }
);

export default Setting;

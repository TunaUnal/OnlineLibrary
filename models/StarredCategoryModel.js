import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const StarredCategory = sequelize.define(
  "StarredCategory",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    folder_id: { type: DataTypes.INTEGER, allowNull: false },
    starred_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "starred_categories1",
    timestamps: false,
  }
);

export default StarredCategory;

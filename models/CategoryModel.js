import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(256), allowNull: false },
    parent_id: { type: DataTypes.INTEGER, allowNull: false },
    can_upload: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

export default Category;

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const File = sequelize.define(
  "File",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    stored_name: { type: DataTypes.STRING(255), allowNull: false },
    filename: { type: DataTypes.STRING(250), allowNull: false },
    ext: { type: DataTypes.STRING(15), allowNull: false },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: "No description",
    },
    size: { type: DataTypes.INTEGER, allowNull: false },
    path: { type: DataTypes.TEXT, allowNull: false },
    mimetype: { type: DataTypes.TEXT, allowNull: false },
    category_id: { type: DataTypes.INTEGER },
    uploaded_at: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.STRING, allowNull: false },
    hit: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING(11), defaultValue: "pending" },
  },
  {
    tableName: "files",
    timestamps: false,
    defaultScope: {
      attributes: {
        // 'path' ve 'stored_name' kolonlarını varsayılan olarak HARİÇ TUT
        exclude: ["path", "stored_name"],
      },
    },
  }
);

export default File;

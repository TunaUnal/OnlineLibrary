import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(256), allowNull: false },
    password: { type: DataTypes.STRING(256), allowNull: false },
    user_ns: { type: DataTypes.STRING(1024), allowNull: false },
    credit: { type: DataTypes.INTEGER, defaultValue: 0 },
    role: { type: DataTypes.STRING, defaultValue: "user" },
    avatar: { type: DataTypes.STRING(1024), allowNull: false },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;

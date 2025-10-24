import dotenv from "dotenv/config.js";
import User from "../models/userModel.js";
export const printUserName = (id) => {
  const users = {
    1: "Alice",
    2: "Bob",
    3: "Charlie",
  };
  console.log(process.env.PORT);

  const name = users[id] || "Unknown User";
  console.log(`User Name: ${name}`);
  return { id: id, name: name };
};

export const getAllUserAPI = async () => {
  // Simüle edilmiş kullanıcı verisi
  const users = await User.findAll({
    attributes: ["id", "username", "user_ns", "role", "avatar"],
  });
  return users;
};

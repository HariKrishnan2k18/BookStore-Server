import jwt from "jsonwebtoken";
import UsersCollection from "../models/users_schema.js";
const SECRET_KEY = process.env.SECRET_KEY;

export const LoginUsers = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Request body:", req.body);
    const userCollection = await UsersCollection.findOne({});
    console.log({ userCollection });
    const user = userCollection.users.find(
      u => u.user === username && u.password === password
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "invalid user" });
  }
};

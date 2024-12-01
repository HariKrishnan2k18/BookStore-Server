import mongoose from "mongoose";

const usersCollectionSchema = new mongoose.Schema({
  users: [
    {
      id: { type: Number, required: true },
      user: { type: String, required: true },
      password: { type: String, required: true },
      books: {
        cart: [String]
      }
    }
  ]
});

const UsersCollection = mongoose.model("users", usersCollectionSchema);

export default UsersCollection;

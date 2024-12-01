import UsersCollection from "../models/users_schema.js";

export const addCartList = async (req, res) => {
  const { username, bookId } = req.body;
  if (!username || !bookId) {
    return res
      .status(400)
      .json({ message: "Username and Book ID are required" });
  }

  try {
    const userDocument = await UsersCollection.findOne({
      "users.user": username
    });

    if (!userDocument) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDocument.users.find(u => u.user === username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = user.books.cart.includes(bookId);
    if (isBookInCart) {
      await UsersCollection.updateOne(
        { "users.user": username },
        { $pull: { "users.$.books.cart": bookId } }
      );
      return res.status(200).json({ message: "Book removed from cart" });
    } else {
      await UsersCollection.updateOne(
        { "users.user": username },
        { $push: { "users.$.books.cart": bookId } }
      );
      return res.status(200).json({ message: "Book added to cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

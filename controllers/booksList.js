import BookList from "../models/books_schema.js";

export const BooksList = async (req, res) => {
  try {
    const books = await BookList.find();
    res.status(200).json(books[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

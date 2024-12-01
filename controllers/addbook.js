import BookList from "../models/books_schema.js";

export const addBooks = async (req, res) => {
  try {
    const books = await BookList.aggregate([
      {
        $project: {
          booksLength: { $size: "$books" }
        }
      }
    ]);
    const bookList = await BookList.findById(books[0]["_id"]);
    if (!bookList) {
      res.status(500).json({ message: "Book Not Found" });
      return;
    }
    bookList.books.push({
      id: Number(bookList.books[bookList.books.length - 1].id) + 1,
      ...req.body
    });
    await bookList.save();
    res.status(200).json({ message: "Added Book Successfully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: error });
  }
};

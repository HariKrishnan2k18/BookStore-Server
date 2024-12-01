import mongoose from "mongoose";

const bookListSchema = new mongoose.Schema(
  {
    books: [
      {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        genre: { type: String, required: true },
        isbn: { type: String, required: true },
        price: { type: Number, required: true },
        availability: { type: String, required: true },
        rating: { type: Number, required: true },
        publication_date: { type: String, required: true },
        description: { type: String, required: true },
        cover_image_url: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

const BookList = mongoose.model("BooksList", bookListSchema);

export default BookList;

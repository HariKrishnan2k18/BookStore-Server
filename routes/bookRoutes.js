import express from "express";
import { BooksList } from "../controllers/booksList.js";
import verifyJWT from "../config/verifyJWT.js";
import { addCartList } from "../controllers/addCartList.js";
import { addBooks } from "../controllers/addbook.js";

const router = express.Router();
router.get("/", verifyJWT, BooksList);
router.post("/cart", verifyJWT, addCartList);
router.post("/addbook", verifyJWT, addBooks);

export default router;

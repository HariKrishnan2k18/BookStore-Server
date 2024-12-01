import express from "express";
import { LoginUsers } from "../controllers/loginUser.js";

const router = express.Router();
router.post("/", LoginUsers);

export default router;

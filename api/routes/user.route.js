import express from "express";
import { test,updateUser } from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyUserToken,updateUser);

export default router;
import express from "express";
import { test,updateUser, deleteuser} from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyUserToken,updateUser);
router.delete('/delete/:id',verifyUserToken,deleteuser);

export default router;
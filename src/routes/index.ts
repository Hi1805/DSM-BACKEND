import * as express from "express";
import DSMController from "../controllers/DSM";
import { teacherRouter } from "./teacher";

const router = express.Router();
router.use("/teacher", teacherRouter);

router.post("/send", DSMController.sendEmail);

export default router;

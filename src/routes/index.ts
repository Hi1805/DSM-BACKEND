import * as express from "express";
import DSMController from "../controllers/DSM-controller";
import { studentRouter } from "./students";
import { teacherRouter } from "./teacher";

const router = express.Router();
router.use("/teacher", teacherRouter);
router.use("/student", studentRouter);
router.post("/send", DSMController.sendEmail);
router.get("/classes", DSMController.getClasses);

export default router;

import * as express from "express";
import { authenticateToken } from "../middlewares";
import { DSMRouter } from "./dsm";
import { studentRouter } from "./students";
import { teacherRouter } from "./teacher";

const router = express.Router();
router.use("/teacher", authenticateToken, teacherRouter);
router.use("/student", studentRouter);
router.use("/dsm", DSMRouter);

export default router;

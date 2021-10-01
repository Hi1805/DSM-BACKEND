import * as express from "express";
import { DSMRouter } from "./dsm";
import { studentRouter } from "./students";
import { teacherRouter } from "./teacher";

const router = express.Router();
router.use("/teacher", teacherRouter);
router.use("/student", studentRouter);
router.use("/dsm", DSMRouter);

export default router;

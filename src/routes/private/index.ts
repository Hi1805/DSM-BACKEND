import * as express from "express";
import { DSMRouter } from "./dsm";
import { studentRouter } from "./students";
import { teacherRouter } from "./teacher";

const privateRouter = express.Router();
privateRouter.use("/teacher", teacherRouter);
privateRouter.use("/student", studentRouter);
privateRouter.use("/dsm", DSMRouter);

export default privateRouter;

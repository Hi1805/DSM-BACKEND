import * as express from "express";
import { DSMRouter } from "./dsm";

const publicRouter = express.Router();

publicRouter.use("/dsm", DSMRouter);

export default publicRouter;

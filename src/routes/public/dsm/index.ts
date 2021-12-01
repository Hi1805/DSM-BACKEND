import * as express from "express";
import DSMController from "../../../controllers/DSM-controller";
const DSMRouter = express.Router();
DSMRouter.post("/login", DSMController.login);
DSMRouter.get("/classes", DSMController.getClasses);
export { DSMRouter };

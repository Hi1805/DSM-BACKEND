import * as express from "express";
import DSMController from "../../controllers/DSM-controller";
const DSMRouter = express.Router();
DSMRouter.post("/send-email", DSMController.sendEmail);
DSMRouter.get("/classes", DSMController.getClasses);
export { DSMRouter };

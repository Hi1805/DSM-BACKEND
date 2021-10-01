import * as express from "express";
import StudentController from "../../controllers/student-controller";
const studentRouter = express.Router();
studentRouter.get("/list", StudentController.getListStudent);
studentRouter.get("/total", StudentController.getTotalStudent);
studentRouter.post("/create", StudentController.createStudent);
studentRouter.put("/edit", StudentController.editStudent);
studentRouter.delete("/delete/:id", StudentController.deleteStudent);
export { studentRouter };

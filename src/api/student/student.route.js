import express from 'express'
import StudentController from './student.controller.js'
const studentRouter = express.Router()

studentRouter.route("/").get(StudentController.getAllStudent);
studentRouter.route("/").post(StudentController.createStudent);
studentRouter.route("/class/:classId").get(StudentController.getStudentsByClass);
// studentRouter.route("/").post(StudentController.validateCreateStudent, StudentController.createStudent);

studentRouter.get("/:id", StudentController.getStudentById);
studentRouter.put("/:id", StudentController.updateStudent);
studentRouter.delete("/:id", StudentController.deleteStudent);

export default studentRouter

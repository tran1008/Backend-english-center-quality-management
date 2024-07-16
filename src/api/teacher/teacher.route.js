import express from "express";
import TeacherController from "./teacher.controller.js";

const router = express.Router();

router.route("/").get(TeacherController.getAllTeacher);
router.route("/find").get(TeacherController.findTeachers);
router.route("/").post(TeacherController.addTeacher);
router.get("/:id", TeacherController.getTeacherById);
router.put("/:id", TeacherController.updateTeacher);
router.delete("/:id", TeacherController.deleteTeacher);

export default router;
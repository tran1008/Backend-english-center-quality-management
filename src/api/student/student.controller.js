import StudentSchema from "../model/student.schema.js";
import Response from "../helpers/response.js";
import ClassSchema from "../model/class.schema.js";

export default class StudentController {
  //---------getAllStudent--------------

  static async getAllStudent(req, res, next) {
    try {
      let query = {};
      //Filter by typeClass
      if (req.query.typeClass) {
        query.TypeClass = req.query.typeClass;
      }
      if (req.query.classId) {
        const _class = await ClassSchema.findOne({
          ClassID: req.query.classId,
        });
        query.ClassID = _class.id;
      }
      const students = await StudentSchema.find(query);
      if (!students) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(students));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //---------getStudentByClassID--------------
  
  static async getStudentsByClass(req, res, next) {
    try {
      const classId = req.params.classId;
      const students = await StudentSchema.find({ NameClass: classId });
      if (!students) {
        throw "error";
      }
      return res.status(200).json(students);
    } 
    catch (error) {
      return res.json({ error: "An error occurred" });
    }
  }


  //---------getAllStudentById--------------

  static async getStudentById(req, res, next) {
    try {
      const student = await StudentSchema.findById(req.params.id);
      if (!student) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(student));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //-------------createStudent-------------

  static async createStudent(req, res) {
    try {
      const students = await StudentSchema.find({});
      let newStudentID;
      const {ClassID} = req.body
      if (students.length === 0) {
        newStudentID = "STD0001";
      } else {
        const lastStudentID = students[students.length - 1].StudentID;
        const lastStudentNum = parseInt(lastStudentID.slice(3), 10);
        newStudentID = "STD" + ("000" + (lastStudentNum + 1)).slice(-4);
      }
      const _class = await ClassSchema.findOne({ClassID})
      const newStudent = new StudentSchema({
        ...req.body,
        ClassID: _class._id,
        StudentID: newStudentID,
      });
      if (!_class) {}
      await ClassSchema.findByIdAndUpdate(_class._id, {NumberOfStudent: _class.NumberOfStudent + 1})

      const savedStudent = await newStudent.save();
      return res.status(201).json(Response.successResponse(savedStudent));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //-------------updateStudent-------------

  static async updateStudent(req, res) {
    try {
      console.debug("Updating...");
      const { id } = req.params;
      const updatedStudent = await StudentSchema.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedStudent) {
        return res
          .status(404)
          .json(Response.errorResponse("Student not found"));
      }
      return res.json(Response.successResponse(updatedStudent));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //-------------deleteStudent-------------

  static async deleteStudent(req, res) {
    try {
      const studentId = req.params.id;
      const deletedStudent = await StudentSchema.findByIdAndDelete(studentId);
      if (!deletedStudent) {
        return res.status(404).json(Response.errorResponse("Student not found"));
      }
      const {ClassID} = deletedStudent;
      console.log(ClassID); 
      const _class = await ClassSchema.findOne({ClassID});
      await ClassSchema.findByIdAndUpdate(_class.id, {NumberOfStudent: _class.NumberOfStudent - 1});
      
      return res.status(200).json(Response.successResponse("Student deleted successfully"));
    } 
    catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}

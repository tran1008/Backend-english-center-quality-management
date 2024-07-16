import TeacherSchema from "../model/teacher.schema.js";
import Response from "../helpers/response.js";
import ClassSchema from "../model/class.schema.js";

export default class TeacherController {
  //Lấy danh sách giáo viên:
  static async getAllTeacher(req, res, next) {
    try {
      const { Certificate } = req.query;
      const teachers = await fetchTeachersByCertificate(Certificate);
      // const teacher = await TeacherSchema.find().populate("class", "name");
      // const classIdsByTeacherId = await getClassIdsByTeacherId();
      // teachers.forEach((teacher) => {
      //   teacher.classIds = classIdsByTeacherId[teacher._id] || [];
      // });
      if (!teachers) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(teachers));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  //Lấy giáo viên theo id:
  static async getTeacherById(req, res, next) {
    try {
      const teacher = await TeacherSchema.findById(req.params.id);
      if (!teacher) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(teacher));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //Thêm giáo viên

  static async addTeacher(req, res) {
    try {
      console.debug("Creating Teacher...");
      const teachers = await TeacherSchema.find({});
      let newTeacherID;
      if (teachers.length === 0) {
        newTeacherID = "TEA0001";
      } else {
        const lastTeacherID = teachers[teachers.length - 1].TeacherID;
        const lastTeacherNum = parseInt(lastTeacherID.slice(3), 10);
        newTeacherID = "TEA" + ("000" + (lastTeacherNum + 1)).slice(-4);
      }
      const newTeacher = new TeacherSchema({
        ...req.body,
        TeacherID: newTeacherID,
      });
      const savedTeacher = await newTeacher.save();
      return res.status(201).json(Response.successResponse(savedTeacher));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //Cập nhật thông tin giáo viên:
  static async updateTeacher(req, res) {
    try {
      console.debug("Updating teacher...");
      const updatedTaecher = await TeacherSchema.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      if (!updatedTaecher) {
        return res
          .status(404)
          .json(Response.errorResponse("Teacher not found."));
      }
      return res.json(Response.successResponse(updatedTaecher));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  //Xóa giáo viên:
  static async deleteTeacher(req, res) {
    try {
      console.debug("Deleting Teacher...");
      const deletedTeacher = await TeacherSchema.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deletedTeacher) {
        return res
          .status(404)
          .json(Response.errorResponse("Teacher not found."));
      }
      return res.json(Response.successResponse("Teacher deleted successfully"));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  //find class for search
  static async findTeachers(req, res, next) {
    try {
      const query = req.query.query;
  
      const teachers = await TeacherSchema.find({
        $or: [
          { Name: { $regex: query, $options: "i" } },
          { TeacherID: { $regex: query, $options: "i" } }
        ]
      });
  
      return res.status(200).json(Response.successResponse(teachers));
    } 
    catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}
//Lấy ClassID theo từng TeacherID
async function getClassIdsByTeacherId() {
  const classIdsByTeacherId = {};

  const teachers = await TeacherSchema.find();
  const classIds = await ClassSchema.find({}, "_id");

  teachers.forEach((teacher) => {
    const classIdsForTeacher = classIds.filter((classId) =>
      classId.teachers.includes(teacher._id)
    );
    classIdsByTeacherId[teacher._id] = classIdsForTeacher.map(
      (classId) => classId._id
    );
  });

  return classIdsByTeacherId;
}
// Function to fetch teachers by Certificate
async function fetchTeachersByCertificate(Certificate) {
  let query = {};

  if (Certificate) {
    query.Certificate = Certificate;
  }

  // Perform query using Teacher model
  const teachers = await TeacherSchema.find(query);

  return teachers;
}

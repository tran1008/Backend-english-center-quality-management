import StudentReportSchema from "../model/student-report.schema.js";
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import studentReportController from "../studentReport/report.controller.js";
import { createUpdateClassReport } from "../classReport/classReport.controller.js";
import { createUpdateCenterReport } from "../centerReport/centerReport.controller.js";

export const createAttendance = async (req, res, next) => {
  const attendancesReq = req.body.attendances;
  let attendancesRes = [];

    for(let i = 0; i < attendancesReq.length; i++){
      const { Attendance, StudentID, Date } = attendancesReq[i];
      // Assume variabels are not undefined
      const student = await StudentSchema.findById(StudentID._id);
      if (!student)
        res.json(
          Response.errorResponse(
            404,
            `Student with ID ${StudentID.StudentID} is not found`
          )
        );
      
        let tempId = student.id;
        let report = await studentReportController.createStudentReport({
          date: Date,
          attendance: Attendance,
          studentId: tempId,
        });
        attendancesRes.push(report);
  
        //create or update class report
        await createUpdateClassReport(student.ClassID, Date);
        //create and update center report
        await createUpdateCenterReport(Date);

      // const attendanceData = {
      //     StudentID: student.id,
      //     Date: new Date(date)
      // }

      // const existedAttendance = await StudentReportSchema.findOne(attendanceData)
      // if (!existedAttendance) {
      //     const newAttendance = await StudentReportSchema.create({
      //         ...attendanceData,
      //         Attendance: Attendance,
      //         ClassID: student.ClassID
      //     })
      //     console.log(student.ClassID)
      //     attendancesRes.push(newAttendance)
      // } else {
      //     const updatedAttendace = await StudentReportSchema.findOneAndUpdate(attendanceData, {
      //         Attendance: Attendance,
      //         ClassID: student.ClassID
      //     })
      //     attendancesRes.push(updatedAttendace)
      // }
     
      attendancesRes.push(report);
    }

  return res.json(Response.successResponse(attendancesRes));
};

export const createAttendanceByScanning = async (req, res, next) => {
  const { studentIds } = req.body || [];
  let attendancesRes = [];

  const _class = await ClassSchema.findOne({ ClassID: req.params.classId });

  const allStudents = await StudentSchema.find({ ClassID: _class.id });
  const absentStudents = allStudents.filter(
    (student) => !studentIds.includes(student.StudentID)
  );

  const date = new Date();

  await Promise.all(
    studentIds.map(async (studentId) => {
      const student = await StudentSchema.findOne({ StudentID: studentId });

      if (!student)
        res.json(
          Response.errorResponse(
            404,
            `Student with ID ${studentId} is not found`
          )
        );

      let tempId = student.id;
      let report = await studentReportController.createStudentReport({
        date,
        attendance: true,
        studentId: tempId,
      });
      attendancesRes.push(report);
    })
  );

  //create update student report
  // await Promise.all(
  //   absentStudents.map(async (student) => {
  //     let tempId = student.id;
  //     let report = await studentReportController.createStudentReport({
  //       date,
  //       attendance: false,
  //       studentId: tempId,
  //     });
  //     attendancesRes.push(report);
  //   })
  // );

  return res.json(Response.successResponse(attendancesRes));
};

export const getAttendances = async (req, res, next) => {
  const { classId } = req.params;

  const _class = await ClassSchema.findOne({
    ClassID: classId,
  });

  if (!_class) {
    return res.json(Response.errorResponse(404, "Class not found!"));
  }

  const attendances = await StudentReportSchema.find({
    ClassID: _class.id,
  }).select("StudentID Date Attendance");

  return res.json(Response.successResponse(attendances));
};

export const deleteAttendance = async (req, res, next) => {
  // delete all attendances of a date of a class
  const { classId } = req.params;
  const { date } = req.body;

  console.log(req.body);

  const _class = await ClassSchema.findOne({
    ClassID: classId,
  });

  await StudentReportSchema.deleteMany({
    ClassID: _class._id,
    Date: date,
  });

  return res.json(Response.successResponse());
};

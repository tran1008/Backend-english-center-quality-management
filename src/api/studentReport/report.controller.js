import mongoose from "mongoose";
import responseTemplate from "../helpers/response.js";
import StudentReportSchema from "../model/student-report.schema.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";

function getTotalScore({ homeworkScore, testScore } = {}) {
  let totalScore;
  if (homeworkScore === -1) {
    totalScore = testScore === -1 ? 0 : testScore;
  } else {
    totalScore =
      testScore === -1
        ? homeworkScore
        : (parseFloat(homeworkScore) + parseFloat(testScore)) / 2;
  }
  return totalScore;
}

function getReportResultTotal(reports) {
  let totalScore = 0,
    totalTestScore = 0,
    totalHomeworkScore = 0,
    totalAttended = 0,
    homeworkRequired = 0,
    testRequired = 0;
  let totalReport = 0;
  reports.map((report) => {
    totalReport += report.TotalReport;
    totalScore += report.TotalScore;
    totalTestScore += report.TestScore == -1 ? 0 : report.TestScore;
    (totalHomeworkScore +=
      report.HomeworkScore == -1 ? 0 : report.HomeworkScore),
      (homeworkRequired += report.HomeworkScoreRequired),
      (testRequired += report.TestScoreRequired),
      (totalAttended += report.Attendance);
  });
  let sumScore = totalTestScore + totalHomeworkScore,
    maxScore = homeworkRequired + testRequired;
  let evalStr;
  let evalScore = sumScore / maxScore;
  if (evalScore >= 0.8) {
    evalStr = "Good";
  } else if (evalScore < 0.8 && evalScore > 0.5) {
    evalStr = "Medium";
  } else {
    evalStr = "Not-Good";
  }

  return {
    TotalReport: totalReport,
    TotalAttented: totalAttended,
    TotalTestScore: totalTestScore,
    TotalHomeworkScore: totalHomeworkScore,
    TotalScore: totalScore,
    TotalHomeworkScoreRequired: homeworkRequired,
    TotalTestScoreRequired: testRequired,
    AverageTestScore: parseFloat(totalTestScore / totalReport),
    AverageHomeworkScore: parseFloat(totalHomeworkScore / totalReport),
    AverageTotalScore: parseFloat(totalScore / totalReport),
    Evaluation: evalStr,
  };
}

function getReportResultMonthly(reports, totalReport) {
  let totalScore = 0,
    totalTestScore = 0,
    totalHomeworkScore = 0,
    totalAttended = 0,
    homeworkRequired = 0,
    testRequired = 0;

  reports.map((report) => {
    totalScore += report.TotalScore;
    totalTestScore += report.TestScore == -1 ? 0 : report.TestScore;
    (totalHomeworkScore +=
      report.HomeworkScore == -1 ? 0 : report.HomeworkScore),
      (homeworkRequired += report.HomeworkScoreRequired),
      (testRequired += report.TestScoreRequired),
      (totalAttended =
        report.Attendance == true ? totalAttended + 1 : totalAttended);
  });
  let sumScore = totalTestScore + totalHomeworkScore,
    maxScore = homeworkRequired + testRequired;
  let evalStr;
  let evalScore = sumScore / maxScore;
  if (evalScore >= 0.8) {
    evalStr = "Good";
  } else if (evalScore < 0.8 && evalScore > 0.5) {
    evalStr = "Medium";
  } else if (evalScore < 0.5 && evalScore > 0) {
    evalStr = "Not-good";
  } else {
    evalStr = "Non";
  }

  return {
    TotalReport: totalReport,
    TotalAttented: totalAttended,
    TotalTestScore: totalTestScore,
    TotalHomeworkScore: totalHomeworkScore,
    TotalScore: totalScore,
    TotalHomeworkScoreRequired: homeworkRequired,
    TotalTestScoreRequired: testRequired,
    AverageTestScore: parseFloat(totalTestScore / totalReport),
    AverageHomeworkScore: parseFloat(totalHomeworkScore / totalReport),
    AverageTotalScore: parseFloat(totalScore / totalReport),
    Evaluation: evalStr,
  };
}

async function getStudentReportOverview(studentId) {
  try {
    let student = await StudentSchema.findOne({ StudentID: studentId }).catch(
      (err) => {
        throw err;
      }
    );
    if (!student) {
      return null;
    }

    let reports = await getStudentReports({ studentId: student.id }).catch(
      (err) => {
        console.log(err);
        throw err;
      }
    );
    return {
      Student: student,
      TotalResult: getReportResultMonthly(reports.reportsDb, reports.count),
    };
  } catch (err) {
    return null;
  }
}

async function getStudentReportOverviewByClass(classId) {
  try {
    let students = await StudentSchema.find({ NameClass: classId }).catch(
      (err) => {
        throw err;
      }
    );

    let result = [];
    for (let student of students) {
      let reports = await getStudentReportsByClassID({
        studentId: student.id,
      }).catch((err) => {
        console.log(err);
        throw err;
      });

      result.push({
        Student: student,
        TotalResult: getReportResultMonthly(reports.reportsDb, reports.count),
      });
    }

    return result;
  } catch (err) {
    return null;
  }
}
// Get Student ReportByClassID
async function getStudentReportsByClassID({
  classId = null,
  studentId = null,
  month = null,
  year = null,
  date = null,
} = {}) {
  try {
    const queries = {};
    if (classId) {
      let classDB = await ClassSchema.findOne({ ClassID: classId });
      if (!classDB) {
        throw new Error("Class not found.");
      }
      queries.NameClass = classDB.ClassID;
    }

    if (studentId) queries.StudentID = studentId;
    if (month && year) {
      queries.Month = month;
      queries.Year = year;
    }
    if (date) {
      let nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      queries.Date = date;
    }

    const reportsDb = await StudentReportSchema.find(queries).catch((err) => {
      console.log(err);
    });
    if (!reportsDb) {
      throw new Error("Cannot get report");
    }
    return { reportsDb, count: reportsDb.length };
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

// Get Student Report
async function getStudentReports({
  classId = null,
  studentId = null,
  month = null,
  year = null,
  date = null,
} = {}) {
  try {
    const queries = {};
    if (classId) queries.ClassID = classId;
    if (studentId) queries.StudentID = studentId;
    if (month && year) {
      queries.Month = month;
      queries.Year = year;
    }
    if (date) {
      let nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      queries.Date = date;
    }

    const reportsDb = await StudentReportSchema.find(queries).catch((err) => {
      console.log(err);
    });
    if (!reportsDb) {
      throw "cannot get report";
    }
    return { reportsDb, count: reportsDb.length };
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

// Create or Update Report
export default class studentReportController {
  static async createStudentReport({
    date = null,
    attendance = null,
    homeworkScore = -1,
    testScore = -1,
    studentId = null,
    testScoreRequired = 0,
    homeworkScoreRequired = 0,
  } = {}) {
    try {
      if (!date || !studentId) {
        throw "Date and StudentId are needed to create report!";
      }
      // Find Report
      const reportData = {
        StudentID: studentId,
        Date: new Date(date),
      };

      const reportDb = await StudentReportSchema.findOne(reportData);
      if (!reportDb) {
        let student = await StudentSchema.findById(studentId);
        // Create new report
        let month = reportData.Date.getMonth() + 1;
        // Get total Score
        let totalScore = getTotalScore({ homeworkScore, testScore });
        const newReport = await StudentReportSchema.create({
          ...reportData,
          Month: month,
          Year: reportData.Date.getFullYear(),
          Attendance: attendance,
          HomeworkScore: homeworkScore,
          TestScore: testScore,
          TotalScore: totalScore,
          HomeworkScoreRequired: homeworkScoreRequired,
          TestScoreRequired: testScoreRequired,
          ClassID: student.ClassID,
        });
        return newReport;
      } else {
        // Update report
        let updateData = {
          HomeworkScore:
            homeworkScore === -1 ? reportDb.HomeworkScore : homeworkScore,
          HomeworkScoreRequired:
            homeworkScore === -1
              ? reportDb.HomeworkScoreRequired
              : homeworkScoreRequired,
          TestScore: testScore === -1 ? reportDb.TestScore : testScore,
          TestScoreRequired:
            testScore === -1 ? reportDb.TestScoreRequired : testScoreRequired,
          Attendance:
            attendance === null ? reportDb.Attendance : attendance,
        };

        let newTotalScore = getTotalScore({
          homeworkScore: updateData.HomeworkScore,
          testScore: updateData.TestScore,
        });
        const updatedReport = await reportDb.updateOne({
          ...updateData,
          TotalScore: newTotalScore,
        });
        return updatedReport;
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // Get Student Report inside Backend
  static async getStudentReports({
    classId = null,
    studentId = null,
    month = null,
    year = null,
    date = null,
  } = {}) {
    try {
      const reports = await getStudentReports({
        classId,
        studentId,
        month,
        year,
        date,
      });
      return reports.reportsDb;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  static async getStudentMonthlyReportAPI(req, res, next) {
    try {
      const { studentid } = req.params;
      if (!studentid) {
        throw "StudentId is required";
      }
      let student = await StudentSchema.findById(studentid);
      if (!student) {
        throw "Student Not Found";
      }
      let reports = await StudentReportSchema.aggregate([
        { $match: { StudentID: new mongoose.Types.ObjectId(student.id) } },
        {
          $project: {
            Month: 1,
            Year: 1,
            TestScore: 1,
            HomeworkScore: 1,
            TotalScore: 1,
            HomeworkScoreRequired: 1,
            TestScoreRequired: 1,
            attended: {
              $cond: [{ $eq: ["$Attendance", true] }, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: {
              Year: "$Year",
              Month: "$Month",
            },
            TotalReport: { $count: {} },
            AvgTestScore: { $avg: "$TestScore" },
            AvgHomeWorkScore: { $avg: "$HomeworkScore" },
            AvgTotalScore: { $avg: "$TotalScore" },
            TestScore: { $sum: "$TestScore" },
            HomeworkScore: { $sum: "$HomeworkScore" },
            TotalScore: { $sum: "$TotalScore" },
            HomeworkScoreRequired: { $sum: "$HomeworkScoreRequired" },
            TestScoreRequired: { $sum: "$TestScoreRequired" },
            Attendance: { $sum: "$attended" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]).catch((err) => {
        console.log(err);
      });

      let reportResponse = {
        Student: student,
        Reports: reports,
        Result: getReportResultTotal(reports),
      };
      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponse));
    } catch (error) {
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  static async getMonthlyReportAPI(req, res, next) {
    try {
      const { classid, month, year } = req.query;
      let queryObj = {};
      if (classid) {
        queryObj.ClassID = new mongoose.Types.ObjectId(classid);
      }
      if (month && year) {
        queryObj.Year = parseInt(year);
        queryObj.Month = parseInt(month);
      }

      let reports = await StudentReportSchema.aggregate([
        { $match: queryObj },
        {
          $project: {
            Year: 1,
            Month: 1,
            StudentID: 1,
            TestScore: 1,
            HomeworkScore: 1,
            TotalScore: 1,
            HomeworkScoreRequired: 1,
            TestScoreRequired: 1,
            attended: {
              $cond: [{ $eq: ["$Attendance", true] }, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: "$StudentID",
            TotalReport: { $count: {} },
            AvgTestScore: { $avg: "$TestScore" },
            AvgHomeWorkScore: { $avg: "$HomeworkScore" },
            AvgTotalScore: { $avg: "$TotalScore" },
            TestScore: { $sum: "$TestScore" },
            HomeworkScore: { $sum: "$HomeworkScore" },
            TotalScore: { $sum: "$TotalScore" },
            HomeworkScoreRequired: { $sum: "$HomeworkScoreRequired" },
            TestScoreRequired: { $sum: "$TestScoreRequired" },
            Attendance: { $sum: "$attended" },
            Month: { $first: "$Month" },
            Year: { $first: "$Year" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]).catch((err) => {
        console.log(err);
      });

      let reportResponse = {
        Reports: reports,
      };
      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponse));
    } catch (error) {
      console.log(error);
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  //
  static async getStudentTotalReportAPI(req, res, next) {
    try {
      const { istop, classid } = req.query;
      console.log(req.query);
      let query = {};
      //Filter by typeClass
      if (req.query.typeClass) {
        query.TypeClass = req.query.typeClass;
      }
      if (req.query.classId) {
        query.ClassID = req.query.classId;
      }
      if (classid) {
        let classDB = await ClassSchema.findOne({ ClassID: classid });
        query.ClassID = classDB._id;
      }
      let Evaluation = "";
      if (req.query.evaluation) {
        Evaluation = req.query.evaluation;
      }
      let students = await StudentSchema.find(query).catch((err) => {
        throw err;
      });

      let reportResponses = [];
      await Promise.all(
        students.map(async (stu) => {
          let reportResponse = await getStudentReportOverview(stu.StudentID);
          if (Evaluation != "") {
            if (reportResponse.TotalResult.Evaluation == Evaluation) {
              reportResponses.push(reportResponse);
            }
          } else {
            reportResponses.push(reportResponse);
          }
        })
      );
      if (istop === "true" && reportResponses.length !== 0) {
        const result = reportResponses.filter(
          (report) => report.TotalResult.TotalScore > 0
        );
        result.sort(
          (a, b) =>
            b.TotalResult.AverageTotalScore - a.TotalResult.AverageTotalScore
        );
        reportResponses = result.slice(
          0,
          result.length < 5 ? result.length : 5
        );
      }
      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponses));
    } catch (error) {
      console.log(error);
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  static async getStudentTotalReportAPIByClassID(req, res, next) {
    try {
      const { istop } = req.query;
      const classId = req.params.classId; // Lấy classId từ params

      console.log(req.query);
      let query = {};
      //Filter by typeClass
      if (req.query.typeClass) {
        query.TypeClass = req.query.typeClass;
      }

      if (classId) {
        const classDB = await ClassSchema.findOne({ ClassID: classId });
        if (classDB) {
          query.NameClass = classDB.ClassID;
        } else {
          return res
            .status(404)
            .json(responseTemplate.errorResponse("Class not found."));
        }
      }
      let Evaluation = "";
      if (req.query.evaluation) {
        Evaluation = req.query.evaluation;
      }
      let students = await StudentSchema.find(query).catch((err) => {
        throw err;
      });

      let reportResponses = [];
      await Promise.all(
        students.map(async (stu) => {
          let reportResponse = await getStudentReportOverview(stu.StudentID);
          if (Evaluation != "") {
            if (reportResponse.TotalResult.Evaluation == Evaluation) {
              reportResponses.push(reportResponse);
            }
          } else {
            reportResponses.push(reportResponse);
          }
        })
      );
      if (istop === "true" && reportResponses.length !== 0) {
        const result = reportResponses.filter(
          (report) => report.TotalResult.TotalScore > 0
        );
        result.sort(
          (a, b) =>
            b.TotalResult.AverageTotalScore - a.TotalResult.AverageTotalScore
        );
        reportResponses = result.slice(
          0,
          result.length < 5 ? result.length : 5
        );
      }
      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponses));
    } catch (error) {
      console.log(error);
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  // Get Student Report API
  static async getStudentDailyReportAPI(req, res, next) {
    try {
      const { studentid, month, year, date } = req.query;
      console.log("query", req.query);
      // student
      let student = await StudentSchema.findById(studentid);
      if (!student) {
        throw "Student Not Found";
      }
      // report
      let reportResponse = {
        Student: student,
      };
      if (month && year) {
        let reportDb = await getStudentReports({
          studentId: student.id,
          month: month,
          year: year,
        });
        let totalReport = reportDb.count;
        let reports = reportDb.reportsDb;
        let monthlyResult = getReportResultMonthly(reports, totalReport);
        reportResponse.Result = monthlyResult;
        reportResponse.Reports = reports;
      } else if (date) {
        let currentDate = new Date(date);
        let currentMonth = currentDate.getMonth() + 1;
        // date-report
        let dateReport = await getStudentReports({ date: currentDate });
        if (!dateReport) {
          throw "Report Not Found";
        }
        // month-report
        let reportDb = await getStudentReports({
          studentId: student.id,
          month: currentMonth,
          year: currentDate.getFullYear(),
        });
        reportResponse.Reports = reportDb.reportsDb;
        reportResponse.Result = dateReport.reportsDb[0];
      } else {
      }

      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponse));
    } catch (error) {
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  // Get Studied Date / Month API
  static async getStudiedDateAPI(req, res, next) {
    try {
      const studentId = req.params.studentid;
      let response = {
        Date: [],
        Month: [],
      };
      // Get Month
      let reportMonths = await StudentReportSchema.aggregate([
        { $match: { StudentID: new mongoose.Types.ObjectId(studentId) } },
        {
          $group: {
            _id: {
              Year: "$Year",
              Month: "$Month",
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]).catch((err) => {
        console.log(err);
      });
      reportMonths.map((month) => {
        let m = month._id.Month < 10 ? "0" + month._id.Month : month._id.Month;
        let str = m + "/" + month._id.Year;
        response.Month.push(str);
      });
      // Get Date
      let reportDates = await StudentReportSchema.find({
        StudentID: studentId,
      }).sort({ Date: 1 });
      reportDates.map((report) => {
        let year = report.Date.getFullYear();
        let month = report.Date.getMonth() + 1;
        let monthStr = month < 10 ? "0" + month : month;
        let date = report.Date.getDate();
        let dateStr = date < 10 ? "0" + date : date;
        response.Date.push(year + "/" + monthStr + "/" + dateStr);
      });

      return res.status(200).json(responseTemplate.successResponse(response));
    } catch (err) {
      return res.json(responseTemplate.handlingErrorResponse(err));
    }
  }
}

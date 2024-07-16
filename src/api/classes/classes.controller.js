import ClassSchema from "../model/class.schema.js";

import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";

export default class ClassesController {
    //-------getAllClasses--------
    // static async getAllClasses(req, res, next) {
    //     try {
    //         const ClassType = req.query.classType;
    //         const ScoreIncome = req.query.scoreIncome;
    //         const ScoreDesire = req.query.scoreDesire;

    //         if (!ClassType && !ScoreIncome && !ScoreDesire){
    //             const classes = await ClassSchema.find();
    //             if(!classes) {
    //                 throw "error";
    //             }
    
    //             return res.status(200).json(Response.successResponse(classes));
    //         }
    //         else{
    //             const classes = await ClassSchema.find({
    //                 Type: ClassType, 
    //                 ScoreRequired: {$lte: ScoreIncome},
    //                 ScoreTarget: {$gte: ScoreDesire}
    //               });
    //             if(!classes) {
    //                 throw "error";
    //             }
    //             return res.status(200).json(Response.successResponse(classes));
    //         }
    //     }
    //     catch (error) {
    //         return res.json(Response.handlingErrorResponse(error));
    //     }
    // }
    //------getAllClassesByTeacherID------

    static async getClassesByTeacherID(req, res, next) {
      try {
        const classes = await ClassSchema.find({ TeacherID: req.params.id });
        if (!classes) {
          throw "error";
        }
        return res.status(200).json(Response.successResponse(classes));
      } 
      catch (error) {
        return res.json(Response.handlingErrorResponse(error));
      }
    }
    
    //-------getAllClasses--------
    static async getAllClasses(req, res, next) {
      try {
          const Type = req.query.classType;
          const ScoreIncome = req.query.scoreIncome;
          const ScoreDesire = req.query.scoreDesire;
          const TeacherName = req.query.teacherName; 
          let query = {}; 
  
          if (Type || ScoreIncome || ScoreDesire || TeacherName) {
              if (Type) {
                  query.Type = Type;
              }
              if (ScoreIncome) {
                  query.ScoreRequired = {$lte: ScoreIncome};
              }
              if (ScoreDesire) {
                  query.ScoreTarget = {$gte: ScoreDesire};
              }
              if (TeacherName) {
                  query.TeacherName = TeacherName;
              }
          }
          const classes = await ClassSchema.find(query);
          if (!classes) {
              throw "error";  
          }
          return res.status(200).json(Response.successResponse(classes));
      }
      catch (error) {
          return res.json(Response.handlingErrorResponse(error));
      }
  }
  
  //find class for search
  static async findClasses(req, res, next) {
    try {
      const query = req.query.query;
  
      const classes = await ClassSchema.find({
        $or: [
          { TeacherName: { $regex: query, $options: "i" } },
          { ClassID: { $regex: query, $options: "i" } }
        ]
      });
  
      return res.status(200).json(Response.successResponse(classes));
    } 
    catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  
  //---------getClassesById---------
  static async getClassesById(req, res, next) {
    try {
      const classes = await ClassSchema.findById(req.params.id);
      if (!classes) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(classes));
    } 
    catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //---------getClassesByTeacherID---------

  static async getClassesByTeacherID(req, res, next) {
    try {
      const classes = await ClassSchema.find({ TeacherID: req.params.id });
      if (!classes) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(classes));
    } 
    catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  
  //-----------createClasses------------

    static async createClasses(req, res) {
        try {
          console.debug("Creating Class...");
          const { Type, ScoreTarget } = req.body;
      
          let ClassID;
          if ((Type === "TC01" || Type === "TC02") && !isNaN(ScoreTarget)) {
            ClassID = `TOE${ScoreTarget}${`.`}${Math.floor(100 + Math.random() * 900)}`;
          } 
          else if (Type === "TC03" && !isNaN(ScoreTarget)) {
            ClassID = `IET${ScoreTarget}${`.`}${Math.floor(100 + Math.random() * 900)}`;
          } 
          else if (Type === "TC04" && !isNaN(ScoreTarget)) {
            ClassID = `TOEFL${ScoreTarget}${`.`}${Math.floor(100 + Math.random() * 900)}`;
          } 
          else {
            return res.status(400).json(Response.errorResponse("Invalid Type or ScoreTarget"));
          }
      
          const classExists = await ClassSchema.findOne({ ClassID });
          if (classExists) {
            return res.status(400).json(Response.errorResponse("ClassID already exists"));
          }
      
          const newClass = new ClassSchema({ ...req.body, ClassID });
          const savedClass = await newClass.save();
          return res.status(201).json(Response.successResponse(savedClass));
        } 
        catch (error) {
          return res.json(Response.handlingErrorResponse(error));
        }
      }
      

    //-------------updateClass-------------
    static async updateClasses(req, res) {
        try {
            console.debug("Updating...");
            const { id } = req.params;
            const updatedClass = await ClassSchema.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );
            if (!updatedClass) {
                return res.status(404).json(Response.errorResponse("Class not found"));
            }
            return res.json(Response.successResponse(updatedClass));
        } 
        catch (error) {
            return res.json(Response.handlingErrorResponse(error));
        }
    }
    
    //-------------deleteClass-------------
    static async deleteClasses(req, res) {
        try {
          const ClassId = req.params.id; 
          const deletedClass = await ClassSchema.findByIdAndDelete(ClassId); 
          if (!deletedClass) { 
            return res.status(404).json(Response.errorResponse("Class not found"));
          }
          return res.status(200).json(Response.successResponse("Class deleted successfully"));
        } 
        catch (error) {
          return res.json(Response.handlingErrorResponse(error));
        }
      }

    static async getClassInfoByClass(req, res){
       try {
          console.log("class id " + req.params.id)
         const classInfo = await ClassSchema.findOne({
           ClassID: req.params.id,
         });
         if (!classInfo) {
           throw "class does not exist";
         }
         return res.status(200).json(Response.successResponse(classInfo));
       } catch (error) {
         return res.json(Response.handlingErrorResponse(error));
       }
    }
}

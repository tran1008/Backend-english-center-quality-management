import Response from "../helpers/response.js";
import ClassSchema from "../model/class.schema.js";
import HomeworkSchema from "../model/homework.schema.js";

export const createHomework = async (req, res, next) => {
    const {
        Title,
        Date,
        ClassID
    } = req.body
    if (!Title || !Date || !ClassID) {
        return res.json(Response.errorResponse(500, "A homework test must be provided with title, date and classId!"))
    }

    const existingHomework = await HomeworkSchema.findOne({
        Title,
        Date,
        ClassID
    })
    if (existingHomework) {
        return res.json(Response.errorResponse(400, "Homework is already exists!"))
    }

    const newHomework = await HomeworkSchema.create(req.body)
    if (!newHomework) {
        return res.json(Response.errorResponse(400, "Can not create new homework!"))
    }

    return res.json(Response.successResponse(newHomework))
}

export const getHomework = async (req, res, next) => {
    const homework = await HomeworkSchema.find()

    return res.json(Response.successResponse(homework))
}

export const getHomeworkByClass = async (req, res, next) => {
    const _class = await ClassSchema.findOne({
        ClassID: req.params.classId
    })

    if (!_class) {
        return res.json(Response.errorResponse("Class not found!"))
    }

    const homework = await HomeworkSchema.find({
        ClassID: _class._id
    })

    return res.json(Response.successResponse(homework))
}
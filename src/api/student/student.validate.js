import Joi from 'joi'

const postStudentSchema =  {
    body: Joi.object().keys({
        Email: Joi.string().required(),
        PhoneNumber: Joi.string().trim().length(10).pattern(/^\d+$/).required(),
        DateOfBirthday: Joi.date().format('DD-MM-YYYY').required()
    })
}
export default postStudentSchema
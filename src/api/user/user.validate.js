import Joi from 'joi'

// const UserValidateSchema  = {
    const postUserSchema =  {
        body: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            email: Joi.string().required()
        })
    }
// }
export default postUserSchema
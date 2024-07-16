import Joi from 'joi'


const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
      return obj
    }, {})
  };
const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object)
  
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ')
      return res.status(404).json(errorMessage)
    }
    Object.assign(req, value);
    return next();
}

export default validate
import Joi from 'joi';

// Hàm pick để chọn các thuộc tính từ object
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  
  // Tạo các schema con cho từng phần của request (params, query, body)
  const schemas = {};
  if (validSchema.params) schemas.params = Joi.object(validSchema.params);
  if (validSchema.query) schemas.query = Joi.object(validSchema.query);
  if (validSchema.body) schemas.body = Joi.object(validSchema.body);
  
  // Tạo object chứa các giá trị để validate
  const validationObjects = {};
  if (schemas.params) validationObjects.params = req.params;
  if (schemas.query) validationObjects.query = req.query;
  if (schemas.body) validationObjects.body = req.body;
  
  // Validate từng phần của request
  for (const key of Object.keys(schemas)) {
    const { value, error } = schemas[key].validate(validationObjects[key], {
      errors: { label: 'key' },
      abortEarly: false
    });
    
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return res.status(400).json({ message: errorMessage });
    }
    
    validationObjects[key] = value;
  }
  
  // Gán các giá trị đã validate lại cho req
  Object.assign(req, validationObjects);
  return next();
};

export default validate;

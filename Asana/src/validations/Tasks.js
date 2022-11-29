const Joi = require("joi");
const createValidation = Joi.object({
  title: Joi.string().required().min(2),
  section_id: Joi.string().required().min(5),
  project_id: Joi.string().required().min(5),
  description: Joi.string().min(5),
  assigned_to: Joi.string().min(5),
  due_date: Joi.date(),
  statuses: Joi.array(),
  order: Joi.number(),
  isCompleted: Joi.boolean(),
  comments: Joi.array(),
  // likes: [
  //   {
  //     type: Mongoose.Types.ObjectId,
  //     ref: "user",
  //   },
  // ],
  media: Joi.array(),
  sub_tasks: Joi.array(),
});

const updateValidation = Joi.object({
  title: Joi.string().min(2),
  section_id: Joi.string().min(5),
  project_id: Joi.string().min(5),
  description: Joi.string().min(5),
  assigned_to: Joi.string().min(5),
  due_date: Joi.date(),
  statuses: Joi.array(),
  order: Joi.number(),
  isCompleted: Joi.boolean(),
  comments: Joi.array(),
  media: Joi.array(),
  sub_tasks: Joi.array(),
});

const commentValidation = Joi.object({
  comment: Joi.string().min(2),
  _id: Joi.string().min(2),
});

module.exports = {
  createValidation,
  updateValidation,
  commentValidation,
};

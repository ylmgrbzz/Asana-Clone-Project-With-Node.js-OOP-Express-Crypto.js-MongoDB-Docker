const Mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");
const ProjectSchema = new Mongoose.Schema(
  {
    name: String,
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ProjectSchema.pre("save", ( next,doc) => {
//     next();
//     console.log("Öncesi", doc);
// })

ProjectSchema.post("save", (doc) => {
  console.log("sonrası", doc);
  logger.log({
    level: "info",
    message: doc,
  });
  // loglama kayıt edildi
});

module.exports = Mongoose.model("project", ProjectSchema);

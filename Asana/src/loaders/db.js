const Mongoose = require("mongoose");
const db = Mongoose.connection;

db.once("open", () => {
  console.log("Database Bağlantısı Başarılı");
});

const connectDB = async () => {
  await Mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

module.exports = {
  connectDB,
};

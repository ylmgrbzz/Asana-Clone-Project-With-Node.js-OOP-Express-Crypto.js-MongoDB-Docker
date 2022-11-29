const eventEmitter = require("./eventEmitter");
module.exports = () => {
  eventEmitter.on("send_mail", (emailData) => {
    console.log("event alındı", data);
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    let info = transporter.sendMail({
      from: process.env.EMAIL_FROM, // sender address
      ...emailData,
    });
  });
};

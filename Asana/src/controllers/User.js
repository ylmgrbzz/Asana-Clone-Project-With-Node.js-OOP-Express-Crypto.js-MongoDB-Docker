const httpStatus = require("http-status");
const { response } = require("express");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const { restart } = require("nodemon");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const { MOVED_PERMANENTLY } = require("http-status");
const path = require("path");
const Service = require("../services/Users");
const UserService = new Service();
const projectService = require("../services/Projects");
const ProjectService = new projectService();

class User {
  create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    // const cryptedPassword = passwordToHash(req.body.password)
    // console.log(req.body.password,cryptedPassword);
    // return false;

    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }
  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    // console.log(req.body.password);
    UserService.findOne(req.body)
      .then((user) => {
        if (!user)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "böyle bir kullanıcı yok ylm" });
        // console.log(user);
        console.log("debug");

        user = {
          ...user.toObject(),
          tokens: {
            access_token: generateAccessToken(user),
            refresh_token: generateRefreshToken(user),
          },
        };

        // delete user.password;
        console.log(user);
        res.status(httpStatus.OK).send(user);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
  index(req, res) {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
  projectList(req, res) {
    req.user?._id;
    ProjectService.list({
      user_id: req.user?._id,
    })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch(() =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "projeleri getirirken hata olustu",
        })
      );
  }
  resetPassword(req, res) {
    //   "use strict";
    // const nodemailer = require("nodemailer");
    // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
    //   // Generate test SMTP service account from ethereal.email
    //   // Only needed if you don't have a real mail account for testing
    //   let testAccount = await nodemailer.createTestAccount();

    //   // create reusable transporter object using the default SMTP transport
    //   let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: testAccount.user, // generated ethereal user
    //       pass: testAccount.pass, // generated ethereal password
    //     },
    //   });

    //   // send mail with defined transport object
    //   let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });

    //   console.log("Message sent: %s", info.messageId);
    //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //   // Preview only available when sending through an Ethereal account
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // }

    // main().catch(console.error);

    // return false;
    const new_password =
      uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    // req.body.email;
    UserService.updateWhere(
      { email: req.body.email },
      { password: passwordToHash(new_password) }
    )
      .then((updatedUser) => {
        if (!updatedUser)
          return res.status(httpStatus.NOT_FOUND).send({
            error: "boyle bir kullanıcı yok",
          });
        eventEmitter.emit("send_email", {
          to: updatedUser.email, // list of receivers
          subject: "Şifre Sıfırlama", // Subject line
          html: "Talep üzerine şifre sıfırlama gerçekleşmiştir, yeni şifreniz : `${new_password}`", // html body
        });
        res.status(httpStatus.OK).send({
          message: "şifre sıfırlama için e posta adresine bilgi gönderildi",
        });
        // console.log(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "şifre sıfırlarken hata olustu" })
      );
  }
  update(req, res) {
    UserService.update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Güncelleme sırasında sorun olustu" })
      );
  }

  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Güncelleme sırasında sorun olustu" })
      );
  }

  deleteUser(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    UserService.delete(req.params?.id)
      .then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ error: "böyle bir kayıt yok" });
        }
        console.log(deletedItem);
        res.status(httpStatus.OK).send({ error: "kayıt silindi" });
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "silinme sırasında hata olustu",
        })
      );
  }

  updateProfileImage(req, res) {
    console.log(req.files);
    // console.log(__dirname);
    // console.log(path.join(__dirname, "../", "uploads/users"));

    // return false;
    if (!req?.files?.profile_image) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "yeterli veri yok" });
    }
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req?.user._id}${extension}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
      if (err)
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: err });
      UserService.update(req.user?._id, { profile_image: fileName })
        .then((updatedUser) => {
          res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((e) =>
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: "kayıt sırasında hata olsutu" })
        );
      console.log("resim yüklendi");
    });
  }
}

module.exports = new User();

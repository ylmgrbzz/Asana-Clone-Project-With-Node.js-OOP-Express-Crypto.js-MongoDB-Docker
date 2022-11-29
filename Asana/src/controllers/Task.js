// mantıksal işlemler
// const { insert, modify, list, remove, findOne } = require("../services/Tasks");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const { response } = require("express");

const Service = require("../services/Tasks");
const TaskService = new Service();

class Task {
  index(req, res) {
    if (!req?.params?.projectId)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "proje bilgisi eksik" });
    TaskService.list({ project_id: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  create(req, res) {
    req.body.user_id = req.user;
    TaskService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  update(req, res) {
    // console.log(req.params.id);
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    TaskService.update(req.params?.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "kayıt sırasında hata olustu",
        })
      );
  }

  deleteTask(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    TaskService.delete(req.params?.id)
      .then((deletedDoc) => {
        if (!deletedDoc) {
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

  makeComment(req, res) {
    console.log(req.body, req.params.id);
    TaskService.findOne({ _id: req.params.id }).then((mainTask) => {
      if (!mainTask)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "böyle bir kayıt yok" });
      const comment = {
        ...req.body,
        commented_at: new Date(),
        user_id: req.user,
      };
      mainTask.comments.push(comment);
      mainTask
        .save()
        .then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) =>
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "kayıt sırasında hata olustu",
          })
        );
      console.log(mainTask);
    });
    //   return false;
    //   req.body.user_id = req.user;
    //   req.body.commented_at = new Date();
    //   modify(req.body, req.params?.id)
    //     .then((updatedDoc) => {
    //       res.status(httpStatus.OK).send(updatedDoc);
    //     })
    //     .catch((e) =>
    //       res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    //         error: "kayıt sırasında hata olustu",
    //       })
    //     );
  }

  deleteComment(req, res) {
    console.log(req.body, req.params.id);
    TaskService.findOne({ _id: req.params.id }).then((mainTask) => {
      if (!mainTask)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "böyle bir kayıt yok" });
      mainTask.comments = mainTask.comments.filter(
        (c) => c.id?.toString !== req.params.commentId
      );
      mainTask
        .save()
        .then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) =>
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "kayıt sırasında hata olustu",
          })
        );
      console.log(mainTask);
    });
  }

  addSubTask(req, res) {
    if (!req.params.id)
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Id gerekli" });
    TaskService.findOne({ _id: req.params.id }).then((mainTask) => {
      if (!mainTask)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "böyle bir kayıt yok" });
      TaskService.create({ ...req.body, user_id: req.user })
        .then((subTask) => {
          mainTask.sub_tasks.push(subTask);
          mainTask
            .save()
            .then((updatedDoc) => {
              return res.status(httpStatus.OK).send(updatedDoc);
            })
            .catch((e) =>
              res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                error: "kayıt sırasında hata olustu",
              })
            );
        })
        .catch((e) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
        });
      // console.log(mainTask);
    });
  }

  fetchTask(req, res) {
    if (!req.params.id)
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Id gerekli" });
    TaskService.findOne({ _id: req.params.id }, true)
      .then((task) => {
        if (!task)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "böyle bir kayıt yok" });
        res.status(httpStatus.OK).send(task);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }
}
module.exports = new Task();

const httpStatus = require("http-status");
const { response } = require("express");
const Service = require("../services/Projects");
const ProjectService = new Service();
const ApiError = require("../errors/ApiError");

class Project {
  index(req, res) {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
  create(req, res) {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }
  update(req, res, next) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    ProjectService.update(req.params?.id, req.body)
      .then((updatedProject) => {
        if (!updatedProject)
          return next(new ApiError("böyle bir kayıt yok", 404));
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "kayıt sırasında hata olustu",
        })
      );
  }
  deleteProject(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    ProjectService.delete(req.params?.id)
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
}

module.exports = new Project();

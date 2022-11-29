const httpStatus = require("http-status");
const { response } = require("express");
const Service = require("../services/Sections");
const SectionService = new Service();

class Section {
  index(req, res) {
    if (!req?.params?.projectId)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "proje bilgisi eksik" });
    SectionService.list({ project_id: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
  create(req, res) {
    req.body.user_id = req.user;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }
  update(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    SectionService.update(req.params?.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "kayıt sırasında hata olustu",
        })
      );
  }
  deleteSection(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: " ıd bilgisi eksik",
      });
    }
    SectionService.delete(req.params?.id)
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
}

module.exports = new Section();

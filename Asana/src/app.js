const express = require("express");
const fileupload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events");
const {
  ProjectRoutes,
  UserRoutes,
  SectionRoutes,
  TaskRoutes,
} = require("./api-routes");
const path = require("path");
const uuid = require("uuid");
const { application } = require("express");
const { createLogger } = require("winston");
const errorHandler = require("./middlewares/errorHandler");
// const Service = require("./services/Service");
config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileupload());

app.listen(process.env.APP_PORT, () => {
  console.log("sunucu calısıyor");
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
  app.use("/sections", SectionRoutes);
  app.use("/tasks", TaskRoutes);

  app.use((req, res, next) => {
    console.log("Çalışıyor");
    const error = new Error("Aradığınız sayfa yok");
    error.status = 404;
    next(error);
  });
  app.use(errorHandler);
});

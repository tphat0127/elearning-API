const express = require("express");
const app = express();
var cors = require("cors");
const config = require("./config/index");
const mongoose = require("mongoose");

const ListCourseController = require("./controllers/ListCourse.controller");
const UserController = require("./controllers/User.controller");
const ListCategoryCourseController = require("./controllers/ListCategoryCourse.controller");

app.use(cors());
app.use(express.json());

app.use("/api", ListCourseController);
app.use("/api", UserController);
app.use("/api", ListCategoryCourseController);
app.get("/", (req, res) => [res.send("well come elearning")]);
app.use("/img", express.static("img"));

console.log("config", config.MONGO_URI);
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to database successfully");
  })
  .catch(console.log);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

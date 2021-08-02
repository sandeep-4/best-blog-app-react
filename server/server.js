const express = require("express");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const user = require("./routes/user");
const post = require("./routes/post");
const comment = require("./routes/comment");

//const
const port = process.env.PORT;
const mongoDb = process.env.MONGODB;

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "5mb", type: "*/*" }));
app.use(morgan("dev"));

// readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

//routes
app.use("/api", user);
app.use("/api", comment);
app.use("/api", post);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

mongoose
  .connect(mongoDb, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongoDb");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Hello api",
  });
});

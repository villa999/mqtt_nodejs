const express = require("express");

//Su dung logger de client request len cai gi
const logger = require("morgan");

//Config body-parser
const bodyParser = require("body-parser");

//Config config lib
const config = require("config");

//db Mongoose
const mongoClient = require("mongoose");

const socketio = require("socket.io");
const mqtt = require("mqtt");
// connect mongodb by mongoose

const uris =
  "mongodb+srv://anhpv:anhpv@cluster0.et3z1.mongodb.net/mqtt?retryWrites=true&w=majority";
mongoClient
  .connect(uris, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ connect successfully…");
  })
  .catch((error) => {
    console.error(`❌ connect failed with error : ${error}`);
  });

// mongoClient
//   .connect("mongodb://localhost/mqtt-nodejs", {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("✅ connect successfully…");
//   })
//   .catch((error) => {
//     console.error(`❌ connect failed with error : ${error}`);
//   });

const app = express();
const routerMQTT = require("./routes/mqtt");

//Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

//Routes
app.use("/mqtt", routerMQTT);

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "Server is update OK" });
});

//Cath 404 errors
// app.use((req, res, next) => {
//   const err = new Error("Not found");
//   err.status = 404;
//   next(err);
// });

// //Function for handle error
// app.use((err, req, res, next) => {
//   console.log(err);
//   //get error
//   const error = app.get("env") === "♿ development" ? err : {};

//   //get status of error
//   const status = err.status || 500;

//   //response to client
//   return res.status(status).json({
//     error: {
//       message: error.message,
//     },
//   });
// });

//const port = app.get("port") || 3000 || process.env.PORT;
const port = config.get("app.PORT");
// app.listen(port, () => {
//   console.log(`⛎ Server is listening on port ${port}`);
// });
var server = app.listen(port, "localhost", function (req, res) {
  console.log("Đang chạy cổng 3000");
});

var io = socketio(server);
io.on("connection", function (socket) {
  socket.on("sensor1", function (data) {
    io.sockets.emit("message", data);
  });
});

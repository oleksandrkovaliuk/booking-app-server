require("dotenv").config();
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const express = require("express");
const { Server } = require("socket.io");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const mainRouters = require("./routes/mainRoutes");
const dbClientConnection = require("./config/database");
const dbClientConnection = require("./config/database");
const defaultCorsSettings = require("./barear/corsSettings");

const handleReservationEvent = require("./socketEvents/handleReservationEvent");
const handleNotificationUpdate = require("./socketEvents/handleNotificationUpdate");
const handleNotificationReaded = require("./socketEvents/handleNotificationReaded");
// const handleUpdateConversation = require("./socketEvents/handleUpdateConversation");
const handleOnEnterConversetion = require("./socketEvents/handleJoinTheRoom");
const handleJoinTheRoom = require("./socketEvents/handleJoinTheRoom");
const handleUpdateConversation = require("./socketEvents/handleUpdateConversation");
const markAsReadByReciever = require("./api/chats/markAsReadByReciever");

const app = express();
const PORT = process.env.PORT;
const http_server = require("http").createServer(app);

const io = new Server(http_server, {
  cors: defaultCorsSettings,
});

const http_server = require("http").createServer(app);

const io = new Server(http_server, {
  cors: defaultCorsSettings,
});

const setupRoutes = () => {
  app.use(cors(defaultCorsSettings));

  app.use(function (req, res, next) {
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  app.use("/api", mainRouters);
  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });
};
const setupMiddlewares = () => {
  app.use(logger("dev"));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, "public")));

  app.use(express.urlencoded({ extended: false })); // default true

  app.use(express.json({ limit: "10mb" }));
};

const setupDataBase = async () => await dbClientConnection.connect();

const proccesSockets = () => {
  io.on("connection", (socket) => {
    socket.on("markMessagesAsReaded", async (data) => {
      try {
        const { succes } = await markAsReadByReciever({
          viewer: data.viewer,
          chatId: data.chatId,
        });
        if (succes) {
          socket.emit("messagesReadedSuccesfully", {
            chatId: data.chatId,
            message: "Messages have been marked as readed",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
    handleReservationEvent(socket, io);

    handleNotificationReaded(socket, io);
    handleNotificationUpdate(socket, io);

    handleJoinTheRoom(socket, io);
    handleUpdateConversation(socket, io);

    // socket.on("requestJoinRoom", (data) => {
    //   socket.join(data.chatId);
    //   console.log(`${socket.id} joined room: ${data.chatId}`);
    //   socket.emit(`${data.chatId}JoinedSuccessfully`, {
    //     chatId: data.chatId,
    //     message: "You have joined the room",
    //   });
    // });
    // socket.on("requestUpdateConversation", (data) => {
    //   if (!data.chatId) return;
    //   console.log("Current rooms:", socket.rooms);
    //   console.log("RoomId", data.chatId);
    //   io.to(data.chatId).emit("readyToBeUpdate", {
    //     chatId: data.chatId,
    //     message: "A user has entered the conversation",
    //   });
    // });
  });
};

async function init() {
  try {
    setupMiddlewares();
    await setupDataBase();
    setupRoutes();

    proccesSockets();
    http_server.listen(PORT, () => {
      console.log(
        `\x1b[42m${process.env.PROD}\x1b[0m \x1b[31m${"project stage"}\x1b[0m`
      );
      return console.log(
        `\x1b[42mServer is listening on\x1b[0m  \x1b[31mhttp://localhost:${PORT}\x1b[0m`
      );
    });
  } catch (error) {
    throw new Error(`Could not init application: ${error}`);
  }
}

init();

module.exports = app;

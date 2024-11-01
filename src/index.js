require("dotenv").config();
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const express = require("express");
const { Server } = require("socket.io");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const mainRouters = require("./routes/mainRoutes");
const dbClientConnection = require("./config/database");
const defaultCorsSettings = require("./barear/corsSettings");

const markAsReadByReciever = require("./api/chats/markAsReadByReciever");
const insertSpecificNotification = require("./api/user/notifications/insertSpecificNotification");
const deleteSpecificNotifications = require("./api/user/notifications/deleteSpecificNotification");

const app = express();
const PORT = process.env.PORT;
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
    socket.on("newReservationReq", async (data) => {
      await insertSpecificNotification({
        type: data.type,
        message: data.message,
        user_email: data.user_email,
        listing_id: data.listing_id,
        redirect_href: data.redirect_href,
      });
      socket.emit(`${data.user_email} newReservation`);
    });

    socket.on("enteredConversetion", async (data) => {
      if (!data.reciever || !data.chatId || !data.type) return;
      await markAsReadByReciever({
        reciever: data.reciever,
        chatId: data.chatId,
      });

      await deleteSpecificNotifications(data.reciever);

      socket.emit(`${data.chatId} message_readed`);
    });

    socket.on("markNotificationAsRead", async (data) => {
      if (!data.reciever || !data.type) return;
      await deleteSpecificNotifications(data.reciever, data.type);
    });
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

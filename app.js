const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");
const Sentry = require("@sentry/node");
const cors = require("cors");
const FileUploadRouter = require("./routes/fileUploadRoute");

// Configs
Sentry.init({ dsn: process.env.SENTRY_DSN });
const limiter = rateLimit({
  windowMs: 0.2 * 60 * 1000, // 15 minutes
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

// Middlewares
app.use(Sentry.Handlers.requestHandler());
app.use(helmet());
app.use(limiter);
app.use(passport.initialize());
require("./passport");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/order", passport.authenticate("jwt", { session: false }), orderRoute);
app.use("/auth", authRoute);
app.use("/file", FileUploadRouter);

app.get("/", (req, res) => {
  return res.json({ status: true });
});

app.get(
  "/test-protection",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.send({ success: "TRUE" });
  }
);

// 404 route
app.use("*", (req, res) => {
  return res.status(404).json({ message: "route not found" });
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.

  res.statusCode = 500;
  res.end(res.sentry + "\n");
  console.log(err);
  // return res.status(500).json(err.message);
});

module.exports = app;

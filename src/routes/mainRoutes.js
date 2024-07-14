const express = require("express");
const router = express.Router();

router.route("/check/working").get((req, res) => {
  console.log("working");
  res.status(200).json({
    message: "working",
  });
});
router.route("/check/working").post((req, res) => {
  console.log(req.body.code, "working");
  res.status(200).json({
    message: "working",
  });
});
module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const {
  getUserNames,
  togglePassword,
  login,
  sign,
} = require("../services/services");

router.get("/", (req, res) => {
  res.render("login", { title: "", css: "log" });
});

router.get("/users", (req, res) => {
  User.find().then((result) => {
    res.json(result);
  });
});

router.get("/usernames", getUserNames);

router
  .route(`/pass`)
  .post(togglePassword)
  .delete(togglePassword);


router.post("/go&:username", (req, res) => {
  let username = req.params.username;
  User.find().then((result) => {
    result.forEach((userObj) => {
      if (username == userObj.userName) {
        /*          res.render("index", {
            title: userObj.name || "unkown",
            css: "index",
            result: userObj.passs,
            id: userObj._id,
          }); */
      }
    });
  });
});

router.post("/login", login);


router.post("/sign", sign);




module.exports = router;

const User = require("../models/userSchema");

module.exports.getUserNames = async (req, res) => {
  let arr = await User.find();
  let result = [];
  arr.forEach(({ userName }) => {
    result.push(userName);
  });
  res.send(result);
};

module.exports.togglePassword = async (req, res) => {
  let method = req.method.toLowerCase();
  let userId = req.query.userId, passwordsArray;
  const us = await User.findById(userId);
  if (method == "delete") {
     passwordsArray = us.passs.filter((e) => {
      if (e.id != req.query.linkId) {
        return e;
      }
    });
  } else if (method == "post") {
     passwordsArray = [
      ...us.passs,
      {
        id: req.query.linkId,
        link: req.query.link,
        password: req.query.password,
      },
    ];
  }

  const doc = await User.findByIdAndUpdate(userId, {
      passs: passwordsArray
  });
  doc.save().then((r) => {
    res.send(r);
  });
};

module.exports.login = async (req, res) => {
  let username = req.body.userName;
  User.find().then((result) => {
    result.forEach((userObj) => {
      if (username == userObj.userName) {
        res.render("index", {
          title: userObj.name || "unkown",
          css: "index",
          result: userObj.passs,
          id: userObj._id,
        });
      }
    });
  });
};

module.exports.sign = async (req, res) => {
  let userObj = {
    userName: req.body.userName,
    name: req.body.name,
    password: req.body.password,
    passs: [],
  };
  const user = new User(userObj);
  user
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(`${"*".repeat(20)}
Error on sending the schema to the data base
*****
${err} \n ${"*".repeat(20)}`);
    });
};

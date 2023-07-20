const express = require("express");
const app = express();
const port = 3500;
const mongoose = require("mongoose");
const User = require("./models/userSchema");



function ejs() {
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
}
ejs();
function connect() {
  console.log("connecting...");
  mongoose
    .connect(
      "mongodb+srv://ahmed:ahmed@cluster0.qrye7.mongodb.net/password_app?retryWrites=true&w=majority"
    )
    .then(() => {
      app.listen(port, () => {
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  example app listening at http://localhost:${port}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
      });
    })
    .catch((err) => {
      console.log(`===================================
  Error on Connection with DataBase
===================================
  ${err}
===================================`);
    });
}
connect();

function routing() {
  app.get("/", (req, res) => {
    res.render("login", { title: "", css: "log" });
  });
  // app.get('/login', function(req, res){
  //   res.render('index', { title: req.session.user, css: "index" });
  // });
}
routing();


app.post("/go&:username", (req, res) => {
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
})


function api() {
  app.get("/users", (req, res) => {
    User.find().then((result) => {
      res.json(result);
    });
  });
  app.get("/usernames", async (req, res)=>{
    let arr = await User.find()
    let result = []
    arr.forEach((obj)=>{
      result.push(obj.userName)
    })
    res.send(result)
  })

  app.post(`/sendpass&:userId&:linkId&:link&:password`, async (req, res) => {
    let userId = req.params.userId
    const us = await User.findById(userId)
  console.log(us)
  const doc = await User.findByIdAndUpdate(userId, {
  
    passs: [...us.passs ,{id: req.params.linkId, link: req.params.link, password: req.params.password }],
  });
  doc.save().then(() => {
    res.send(true);
  });
  })

  app.post(`/delete-pass&:userId&:linkId`, async (req, res)=>{
    console.log("posted to delete password", req.params.userId, req.params.linkId)
    res.send(true)
    let userId = req.params.userId
    const us = await User.findById(userId)
  const doc = await User.findByIdAndUpdate(userId, {
    passs: us.passs.filter((e)=>{
      if (e.id != req.params.linkId){
        return e;
      }
    }),
  });
  doc.save().then(() => {
    res.send(true);
  });
  })
}
api();


function login() {
  app.post("/login", async (req, res) => {
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
  });

}
login();

function sign() {
  app.post("/sign", (req, res) => {
    let userObj = {
      userName: req.body.userName,
      name: req.body.name,
      password: req.body.password,
      passs: [],
    };
    const user = new User(userObj);
    user
      .save()
      .then(()=>{
        res.redirect("/")
      })
      .catch((err) => {
        console.log(`${"*".repeat(20)}
Error on sending the schema to the data base
*****
${err} \n ${"*".repeat(20)}`);
      });
  });
}
sign();

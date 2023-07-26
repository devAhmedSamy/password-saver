/* ctrl + shift + [ => fold the current bracket */
function getData(link = "/users") {
  return new Promise((resolve, reject) => {
    let r = new XMLHttpRequest();
    r.open("GET", `http://localhost:3500${link}`);
    r.send();
    r.onload = function () {
      resolve(JSON.parse(r.response));
    };
  });
}

function req(fullLink, method = "post") {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(method, `${fullLink}`);
    request.send();
    request.onload = function () {
      resolve(JSON.parse(request.response));
    };
  });
}

let loginForm = document.forms[0]
let signForm = document.forms[1]

login();
sign();

// function alert(msg) {
//   let box = document.querySelector(".alertBox");
//   let text = document.querySelector(".alertBox .text");
//   let exit = document.querySelector(".alertBox .exit");
//   text.innerHTML = msg;
//   box.classList.add("show");
//   exit.onclick = () => {
//     box.classList.toggle("show");
//   };
// }

function login() {
  let notesArr = [
    0,
    document.querySelector(".login .usernameMsg"),
    document.querySelector(".login .passMsg"),
  ];

  function Msg(input = 1, msg = "", method = 1) {
    if (method == 0) {
      notesArr[0].style.display = "none";
      notesArr[1].style.display = "none";
      notesArr[2].style.display = "none";
    } else {
      notesArr[input].style.display = "block";
      notesArr[input].innerHTML = msg;
      if (msg == "") {
        notesArr[input].display = "none";
      }
    }
  }
  


  async function validate(usernameI, passwordI) {
    let username = usernameI.value;
    let password = passwordI.value;
    let checked;
    let isRight = false;
    if (username.length < 1) {
      Msg(1, "Username is required");
      checked = false;
    } else {
      Msg(1);
    }
    if (password.length < 1) {
      Msg(2, "The password is required");
      checked = false;
    } else {
      Msg(2);
    }
    if (checked == undefined) {
      let usersArray = await getData()
      usersArray.forEach((userObj) => {
        if (userObj.userName == username && userObj.password == password) {
          isRight = true
          checked = true;
        }
      });
      if (!isRight){
        Msg(2, "The username or the password may be wrong. try again.");
      } 
    } 
    return checked
  }
  document.title = "Login";
  let form = document.forms[0];
  let usernameI = document.getElementById("loginUsername");
  let passwordI = document.getElementById("loginPassword");
  let signBtn = document.getElementById("sign");

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  let isValidate = await validate(usernameI, passwordI)
  if (isValidate) {
    console.log(req(`/go&${usernameI.value}`))
    document.cookie = `username=${usernameI.value};password=${passwordI.value};secure`
    form.submit()
    // window.location.replace("/app")
  }
})

  signBtn.onclick = function () {
    form.style.display = "none";
    signForm.style.display = "grid";
    document.title = "Sign up";
  };
}


function sign() {
  let notesArr = [
    document.querySelector(".sign .nameMsg"),
    document.querySelector(".sign .usernameMsg"),
    document.querySelector(".sign .passMsg"),
  ];
  async function validateUserName(username) {
    let usersArray = await getData("/usernames")
    console.log(usersArray)
    console.log(username)
    let userExists = usersArray.indexOf(username) != -1;
    console.log(userExists)
    
    if (userExists) {
      Msg(1, "This username is used. Please try another one");
    } else {
      Msg(1);
    }
    return !userExists
}

  function Msg(input = 1, msg = "", method = 1) {
    if (method == 0) {
      notesArr[0].style.display = "none";
      notesArr[1].style.display = "none";
      notesArr[2].style.display = "none";
    } else {
      notesArr[input].style.display = "block";
      notesArr[input].innerHTML = msg;
      if (msg == "") {
        notesArr[input].display = "none";
      }
    }
  }

  function validate(nameI, usernameI, passwordI) {
    let name = nameI.value;
    let username = usernameI.value;
    let password = passwordI.value;
    let checked = true;
    if (name.length < 4) {
      Msg(0, "name is required");
      checked = false;
    } else {
      Msg(0);
    }
    if (username.length < 1) {
      Msg(1, "Please write a username");
      checked = false;
    } else {
      Msg(1);
    }
    if (password.length < 1) {
      Msg(2, "The password is required");
      checked = false;
    } else {
      Msg(2);
    }
    return checked;
  }

  let form = document.forms[1];
  let nameI = document.getElementById("name");
  let userNameI = document.getElementById("signUserName");
  let passwordI = document.getElementById("signPassword");
  let logBtn = document.getElementById("log");


  logBtn.onclick = () => {
      signForm.style.display = "none";
      loginForm.style.display = "grid";
      document.title = "Login";
  }
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (validate(nameI, userNameI, passwordI)) {
      let isValidUsername = await validateUserName(userNameI.value);
      if (isValidUsername) {
        this.submit();
      }
    }
  });
}

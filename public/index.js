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

function sendData(link) {
  return new Promise((resolve, reject) => {
    let r = new XMLHttpRequest();
    r.open("post", `http://localhost:3500/sendpass&${link}`);
    r.send();
    r.onload = function () {
      resolve(true);
    };
  });
}

// console.log(getData())

// getData().then((res) => {
//   console.log(res)
// })

let logout = document.querySelector(".logout");
let form = document.forms[0];
let resscont = document.querySelector(".result-cont");

let id = form.id.value;





form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let link = form.link.value;
  let password = form.password.value;
  form.link.value = "";
  form.password.value = "";
  form.link.focus();
  let re = document.createElement("div");
  let i = document.createElement("i");
  let linkId = `${Date.now()}${Math.floor(Math.random() * 10)}`;
  let span = document.createElement("span");
  span.classList.add("material-symbols-outlined");
  span.classList.add("delete");
  span.innerText = "delete";
  span.addEventListener("click", deleteResult)
  re.classList.add("result");
  re.setAttribute("data-pass", password);
  re.setAttribute("data-id", linkId);
  re.innerText = link;
  i.innerText = "Click to copy";
  re.append(i);
  re.append(span);
  resscont.append(re);
  resultC = document.querySelectorAll(".result");
  console.log(await req(`/sendpass&${id}&${linkId}&${link}&${password}`));
});

function dropDownItem(item) {
  item.parentElement.addEventListener("click", () => {
    item.parentElement.classList.toggle("show");
    window.addEventListener("click", (e) => {
      if (e.target != item) {
        item.parentElement.classList.remove("show");
      }
    });
  });
}
dropDownItem(logout);

logout.onclick = () => {
  if (logout.parentElement.classList.contains("show")) {
    window.location.replace("/");
  }
};

  
function deleteResult(){
  let resultsDel = document.querySelectorAll(".result .delete")
  resultsDel.forEach((resultDel)=>{
    resultDel.addEventListener("click", (eo) => {
      let linkId = resultDel.parentElement.getAttribute("data-id");
        req(`/delete-pass&${id}&${linkId}`).then(() => {
          resscont.removeChild(resultDel.parentElement);
        });
    })
  })
}
deleteResult()
function fff(resultC) {
  resultC.forEach((result) => {
    result.addEventListener("click", function (element) {
      console.log(element.target);
      console.log(result.children[3]);
      if (element.target == result.childNodes[3]) {
        let linkId = this.getAttribute("data-id");
        req(`/delete-pass&${id}&${linkId}`).then(() => {
          resscont.removeChild(this);
        });
      } else {
        navigator.clipboard.writeText(this.getAttribute("data-pass"));
        /* مؤقتا لحد ما تعمل اشعار حلو */
        result.childNodes[1].innerText = "copied!";
        setTimeout(() => {
          result.childNodes[1].innerText = "Click to copy";
        }, 1000);
      }
    });
  });
}

decodeURIComponent(document.cookie).split(";").forEach((e)=>{
  if (e.split("=")[0] == "username"){
      console.log(e.split("=")[1])
  }
})
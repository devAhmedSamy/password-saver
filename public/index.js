/* main variables */
let form = document.forms[0];
let passwordsContainer = document.querySelector(".result-cont");
let allPasswordsElements = document.querySelectorAll(".result");
let id = form.id.value;
let logout = document.querySelector(".logout");
let nameL = document.querySelector(".container .name");
/* functions */
function req(fullLink, method = "get") {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(method, `${fullLink}`);
    request.send();
    request.onload = function () {
      resolve(JSON.parse(request.response));
    };
  });
}

async function createPassElement({ linkId, link, password }) {
  let passDiv = document.createElement("div");
  passDiv.classList.add("result");
  passDiv.setAttribute("data-pass", password);
  passDiv.setAttribute("data-id", linkId);
  passDiv.innerText = link;
  passDiv.addEventListener("click", copy)
  let i = document.createElement("i");
  i.innerText = "Click to copy";

  let delIcon = document.createElement("span");
  delIcon.classList.add("material-symbols-outlined");
  delIcon.classList.add("delete");
  delIcon.innerText = "delete";
  delIcon.addEventListener("click", deleteResult);

  passDiv.append(i);
  passDiv.append(delIcon);
  passwordsContainer.append(passDiv);

  // allPasswordsElements = resultC = document.querySelectorAll(".result");
  let r = await req(
    `/pass?userId=${id}&linkId=${linkId}&link=${link}&password=${password}`,
    "post"
  );
  console.log(r);

  checkForDelete();
}
async function deleteResult() {
  let linkId = this.parentElement.getAttribute("data-id");
  console.log(await req(`/pass?userId=${id}&linkId=${linkId}`, "delete"));
  passwordsContainer.removeChild(this.parentElement);
  checkForDelete();
}
function copy(e) {

  if (e.target != this.children[1]) {
    navigator.clipboard.writeText(this.getAttribute("data-pass"));
    console.log("copied!" + this.getAttribute("data-pass"));
  }
}
function checkForDelete() {
  if (passwordsContainer.childElementCount == 1) {
    passwordsContainer.style.display = "none";
  } else {
    passwordsContainer.style.display = "flex";
  }
}

function dropDownItem(item) {
  item.parentElement.addEventListener("click", () => {
    item.parentElement.classList.toggle("show");
    window.addEventListener("click", (e) => {
      if (e.target != item) {
        item.parentElement.classList.remove("show");
      }
    });
  });
  item.onclick = () =>{
    if (item.parentElement.classList.contains("show")){
      window.location.replace("/")
    }
  }
}
/* events */
form.addEventListener("submit", async (element) => {
  element.preventDefault();
  let link = form.link.value;
  let password = form.password.value;
  form.link.value = "";
  form.password.value = "";
  form.link.focus();
  let linkId = `${Date.now()}${Math.floor(Math.random() * 10)}`;
  createPassElement({ linkId, link, password });
});
allPasswordsElements.forEach((passwordElement) => {
  passwordElement.children[1].addEventListener("click", deleteResult);
  passwordElement.addEventListener("click", copy);
});

window.onload = checkForDelete;

dropDownItem(logout);

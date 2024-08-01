// JavaScript code to toggle password visibility on button click
const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function () {
  const pswdInput = document.getElementById("pword");
  const type = pswdInput.getAttribute("type");
  if (type == "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "hide Password";
  } else {
    pswdInput.setAttribute("type", "password");
    pswdBtn.innerHTML = "Show Password";
  }
});

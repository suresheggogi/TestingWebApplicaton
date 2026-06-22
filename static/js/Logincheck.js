document.addEventListener("DOMContentLoaded", function () {
  const homeButton = document.getElementById("homeButton");
  const user = document.getElementById("unameInput").value;
  const pass = document.getElementById("unamepwd").value;

  homeButton.addEventListener("click", function () {
    if (user === "suresh" && pass === "suresh123")
       {
      window.location.href = "/home/";
    } 
    else {
      alert("Invalid credentials");
    }
  });
});
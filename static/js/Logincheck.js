document.addEventListener("DOMContentLoaded", function () {
  const homeButton = document.getElementById("homeButton");

  homeButton.addEventListener("click", function () {
    const user = document.getElementById("unameInput").value;
    const pass = document.getElementById("unamepwd").value;

    if (user === "suresh" && pass === "suresh123") {
      window.location.href = "/home/";
    } else {
      alert("Invalid credentials");
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  fetch("./components/header.html")  
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);
    })
    .catch(err => {
      console.error("加载失败:", err);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://hrtos.com/components/header.html")  
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);
    })
    .catch(err => {
      console.error("加载失败:", err);
    });
});

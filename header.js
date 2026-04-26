document.addEventListener("DOMContentLoaded", function () {

  // 默认使用 home header
  let headerFile = "header_home.html";

  // 如果页面显式要求使用普通 header，则切换
  const useDocsHeader = document.body.getAttribute("data-header") === "docs";

  if (useDocsHeader) {
    headerFile = "header.html";
  }

  fetch("https://hrtos.com/components/" + headerFile)
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);
    })
    .catch(err => {
      console.error("加载失败:", err);
    });

});

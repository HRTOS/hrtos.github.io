document.addEventListener("DOMContentLoaded", () => {
  fetch("/components/header.html") // 你的header路径
    .then(res => res.text())
    .then(data => {
      const container = document.createElement("div");
      container.innerHTML = data;

      // 插入到页面最前面
      document.body.prepend(container);

      
    })
    .catch(err => console.error("加载header失败:", err));
});

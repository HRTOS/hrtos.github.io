(function () {
  const headerHTML = `
  <header class="hrt-header">
    <a class="left-link" href="https://hrtos.com" target="_blank">HRTOS</a>
    <span class="right-title">HRTOS 实时操作系统</span>
  </header>
  `;

  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  });
})();

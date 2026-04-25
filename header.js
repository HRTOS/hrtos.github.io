document.addEventListener("DOMContentLoaded", () => {
  const header = document.createElement("header");

  header.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    right:0;
    background:#1e293b;
    padding:10px 20px;
    z-index:1000;
    display:flex;
    justify-content:space-between;
    align-items:center;
    box-shadow:0 2px 4px rgba(0,0,0,0.5);
  `;

  header.innerHTML = `
    <a href="https://hrtos.com" target="_blank"
       style="font-size:20px;color:#60a5fa;text-decoration:none;font-weight:bold;">
       HRTOS
    </a>

    <span style="font-size:18px;color:#fbbf24;font-weight:bold;">
      HRTOS API 手册
    </span>
  `;

  document.body.prepend(header);
});

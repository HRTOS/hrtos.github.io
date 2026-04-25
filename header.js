// HRTOS 全站统一 Header 加载器

(function () {
  const container = document.getElementById('site-header');

  if (!container) {
    console.warn('[HRTOS] 未找到 #site-header 容器');
    return;
  }

  fetch('components/header.html')
    .then(res => {
      if (!res.ok) {
        throw new Error('Header HTML 加载失败');
      }
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;
    })
    .catch(err => {
      console.error('[HRTOS] header 加载失败:', err);

      // 兜底方案（避免页面空白）
      container.innerHTML = `
        <header style="
          position:fixed;
          top:0;
          left:0;
          right:0;
          background:#1e293b;
          padding:10px 20px;
          color:#fbbf24;
          z-index:1000;
        ">
          HRTOS（加载失败）
        </header>
      `;
    });

})();

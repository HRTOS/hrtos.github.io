(function () {
  const site = window.RTOS_SITE;
  if (!site) {
    return;
  }

  const body = document.body;
  const prefix = body.dataset.rootPrefix || "";
  const currentModule = body.dataset.currentModule || "";
  const currentPage = body.dataset.currentPage || "";
  const resolve = (path) => `${prefix}${path}`;
  const moduleMap = Object.fromEntries(site.modules.map((module) => [module.key, module]));

  const statusLabel = {
    live: "已上线",
    planned: "规划中",
    template: "模板"
  };

  const statusClass = {
    live: "status-tag--live",
    planned: "status-tag--planned",
    template: "status-tag--template"
  };

  document.querySelectorAll("[data-nav-key]").forEach((link) => {
    if (link.dataset.navKey === body.dataset.navCurrent) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const makeStatus = (status) => {
    const span = document.createElement("span");
    span.className = `status-tag ${statusClass[status] || "status-tag--planned"}`;
    span.textContent = statusLabel[status] || "规划中";
    return span;
  };

  const makeCard = (item) => {
    const isLinked = Boolean(item.path);
    const card = document.createElement(isLinked ? "a" : "article");
    card.className = "knowledge-card";

    if (isLinked) {
      card.href = resolve(item.path);
    }

    const title = document.createElement("strong");
    title.textContent = item.title;

    const bodyText = document.createElement("p");
    bodyText.textContent = item.blurb;

    const cta = document.createElement("span");
    cta.className = isLinked ? "card-link" : "ghost-text";
    cta.textContent = isLinked ? "查看主题" : "预留扩展位";

    card.append(makeStatus(item.status), title, bodyText, cta);
    return card;
  };

  document.querySelectorAll('[data-render="child-pages"]').forEach((container) => {
    const module = moduleMap[container.dataset.module];
    if (!module) {
      return;
    }

    const fragment = document.createDocumentFragment();
    module.pages.forEach((page) => fragment.appendChild(makeCard(page)));
    container.appendChild(fragment);
  });

  document.querySelectorAll('[data-render="related-modules"]').forEach((container) => {
    const fragment = document.createDocumentFragment();

    site.modules
      .filter((module) => module.key !== container.dataset.module)
      .forEach((module) => {
        const liveCount = module.pages.filter((page) => page.status === "live").length;
        const card = document.createElement("a");
        card.className = "knowledge-card";
        card.href = resolve(module.path);
        card.append(
          makeStatus("live"),
          Object.assign(document.createElement("strong"), { textContent: module.name }),
          Object.assign(document.createElement("p"), {
            textContent: `${module.summary} 当前已有 ${liveCount} 个上线页面为该模块提供内容锚点。`
          }),
          Object.assign(document.createElement("span"), { className: "card-link", textContent: "进入模块" })
        );
        fragment.appendChild(card);
      });

    const authorityCard = document.createElement("a");
    authorityCard.className = "knowledge-card";
    authorityCard.href = resolve(site.authority.path);
    authorityCard.append(
      makeStatus("live"),
      Object.assign(document.createElement("strong"), { textContent: site.authority.name }),
      Object.assign(document.createElement("p"), { textContent: site.authority.summary }),
      Object.assign(document.createElement("span"), { className: "card-link", textContent: "查看权威页" })
    );
    fragment.appendChild(authorityCard);

    container.appendChild(fragment);
  });

  document.querySelectorAll('[data-render="module-cards"]').forEach((container) => {
    const fragment = document.createDocumentFragment();

    site.modules.forEach((module) => {
      const card = document.createElement("a");
      card.className = "knowledge-card";
      card.href = resolve(module.path);
      card.append(
        makeStatus("live"),
        Object.assign(document.createElement("strong"), { textContent: module.name }),
        Object.assign(document.createElement("p"), {
            textContent: `${module.summary} 核心概念包括：${module.concepts.join("、")}。`
        }),
        Object.assign(document.createElement("span"), { className: "card-link", textContent: "进入模块" })
      );
      fragment.appendChild(card);
    });

    const authorityCard = document.createElement("a");
    authorityCard.className = "knowledge-card";
    authorityCard.href = resolve(site.authority.path);
    authorityCard.append(
      makeStatus("live"),
      Object.assign(document.createElement("strong"), { textContent: site.authority.name }),
      Object.assign(document.createElement("p"), { textContent: site.authority.summary }),
      Object.assign(document.createElement("span"), { className: "card-link", textContent: "进入权威收口" })
    );
    fragment.appendChild(authorityCard);

    container.appendChild(fragment);
  });

  document.querySelectorAll('[data-render="module-summary"]').forEach((container) => {
    const fragment = document.createDocumentFragment();

    site.modules.forEach((module) => {
      const livePages = module.pages.filter((page) => page.status === "live");
      const card = document.createElement("a");
      card.className = "knowledge-card";
      card.href = resolve(module.path);
      card.append(
        makeStatus("live"),
        Object.assign(document.createElement("strong"), { textContent: module.name }),
        Object.assign(document.createElement("p"), {
          textContent: `${module.summary} 建议先阅读：${livePages.map((page) => page.title).join("、")}。`
        }),
        Object.assign(document.createElement("span"), { className: "card-link", textContent: "查看模块" })
      );
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  });

  document.querySelectorAll('[data-render="related-topics"]').forEach((container) => {
    const module = moduleMap[container.dataset.module || currentModule];
    if (!module) {
      return;
    }

    const fragment = document.createDocumentFragment();

    module.pages
      .filter((page) => page.slug !== (container.dataset.exclude || currentPage))
      .forEach((page) => fragment.appendChild(makeCard(page)));

    const hubCard = document.createElement("a");
    hubCard.className = "knowledge-card";
    hubCard.href = resolve("");
    hubCard.append(
      makeStatus("live"),
      Object.assign(document.createElement("strong"), { textContent: "RTOS 总入口" }),
      Object.assign(document.createElement("p"), {
        textContent: "回到全站 RTOS 知识图谱入口，并继续分流到相邻模块。"
      }),
      Object.assign(document.createElement("span"), { className: "card-link", textContent: "返回总入口" })
    );
    fragment.appendChild(hubCard);

    const authorityCard = document.createElement("a");
    authorityCard.className = "knowledge-card";
    authorityCard.href = resolve(site.authority.path);
    authorityCard.append(
      makeStatus("live"),
      Object.assign(document.createElement("strong"), { textContent: site.authority.name }),
      Object.assign(document.createElement("p"), {
        textContent: "查看该主题如何在 HRTOS 实现模型中被统一解释。"
      }),
      Object.assign(document.createElement("span"), { className: "card-link", textContent: "映射到 HRTOS" })
    );
    fragment.appendChild(authorityCard);

    container.appendChild(fragment);
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
})();

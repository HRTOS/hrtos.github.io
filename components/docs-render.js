const data = {
  modules: {
    breadcrumb: [
  ["Home", "/"],
  ["Docs", "/docs/"],
  ["Modules", null]
],
    label: "Modules Center",
    title: "核心模块文档",
    intro: "提供任务、时间、内存与通信等核心模块文档，帮助理解 HRTOS 基础系统结构。",

    sections: [
      ["任务管理", "任务创建与生命周期管理", "task/"],
      ["时间管理", "系统时基与定时器机制", "time/"],
      ["内存管理", "动态与静态内存管理", "memory/"],
      ["通信机制", "消息与同步通信机制", "ipc/"]
    ],

    featured: [
      ["任务堆栈", "任务栈管理专题", "task/stack.html"]
    ]
  },

  api: {
    breadcrumb: [
  ["Home", "/"],
  ["Docs", "/docs/"],
  ["API", null]
],
    label: "API Reference",
    title: "API 接口文档",
    intro: "汇总任务、调度、通信与时间相关接口文档，提供完整 API 参考。",

    sections: [
      ["Task API", "任务接口文档", "task/"],
      ["Scheduler API", "调度接口文档", "scheduler/"],
      ["IPC API", "通信接口文档", "ipc/"]
    ],

    featured: []
  },

  learn: {
    breadcrumb: 
    [
  ["Home", "/"],
  ["Docs", "/docs/"],
  ["Learn", null]
],
    label: "RTOS Learning",
    title: "RTOS 学习中心",
    intro: "从基础概念到实时系统原理，建立完整 RTOS 学习路径。",

    sections: [
      ["基础概念", "RTOS 基础知识", "fundamentals/"],
      ["实时系统", "实时系统原理", "fundamentals/real-time-systems/"]
    ],

    featured: []
  },

  architecture: {
    breadcrumb: 
    [
  ["Home", "/"],
  ["Docs", "/docs/"],
  ["Architecture", null]
],
    label: "Architecture",
    title: "系统架构",
    intro: "展示 HRTOS 内核结构、资源层级与系统运行关系。",

    sections: [
      ["Kernel", "内核结构", "kernel/"],
      ["Interrupt", "中断系统", "interrupt/"],
      ["Resource", "资源管理", "resource/"]
    ],

    featured: []
  },

  examples: {
    breadcrumb: 
    [
  ["Home", "/"],
  ["Docs", "/docs/"],
  ["Examples", null]
],
    label: "Examples",
    title: "应用示例",
    intro: "通过 MyOS 与实践案例帮助理解调度流程与系统运行机制。",

    sections: [
      ["MyOS", "自调度示例", "myos/"],
      ["Practice", "工程实践案例", "practice/"]
    ],

    featured: []
  },

  mechanism: {
    breadcrumb: 
    [
  ["Home", "/"],
  ["Docs", "/docs/"],
  ["Mechanism", null]
],
    label: "Mechanism",
    title: "机制解析",
    intro: "深入理解任务调度、中断系统、内存管理与同步机制。",

    sections: [
      ["任务调度", "调度机制解析", "任务调度原理.html"],
      ["中断机制", "中断系统解析", "中断机制解析.html"],
      ["内存管理", "内存机制专题", "内存管理机制.html"]
    ],

    featured: []
  }
};

function getType() {
  const path = location.pathname;

  if (path.includes("/modules/")) return "modules";
  if (path.includes("/api/")) return "api";
  if (path.includes("/learn/")) return "learn";
  if (path.includes("/architecture/")) return "architecture";
  if (path.includes("/examples/")) return "examples";
  if (path.includes("/mechanism/")) return "mechanism";

  return null;
}

function renderCards(items, buttonText) {
  if (!items || items.length === 0) {
    return `<div style="color:#94a3b8;padding:10px 0;">
      暂无内容
    </div>`;
  }

  return items.map(item => `
    <a class="doc-card" href="${item[2]}">
      <h3>${item[0]}</h3>
      <p>${item[1]}</p>
      <span class="doc-link">${buttonText}</span>
    </a>
  `).join('');
}

function render() {
  const type = getType();
  const config = data[type];
  if (!config) return;

  document.title = config.title + " | HRTOS Documentation";
document
  .getElementById("page-description")
  .setAttribute("content", config.intro);
  document.getElementById("hero-label").textContent = config.label;
  document.getElementById("hero-title").textContent = config.title;
  document.getElementById("hero-intro").textContent = config.intro;

  document.getElementById("breadcrumb").innerHTML =
  config.breadcrumb
    .map(([text, link], i) => {
      if (!link) return `<span>${text}</span>`;
      return `<a href="${link}">${text}</a>`;
    })
    .join(" / ");

  document.getElementById("section-grid").innerHTML =
    renderCards(config.sections, "进入文档");

  document.getElementById("featured-grid").innerHTML =
    config.featured.length
      ? renderCards(config.featured, "查看专题")
      : `<p style="color:#94a3b8;">暂无推荐内容</p>`;
}

document.addEventListener("DOMContentLoaded", render);

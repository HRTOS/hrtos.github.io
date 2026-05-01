/**
 * HRTOS Docs Auto Renderer (Final Production Version)
 * 适配当前目录结构：api / learn / modules / architecture / system / examples
 */

function pathMatch(type) {
  const path = location.pathname;

  if (path.includes("/docs/api/")) return "api";
  if (path.includes("/docs/learn/")) return "learn";
  if (path.includes("/docs/modules/")) return "modules";
  if (path.includes("/docs/architecture/")) return "architecture";
  if (path.includes("/docs/system/")) return "system";
  if (path.includes("/docs/examples/")) return "examples";

  return "root";
}

/**
 * =========================
 * 全局结构定义（唯一数据源）
 * =========================
 */
const CONFIG = {
  api: {
    label: "API Reference",
    title: "API 接口文档",
    intro: "HRTOS 内核 API 接口集合，包括任务、调度、通信与时间系统接口。",
    sections: [
      ["Task API", "任务管理接口", "/docs/api/task/"],
      ["Scheduler API", "调度系统接口", "/docs/api/scheduler/"],
      ["IPC API", "进程通信接口", "/docs/api/ipc/"],
      ["Memory API", "内存管理接口", "/docs/api/memory/"],
      ["Time API", "时间系统接口", "/docs/api/time/"]
    ]
  },

  learn: {
    label: "RTOS Learning",
    title: "RTOS 学习体系",
    intro: "从基础概念到实时系统设计，构建完整 RTOS 知识路径。",
    sections: [
      ["RTOS是什么", "操作系统基本概念", "/docs/learn/what-is-rtos.html"],
      ["实时系统原理", "实时性与调度模型", "/docs/learn/real-time-systems.html"],
      ["调度基础", "任务调度机制入门", "/docs/learn/scheduling-basics.html"],
      ["中断基础", "中断系统工作原理", "/docs/learn/interrupt-basics.html"],
      ["IPC基础", "任务通信机制", "/docs/learn/ipc-basics.html"]
    ]
  },

  modules: {
    label: "Core Modules",
    title: "核心模块体系",
    intro: "HRTOS 核心功能模块：任务、调度、内存、通信与时间系统。",
    sections: [
      ["Task", "任务生命周期管理", "/docs/modules/task/"],
      ["Scheduler", "实时调度机制", "/docs/modules/scheduler/"],
      ["IPC", "任务通信机制", "/docs/modules/ipc/"],
      ["Memory", "内存管理系统", "/docs/modules/memory/"],
      ["Time", "系统时间与定时器", "/docs/modules/time/"]
    ]
  },

  architecture: {
    label: "System Architecture",
    title: "系统架构设计",
    intro: "HRTOS 内核架构、调度模型与系统运行机制。",
    sections: [
      ["Kernel", "内核结构与运行模型", "/docs/architecture/kernel/"],
      ["Scheduler Model", "调度架构模型", "/docs/architecture/scheduler/"],
      ["Interrupt Model", "中断系统架构", "/docs/architecture/interrupt/"],
      ["Memory Model", "内存体系结构", "/docs/architecture/memory/"],
      ["IPC Model", "通信机制架构", "/docs/architecture/ipc/"]
    ]
  },

  system: {
    label: "System Flow",
    title: "系统执行流程",
    intro: "HRTOS 核心运行流程：上下文切换、中断与调度执行链路。",
    sections: [
      ["Context Switch", "任务切换流程", "/docs/system/context-switch-flow.html"],
      ["Interrupt Flow", "中断处理流程", "/docs/system/interrupt-flow.html"],
      ["Scheduling Flow", "调度执行流程", "/docs/system/scheduling-flow.html"]
    ]
  },

  examples: {
    label: "Examples",
    title: "工程示例",
    intro: "HRTOS 实战示例与系统应用案例。",
    sections: [
      ["MyOS Demo", "简化操作系统示例", "/docs/examples/myos/"],
      ["Practice Lab", "工程实践案例", "/docs/examples/practice/"],
      ["Priority Inversion", "优先级反转示例", "/docs/examples/practice/priority-inversion/"]
    ]
  }
};

/**
 * 获取当前模块
 */
function getType() {
  return pathMatch(location.pathname);
}

/**
 * 卡片渲染
 */
function renderCards(items) {
  if (!items || !items.length) {
    return `<div style="color:#94a3b8;">暂无内容</div>`;
  }

  return items.map(i => `
    <a class="doc-card" href="${i[2]}">
      <h3>${i[0]}</h3>
      <p>${i[1]}</p>
      <span class="doc-link">进入文档 →</span>
    </a>
  `).join("");
}

/**
 * 面包屑（自动生成）
 */
function buildBreadcrumb(type) {
  return `
    <a href="/docs/">Docs</a> /
    <a href="/docs/${type}/">${type}</a>
  `;
}

/**
 * 主渲染
 */
function render() {
  const type = getType();
  const config = CONFIG[type];

  if (!config) return;

  // title
  document.title = `${config.title} | HRTOS`;

  // meta
  const meta = document.getElementById("page-description");
  if (meta) meta.setAttribute("content", config.intro);

  // hero
  document.getElementById("hero-label").textContent = config.label;
  document.getElementById("hero-title").textContent = config.title;
  document.getElementById("hero-intro").textContent = config.intro;

  // breadcrumb
  const bc = document.getElementById("breadcrumb");
  if (bc) bc.innerHTML = buildBreadcrumb(type);

  // sections
  const sec = document.getElementById("section-grid");
  if (sec) sec.innerHTML = renderCards(config.sections);
}

document.addEventListener("DOMContentLoaded", render);

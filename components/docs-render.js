/* =========================
   工具函数（路径标准化）
========================= */

const BASE = "/docs/";

function join(path) {
  if (!path) return "#";
  if (path.startsWith("http")) return path;
  return BASE + path.replace(/^\/+/, "");
}

/* =========================
   卡片模型
========================= */

function card(title, desc, link) {
  return {
    title,
    desc,
    link: join(link)
  };
}

/* =========================
   模块工厂
========================= */

function createModule({ label, title, intro, breadcrumb, sections, featured = [] }) {
  return {
    breadcrumb: buildBreadcrumb(breadcrumb),
    label,
    title,
    intro,
    sections,
    featured
  };
}

/* =========================
   breadcrumb 自动生成（关键升级）
========================= */

function buildBreadcrumb(current) {
  return [
    ["Home", "/"],
    ["Docs", BASE],
    [current, null]
  ];
}

/* =========================
   全局数据（已优化路径）
========================= */

const data = {
  modules: createModule({
    label: "Modules Center",
    title: "核心模块文档",
    intro: "任务、调度、内存、通信四大核心模块。",
    breadcrumb: "Modules",

    sections: [
      card("任务管理", "任务生命周期与状态模型", "modules/task/"),
      card("时间管理", "系统时基与定时器", "modules/time/"),
      card("内存管理", "动态与静态内存管理", "modules/memory/"),
      card("通信机制", "IPC消息与同步机制", "modules/ipc/")
    ],

    featured: [
      card("任务堆栈模型", "Stack 管理机制", "modules/task/stack-management.html")
    ]
  }),

  api: createModule({
    label: "API Reference",
    title: "API 接口文档",
    intro: "RTOS 内核接口完整参考。",
    breadcrumb: "API",

    sections: [
      card("Task API", "任务接口集合", "api/task/"),
      card("Scheduler API", "调度接口", "api/scheduler/"),
      card("IPC API", "通信接口", "api/ipc/"),
      card("Memory API", "内存接口", "api/memory/"),
      card("Time API", "时间接口", "api/time/")
    ]
  }),

  learn: createModule({
    label: "Learning Path",
    title: "RTOS 学习体系",
    intro: "从基础到系统级理解 RTOS。",
    breadcrumb: "Learn",

    sections: [
      card("RTOS是什么", "基础概念", "learn/what-is-rtos.html"),
      card("实时系统", "实时性原理", "learn/real-time-systems.html"),
      card("调度基础", "Scheduling基础", "learn/scheduling-basics.html"),
      card("上下文切换", "Context Switch", "learn/context-switch-basics.html"),
      card("抢占模型", "Preemptive vs Cooperative", "learn/preemptive-vs-cooperative.html"),
      card("RTOS vs Linux", "系统对比", "learn/rtos-vs-linux.html"),
      card("中断基础", "Interrupt机制", "learn/interrupt-basics.html"),
      card("IPC基础", "通信机制", "learn/ipc-basics.html")
    ]
  }),

  architecture: createModule({
    label: "Architecture",
    title: "系统架构",
    intro: "内核与系统结构设计。",
    breadcrumb: "Architecture",

    sections: [
      card("Kernel", "内核结构", "architecture/kernel/"),
      card("Interrupt", "中断模型", "architecture/interrupt/"),
      card("Scheduler", "调度模型", "architecture/scheduler/"),
      card("Memory", "内存模型", "architecture/memory/"),
      card("IPC", "通信架构", "architecture/ipc/")
    ]
  }),

  system: createModule({
    label: "System Flow",
    title: "系统执行流程",
    intro: "内核运行全过程。",
    breadcrumb: "System",

    sections: [
      card("调度流程", "Scheduling Flow", "system/scheduling-flow.html"),
      card("中断流程", "Interrupt Flow", "system/interrupt-flow.html"),
      card("上下文切换", "Context Switch Flow", "system/context-switch-flow.html")
    ]
  }),

  examples: createModule({
    label: "Examples",
    title: "工程示例",
    intro: "实战级系统案例。",
    breadcrumb: "Examples",

    sections: [
      card("MyOS", "简化OS实现", "examples/myos/"),
      card("Practice", "工程实践", "examples/practice/"),
      card("Priority Inversion", "优先级反转", "examples/practice/priority-inversion/")
    ]
  })
};

/* =========================
   路由识别（升级版）
========================= */

function getType() {
  const path = location.pathname;

  const match = path.match(/\/docs\/([^\/]+)\//);
  if (match) return match[1];

  return null;
}

/* =========================
   渲染
========================= */

function renderCards(items, text) {
  if (!items?.length) return `<div style="color:#94a3b8;">暂无内容</div>`;

  return items.map(i => `
    <a class="doc-card" href="${i.link}">
      <h3>${i.title}</h3>
      <p>${i.desc}</p>
      <span class="doc-link">${text}</span>
    </a>
  `).join("");
}

function render() {
  const type = getType();
  const config = data[type];

  if (!config) return;

  document.title = `${config.title} | HRTOS`;

  const meta = document.getElementById("page-description");
  if (meta) meta.setAttribute("content", config.intro);

  document.getElementById("hero-label").textContent = config.label;
  document.getElementById("hero-title").textContent = config.title;
  document.getElementById("hero-intro").textContent = config.intro;

  document.getElementById("breadcrumb").innerHTML =
    config.breadcrumb.map(([t, l]) =>
      l ? `<a href="${l}">${t}</a>` : `<span>${t}</span>`
    ).join(" / ");

  document.getElementById("section-grid").innerHTML =
    renderCards(config.sections, "进入文档");

  document.getElementById("featured-grid").innerHTML =
    config.featured.length
      ? renderCards(config.featured, "查看专题")
      : `<div style="color:#94a3b8;">暂无推荐内容</div>`;
}

document.addEventListener("DOMContentLoaded", render);

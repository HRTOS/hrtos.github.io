const data = {
  modules: createModule({
    label: "Modules Center",
    title: "核心模块文档",
    intro: "提供任务、时间、内存与通信等核心模块文档，帮助理解 HRTOS 基础系统结构。",
    breadcrumb: "Modules",

    sections: [
      card("任务管理", "任务创建与生命周期管理", "task/"),
      card("时间管理", "系统时基与定时器机制", "time/"),
      card("内存管理", "动态与静态内存管理", "memory/"),
      card("通信机制", "消息与同步通信机制", "ipc/")
    ],

    featured: [
      card("任务堆栈", "任务栈管理专题", "task/stack-management.html")
    ]
  }),

  api: createModule({
    label: "API Reference",
    title: "API 接口文档",
    intro: "汇总任务、调度、通信与时间相关接口文档，提供完整 API 参考。",
    breadcrumb: "API",

    sections: [
      card("Task API", "任务接口接口集合", "task/"),
      card("Scheduler API", "调度接口与策略", "scheduler/"),
      card("IPC API", "通信机制接口", "ipc/"),
      card("Memory API", "内存管理接口", "memory/"),
      card("Time API", "时间与定时器接口", "time/")
    ],

    featured: []
  }),

  learn: createModule({
    label: "RTOS Learning",
    title: "RTOS 学习中心",
    intro: "从基础概念到实时系统原理，建立完整 RTOS 学习路径。",
    breadcrumb: "Learn",

    sections: [
      card("RTOS 是什么", "实时操作系统基础概念", "what-is-rtos.html"),
      card("实时系统", "实时系统基本原理", "real-time-systems.html"),
      card("调度基础", "任务调度机制入门", "scheduling-basics.html"),
      card("抢占 vs 协作", "调度模型对比", "preemptive-vs-cooperative.html"),
      card("上下文切换", "Context Switch 基础", "context-switch-basics.html"),
      card("RTOS vs Linux", "系统对比分析", "rtos-vs-linux.html"),
      card("中断基础", "Interrupt 基础机制", "interrupt-basics.html"),
      card("IPC 基础", "进程通信基础", "ipc-basics.html")
    ]
  }),

  architecture: createModule({
    label: "Architecture",
    title: "系统架构",
    intro: "展示 HRTOS 内核结构、资源层级与系统运行关系。",
    breadcrumb: "Architecture",

    sections: [
      card("Kernel", "内核结构与执行模型", "kernel/"),
      card("Interrupt", "中断系统架构", "interrupt/"),
      card("Scheduler", "调度模型与策略", "scheduler/"),
      card("Memory", "内存模型与布局", "memory/"),
      card("IPC", "通信架构模型", "ipc/")
    ]
  }),

  examples: createModule({
    label: "Examples",
    title: "应用示例",
    intro: "通过 MyOS 与实践案例帮助理解调度流程与系统运行机制。",
    breadcrumb: "Examples",

    sections: [
      card("MyOS 示例", "自调度系统示例", "myos/"),
      card("工程实践", "实际应用案例", "practice/"),
      card("优先级反转", "经典调度问题分析", "practice/priority-inversion/")
    ]
  }),

  system: createModule({
    label: "System Flow",
    title: "系统运行流程",
    intro: "从上下文切换、中断到调度，理解系统运行全过程。",
    breadcrumb: "System",

    sections: [
      card("调度流程", "Scheduling Flow", "scheduling-flow.html"),
      card("中断流程", "Interrupt Flow", "interrupt-flow.html"),
      card("上下文切换", "Context Switch Flow", "context-switch-flow.html")
    ]
  })
};

/* =========================
   工程级基础函数
========================= */

function createModule({ label, title, intro, breadcrumb, sections, featured = [] }) {
  return {
    breadcrumb: [
      ["Home", "/"],
      ["Docs", "/docs/"],
      [breadcrumb, null]
    ],
    label,
    title,
    intro,
    sections,
    featured
  };
}

function card(title, desc, link) {
  return { title, desc, link };
}

/* =========================
   路由识别
========================= */

function getType() {
  const path = location.pathname;

  if (path.includes("/modules/")) return "modules";
  if (path.includes("/api/")) return "api";
  if (path.includes("/learn/")) return "learn";
  if (path.includes("/architecture/")) return "architecture";
  if (path.includes("/examples/")) return "examples";
  if (path.includes("/system/")) return "system";

  return null;
}

/* =========================
   渲染
========================= */

function renderCards(items, buttonText) {
  if (!items?.length) {
    return `<div style="color:#94a3b8;padding:8px 0;">暂无内容</div>`;
  }

  return items.map(i => `
    <a class="doc-card" href="${i.link}">
      <h3>${i.title}</h3>
      <p>${i.desc}</p>
      <span class="doc-link">${buttonText}</span>
    </a>
  `).join('');
}

function render() {
  const type = getType();
  const config = data[type];
  if (!config) return;

  /* title + SEO */
  document.title = config.title + " | HRTOS Documentation";

  const desc = document.getElementById("page-description");
  if (desc) desc.setAttribute("content", config.intro);

  /* hero */
  document.getElementById("hero-label").textContent = config.label;
  document.getElementById("hero-title").textContent = config.title;
  document.getElementById("hero-intro").textContent = config.intro;

  /* breadcrumb */
  document.getElementById("breadcrumb").innerHTML =
    config.breadcrumb.map(([t, l]) =>
      l ? `<a href="${l}">${t}</a>` : `<span>${t}</span>`
    ).join(" / ");

  /* sections */
  document.getElementById("section-grid").innerHTML =
    renderCards(config.sections, "进入文档");

  /* featured */
  document.getElementById("featured-grid").innerHTML =
    config.featured.length
      ? renderCards(config.featured, "查看专题")
      : `<div style="color:#94a3b8;">暂无推荐内容</div>`;
}

document.addEventListener("DOMContentLoaded", render);

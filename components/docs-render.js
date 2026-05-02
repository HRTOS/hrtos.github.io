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
    intro: "任务、调度、时间、内存与通信等核心系统模块。",
    breadcrumb: "Modules",

    sections: [
      card("任务管理", "任务生命周期、状态与上下文切换", "modules/task/index.html"),
      card("调度管理", "优先级、轮转与实时调度机制", "modules/scheduler/index.html"),
      card("时间管理", "延时、Tick 与定时器系统", "modules/time/index.html"),
      card("内存管理", "分配、碎片与内存保护", "modules/memory/index.html"),
      card("通信机制", "消息队列、信号量与互斥锁", "modules/ipc/index.html")
    ],

    featured: [
      card("任务生命周期", "理解任务状态变化过程", "modules/task/lifecycle.html"),
      card("优先级调度", "实时系统核心调度模型", "modules/scheduler/priority-scheduling.html"),
      card("Tick System", "系统时间驱动机制", "modules/time/tick-system.html")
    ]
  }),

  api: createModule({
    label: "API Reference",
    title: "接口文档",
    intro: "HRTOS 内核 API 接口完整参考。",
    breadcrumb: "API",

    sections: [
      card("任务接口", "Task API 集合", "api/task/index.html"),
      card("调度接口", "Scheduler API", "api/scheduler/index.html"),
      card("时间接口", "Delay / Timer API", "api/time/index.html"),
      card("通信接口", "IPC API", "api/ipc/index.html"),
      card("内存接口", "Memory API", "api/memory/index.html")
    ],

    featured: [
      card("os_task", "任务创建接口", "api/task/os_task.html"),
      card("os_switch", "任务切换接口", "api/scheduler/os_switch.html"),
      card("os_delay", "延时接口", "api/time/os_delay.html")
    ]
  }),

  learn: createModule({
    label: "Learning Path",
    title: "RTOS 学习体系",
    intro: "从基础概念到实时系统核心机制的完整学习路径。",
    breadcrumb: "Learn",

    sections: [
      card("RTOS 是什么", "实时操作系统基础概念", "learn/what-is-rtos.html"),
      card("实时系统", "实时性与确定性原理", "learn/real-time-systems.html"),
      card("调度基础", "任务调度核心机制", "learn/scheduling-basics.html"),
      card("上下文切换", "任务切换原理", "learn/context-switch-basics.html"),
      card("抢占模型", "抢占式与协作式调度", "learn/preemptive-vs-cooperative.html"),
      card("中断基础", "Interrupt 机制", "learn/interrupt-basics.html")
    ],

    featured: [
      card("RTOS vs Linux", "实时系统与通用系统对比", "learn/rtos-vs-linux.html"),
      card("IPC 基础", "任务通信入门", "learn/ipc-basics.html")
    ]
  }),

  architecture: createModule({
    label: "Architecture",
    title: "系统架构",
    intro: "HRTOS 内核结构与模块协作关系。",
    breadcrumb: "Architecture",

    sections: [
      card("Kernel", "内核结构设计", "architecture/kernel/index.html"),
      card("Scheduler", "调度模型", "architecture/scheduler/index.html"),
      card("Interrupt", "中断模型", "architecture/interrupt/index.html"),
      card("Memory", "内存模型", "architecture/memory/index.html"),
      card("IPC", "通信架构", "architecture/ipc/index.html")
    ],

    featured: [
      card("Kernel Flow", "内核执行流", "architecture/kernel/kernel-flow.html"),
      card("Scheduling Model", "调度系统结构", "architecture/scheduler/scheduling-model.html")
    ]
  }),

  system: createModule({
    label: "System Flow",
    title: "系统执行流程",
    intro: "任务切换、中断响应与调度执行流程。",
    breadcrumb: "System",

    sections: [
      card("调度流程", "系统调度执行过程", "system/scheduling-flow.html"),
      card("中断流程", "中断进入与退出路径", "system/interrupt-flow.html"),
      card("上下文切换", "任务切换流程", "system/context-switch-flow.html")
    ],

    featured: [
      card("Scheduler Flow", "调度全流程分析", "system/scheduling-flow.html"),
      card("Interrupt Flow", "中断机制流程", "system/interrupt-flow.html")
    ]
  }),

  examples: createModule({
    label: "Examples",
    title: "实验系统",
    intro: "通过实验页面观察 RTOS 行为与系统运行过程。",
    breadcrumb: "Examples",

    sections: [
      card("任务执行模型", "任务生命周期与状态实验", "examples/01-task-execution/index.html"),
      card("调度系统", "优先级与轮转调度实验", "examples/02-scheduling-engine/index.html"),
      card("通信模型", "消息队列、互斥锁与信号量实验", "examples/03-communication-model/index.html"),
      card("时间控制", "Delay、Tick 与 Timer 实验", "examples/04-time-control/index.html"),
      card("系统资源", "内存与资源管理实验", "examples/05-system-resource/index.html"),
      card("中断驱动", "Interrupt 响应实验", "examples/06-interrupt-driven/index.html"),
      card("内核行为", "完整调度与优先级反转实验", "examples/07-kernel-behavior/index.html")
    ],

    featured: [
      card("Priority Inversion", "优先级反转实验", "examples/07-kernel-behavior/priority-inversion.html"),
      card("Full Schedule Flow", "完整调度流程实验", "examples/07-kernel-behavior/full-schedule-flow.html"),
      card("MyOS", "简化调度系统示例", "examples/myos/index.html")
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

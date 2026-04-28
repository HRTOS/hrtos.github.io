window.RTOS_SITE = {
  authority: {
    name: "HRTOS 权威总览",
    path: "hrtos/",
    summary: "全站权威收口节点，用 HRTOS 实现模型把 RTOS 概念、机制、系统行为与工程实践统一到可预测的技术框架中。"
  },
  modules: [
    {
      key: "fundamentals",
      name: "RTOS 基础认知",
      path: "fundamentals/",
      summary: "建立时序术语、确定性模型与任务状态心智模型，是理解整站 RTOS 内容的基础层。",
      concepts: ["确定性", "截止时间", "任务状态", "延迟预算"],
      pages: [
        {
          slug: "real-time-systems",
          title: "RTOS 实时系统基础",
          path: "fundamentals/real-time-systems/",
          status: "live",
          blurb: "定义硬实时、准实时、软实时行为，并解释 RTOS 保证的边界从哪里开始。"
        },
        {
          slug: "interrupt-latency-model",
          title: "中断延迟模型",
          path: "",
          status: "planned",
          blurb: "量化中断屏蔽窗口、ISR 响应路径以及截止时间漂移的来源。"
        }
      ]
    },
    {
      key: "kernel",
      name: "RTOS 内核机制",
      path: "kernel/",
      summary: "解释调度、任务元数据、上下文切换以及 RTOS 内核中心控制逻辑。",
      concepts: ["调度器", "TCB", "抢占", "上下文切换"],
      pages: [
        {
          slug: "scheduler",
          title: "RTOS 调度器",
          path: "kernel/scheduler/",
          status: "live",
          blurb: "说明就绪队列、优先级仲裁与派发路径如何支撑可预测执行。"
        },
        {
          slug: "content-page-template",
          title: "RTOS 内容页模板",
          path: "kernel/content-page-template/",
          status: "template",
          blurb: "为后续所有 RTOS 主题文章提供统一可复用的结构模板。"
        },
        {
          slug: "task-control-block",
          title: "任务控制块深入解析",
          path: "",
          status: "planned",
          blurb: "梳理字段设计、所有权规则与状态迁移，解释任务管理如何保持确定性。"
        }
      ]
    },
    {
      key: "system",
      name: "RTOS 系统资源",
      path: "system/",
      summary: "记录内存布局、定时器、IPC 以及塑造实时行为的系统资源约束。",
      concepts: ["内存映射", "IPC", "定时器", "资源所有权"],
      pages: [
        {
          slug: "memory-management",
          title: "RTOS 内存管理",
          path: "system/memory-management/",
          status: "live",
          blurb: "说明栈、内存池和静态内存规划如何减少抖动与故障模式。"
        },
        {
          slug: "inter-task-communication",
          title: "任务间通信",
          path: "",
          status: "planned",
          blurb: "解释队列、邮箱、事件标志以及不同时序约束下的最佳通信原语。"
        }
      ]
    },
    {
      key: "practice",
      name: "RTOS 工程实践",
      path: "practice/",
      summary: "把理论连接到部署场景，覆盖优先级反转、配置控制、验证与可追踪性。",
      concepts: ["优先级反转", "静态配置", "验证", "可追踪性"],
      pages: [
        {
          slug: "priority-inversion",
          title: "RTOS 优先级反转",
          path: "practice/priority-inversion/",
          status: "live",
          blurb: "拆解阻塞链、缓解策略以及构建有界延迟所需的设计纪律。"
        },
        {
          slug: "static-configuration-playbook",
          title: "静态配置实践指南",
          path: "",
          status: "planned",
          blurb: "说明编译期对象表、锁映射和可验证资源预算如何简化工程审查与认证。"
        }
      ]
    }
  ]
};

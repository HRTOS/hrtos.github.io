# HRTOS 调试指南

## 模块介绍

本指南提供了调试 HRTOS 内核问题、应用程序问题和系统级故障的技术和工具。它涵盖了常见的调试场景、诊断方法和故障排除策略。

## 主要职责

调试指南涵盖：

- 内核调试技术
- 应用程序调试
- 内存调试
- 定时和调度调试
- IPC 调试
- 常见问题和解决方案

## 调试工具

### 硬件工具

#### 在线仿真器（ICE）

**目的**：具有硬件断点的实时调试

**功能**：
- 设置硬件断点
- 单步执行代码
- 查看/修改内存和寄存器
- 跟踪执行

**用途**：
- 调试上下文切换问题
- 调试中断时序
- 分析实时行为

#### 逻辑分析仪

**目的**：分析信号时序和中断活动

**功能**：
- 捕获信号波形
- 测量事件之间的时间
- 分析中断延迟
- 验证 GPIO 行为

**用途**：
- 调试时序问题
- 验证中断时序
- 分析系统性能

### 软件工具

#### printf() 调试

**目的**：简单的基于输出的调试

**实现**：
```c
// 简单调试输出
void debug_printf(char *msg)
{
    // 发送到 UART 或其他输出
    while(*msg) {
        SBUF = *msg++;
        while(!TI);
        TI = 0;
    }
}

// 用法
debug_printf("Task created\r\n");
```

**用途**：
- 跟踪执行流程
- 监视变量值
- 调试状态转换

**限制**：
- 减慢执行
- 可能影响时序
- 缓冲区空间有限

#### 变量监视

**目的**：在执行期间监视内核变量

**实现**：
```c
// 监视任务状态
void monitor_task_states(void)
{
    for(u8 i=0; i<OS_PROCESS_MAX; i++) {
        debug_printf("Task %d: state=%d\r\n", i, OS_TASK[i].state);
    }
}
```

**用途**：
- 监视任务状态
- 检查资源状态
- 验证调度器行为

## 常见调试场景

### 场景 1：任务未运行

**症状**：
- 任务已创建但从未执行
- 其他任务正常运行
- 无错误消息

**调试步骤**：

1. **验证任务创建**
   ```c
   char result = os_task_create((unsigned int)my_task, 1, 4, 5);
   if(result != 1) {
       debug_printf("Task creation failed\r\n");
   }
   ```

2. **检查任务状态**
   ```c
   u8 state = os_task_get_state(1);
   debug_printf("Task state: %d\r\n", state);
   // 预期：2（READY）或 1（RUNNING）
   ```

3. **验证优先级**
   ```c
   u8 prio = os_task_get_priority(1);
   debug_printf("Task priority: %d\r\n", prio);
   ```

4. **检查就绪标志**
   ```c
   debug_printf("OS_PROCESS_OK[1]: 0x%02X\r\n", OS_PROCESS_OK[1]);
   // 就绪时位 0 应为 1
   ```

**常见原因**：
- 任务创建失败
- 优先级太低（从未调度）
- 任务被挂起
- 创建后注册被锁定

### 场景 2：系统挂起

**症状**：
- 系统停止响应
- 无任务切换
- 定时器中断未触发

**调试步骤**：

1. **检查中断启用**
   ```c
   debug_printf("EA=%d\r\n", EA);
   // 应为 1
   ```

2. **检查定时器配置**
   ```c
   debug_printf("TMOD=0x%02X\r\n", TMOD);
   debug_printf("TCON=0x%02X\r\n", TCON);
   debug_printf("TH0=0x%02X\r\n", TH0);
   debug_printf("TL0=0x%02X\r\n", TL0);
   ```

3. **检查调度器触发**
   ```c
   debug_printf("OS_SCHED_REASON=%d\r\n", OS_SCHED_REASON);
   ```

4. **检查当前任务**
   ```c
   debug_printf("OS_CURRENT_TASK=%d\r\n", OS_CURRENT_TASK);
   ```

**常见原因**：
- 中断被禁用
- 定时器未配置
- 临界区从未退出
- 栈溢出导致复位

### 场景 3：任务饥饿

**症状**：
- 低优先级任务从未运行
- 高优先级任务消耗所有 CPU
- 系统似乎冻结

**调试步骤**：

1. **监视任务执行**
   ```c
   // 在每个任务中添加计数器
   static u32 task1_count = 0;
   static u32 task2_count = 0;
   
   void task1(void) {
       while(1) {
           task1_count++;
           do_work();
           os_delay(10);
       }
   }
   
   // 定期打印计数
   debug_printf("Task1: %lu, Task2: %lu\r\n", task1_count, task2_count);
   ```

2. **检查优先级设置**
   ```c
   for(u8 i=0; i<OS_PROCESS_MAX; i++) {
       debug_printf("Task %d prio: %d\r\n", i, os_task_get_priority(i));
   }
   ```

3. **验证任务让出**
   ```c
   // 确保任务有阻塞点
   void task(void) {
       while(1) {
           do_work();
           os_delay(10);  // 必须有阻塞点
       }
   }
   ```

**常见原因**：
- 高优先级任务从不阻塞
- 任务中无阻塞点
- 优先级反转（使用带继承的互斥锁）

### 场景 4：IPC 死锁

**症状**：
- 任务无限期等待
- 系统似乎冻结
- 无进展

**调试步骤**：

1. **检查资源状态**
   ```c
   for(u8 i=0; i<OS_RESOURCE_MAX; i++) {
       debug_printf("Res %d: value=%d, owner=%d, wait_mask=0x%04X\r\n",
                    i, OS_RES[i].value, OS_RES[i].owner, OS_RES[i].wait_mask);
   }
   ```

2. **检查任务等待状态**
   ```c
   for(u8 i=0; i<OS_PROCESS_MAX; i++) {
       debug_printf("Task %d: wait_type=%d, wait_obj=%d\r\n",
                    i, OS_TASK[i].wait_type, OS_TASK[i].wait_obj);
   }
   ```

3. **验证互斥锁所有权**
   ```c
   // 检查互斥锁是否被错误任务持有
   if(OS_RES[mid].owner != OS_INVALID_ID) {
       debug_printf("Mutex %d held by task %d\r\n", mid, OS_RES[mid].owner);
   }
   ```

**常见原因**：
- 互斥锁未解锁
- 循环等待条件
- 信号量未释放
- 事件未设置

### 场景 5：栈溢出

**症状**：
- 系统意外复位
- 变量损坏
- 行为异常

**调试步骤**：

1. **检查栈警告**
   ```c
   debug_printf("Stack max: 0x%02X\r\n", OS_INSIDE_STACK_USE_MAXIMUM);
   ```

2. **监视栈使用**
   ```c
   // 在任务开始处添加栈哨兵
   void my_task(void) {
       u8 stack_canary = 0xAA;
       // ... 任务代码 ...
       debug_printf("Canary: 0x%02X\r\n", stack_canary);
       // 如果不是 0xAA，则发生栈溢出
   }
   ```

3. **检查栈指针**
   ```c
   for(u8 i=0; i<OS_PROCESS_MAX; i++) {
       debug_printf("Task %d SP: 0x%02X\r\n", i, OS_JINCHENG_SP[i]);
   }
   ```

**常见原因**：
- 栈大小太小
- 深度递归
- 大局部变量
- 嵌套函数调用太多

### 场景 6：中断问题

**症状**：
- ISR 未执行
- 中断丢失
- 错误的中断优先级

**调试步骤**：

1. **检查中断启用标志**
   ```c
   debug_printf("EA=%d, ET0=%d, ES=%d\r\n", EA, ET0, ES);
   ```

2. **检查中断向量**
   ```c
   debug_printf("Interrupt addr: 0x%04X\r\n", 
                (OS_INTERRUPT_ADDR[1] << 8) | OS_INTERRUPT_ADDR[0]);
   ```

3. **监视 ISR 执行**
   ```c
   volatile u32 isr_count = 0;
   
   void timer0_isr(void) interrupt 1 {
       isr_count++;
       // ... ISR 代码 ...
   }
   
   // 在任务中
   debug_printf("ISR count: %lu\r\n", isr_count);
   ```

4. **检查 ISR 上下文**
   ```c
   debug_printf("In ISR: %d\r\n", os_in_isr());
   ```

**常见原因**：
- 中断未启用
- 错误的中断向量
- 中断优先级冲突
- ISR 太长

## 内存调试

### 内存布局验证

```c
void print_memory_layout(void)
{
    debug_printf("DATA segment usage:\r\n");
    debug_printf("  Kernel vars: 0x30-0x34\r\n");
    debug_printf("  System stack: 0x35-0x39\r\n");
    debug_printf("  Interrupt stack: 0x3A-0x41\r\n");
    debug_printf("  User stack: 0x42-0x7F\r\n");
    
    debug_printf("\nXDATA usage:\r\n");
    debug_printf("  Base: 0x%04X\r\n", OS_SYS_GLOBAL_BASE);
    debug_printf("  Size: %d bytes\r\n", OS_SYS_GLOBAL_SIZE);
}
```

### 栈使用分析

```c
void analyze_stack_usage(void)
{
    for(u8 i=0; i<OS_PROCESS_MAX; i++) {
        if(OS_JINCHENG_JILU_SP[i] != 0) {
            u8 used = OS_JINCHENG_SP[i] - OS_JINCHENG_JILU_SP[i];
            u8 total = (OS_PROCESS_OK[i] >> 4) & 0x0F;
            debug_printf("Task %d: used=%d, total=%d\r\n", i, used, total);
        }
    }
}
```

### 内存损坏检测

```c
// 添加内存保护
#define MEMORY_GUARD_1  0xDE
#define MEMORY_GUARD_2  0xAD

u8 guarded_buffer[10] = {MEMORY_GUARD_1, MEMORY_GUARD_2};

void check_memory_guards(void)
{
    if(guarded_buffer[0] != MEMORY_GUARD_1 ||
       guarded_buffer[1] != MEMORY_GUARD_2) {
        debug_printf("Memory corruption detected!\r\n");
    }
}
```

## 定时调试

### 时钟精度验证

```c
void verify_tick_timing(void)
{
    u32 start = os_uptime_ms();
    os_delay(100);  // 等待 100 个时钟周期
    u32 end = os_uptime_ms();
    u32 elapsed = end - start;
    debug_printf("Elapsed: %lu ms (expected ~%d ms)\r\n", 
                elapsed, 100 * OS_TIME_T0 / 10000);
}
```

### 任务切换频率

```c
volatile u32 context_switch_count = 0;

// 在调度器中（添加检测）
context_switch_count++;

// 在任务中监视
void monitor_task(void) {
    u32 last_count = 0;
    while(1) {
        u32 current = context_switch_count;
        u32 switches = current - last_count;
        debug_printf("Switches: %lu\r\n", switches);
        last_count = current;
        os_delay(1000);
    }
}
```

### 中断延迟测量

```c
void measure_interrupt_latency(void)
{
    // 在中断前设置 GPIO 高电平
    // ISR 设置 GPIO 低电平
    // 使用逻辑分析仪或定时器测量时间
}
```

## 状态调试

### 任务状态监视

```c
void monitor_all_task_states(void)
{
    for(u8 i=0; i<OS_PROCESS_MAX; i++) {
        u8 state = os_task_get_state(i);
        const char *state_str;
        switch(state) {
            case 0: state_str = "DEAD"; break;
            case 1: state_str = "RUNNING"; break;
            case 2: state_str = "READY"; break;
            case 3: state_str = "SUSPEND"; break;
            case 4: state_str = "PREV"; break;
            default: state_str = "UNKNOWN"; break;
        }
        debug_printf("Task %d: %s\r\n", i, state_str);
    }
}
```

### 资源状态监视

```c
void monitor_resources(void)
{
    for(u8 i=0; i<OS_RESOURCE_MAX; i++) {
        debug_printf("Res %d: val=%d own=%d wait=%d mask=0x%04X\r\n",
                    i, OS_RES[i].value, OS_RES[i].owner, 
                    OS_RES[i].wait_cnt, OS_RES[i].wait_mask);
    }
}
```

### 等待状态分析

```c
void analyze_wait_states(void)
{
    for(u8 i=0; i<OS_PROCESS_MAX; i++) {
        if(OS_TASK[i].wait_type != WAIT_NONE) {
            const char *wait_str;
            switch(OS_TASK[i].wait_type) {
                case WAIT_DELAY: wait_str = "DELAY"; break;
                case WAIT_SEM: wait_str = "SEM"; break;
                case WAIT_MUTEX: wait_str = "MUTEX"; break;
                case WAIT_EVENT: wait_str = "EVENT"; break;
                default: wait_str = "OTHER"; break;
            }
            debug_printf("Task %d waiting on %s, obj=%d, tick=%d\r\n",
                        i, wait_str, OS_TASK[i].wait_obj, OS_TASK[i].wait_tick);
        }
    }
}
```

## 调试最佳实践

### 1. 增量调试

- 从简单测试开始
- 逐渐增加复杂性
- 隔离问题
- 在继续之前验证修复

### 2. 可重现的测试用例

- 创建最小测试用例
- 确保问题可重现
- 记录测试条件
- 保存测试以供回归

### 3. 检测

- 策略性地添加调试输出
- 使用计数器进行频率分析
- 监视关键变量
- 调试后移除检测

### 4. 硬件辅助调试

- 可用时使用 ICE
- 使用逻辑分析仪进行时序分析
- 使用示波器进行信号验证
- 利用硬件断点

### 5. 系统性方法

1. 清楚定义问题
2. 收集信息
3. 形成假设
4. 测试假设
5. 验证修复
6. 记录解决方案

## 常见调试命令

### 检查系统状态

```c
void debug_system_state(void)
{
    debug_printf("=== System State ===\r\n");
    debug_printf("Current task: %d\r\n", OS_CURRENT_TASK);
    debug_printf("Prev task: %d\r\n", OS_PREV_TASK);
    debug_printf("Time slice: %d\r\n", OS_TIME_XY);
    debug_printf("Tick count: %lu\r\n", os_uptime_ms());
    debug_printf("RTOS mode: %d\r\n", OS_RTOS_YES);
    debug_printf("Sched reason: %d\r\n", OS_SCHED_REASON);
}
```

### 检查所有任务

```c
void debug_all_tasks(void)
{
    debug_printf("=== Task States ===\r\n");
    for(u8 i=0; i<OS_PROCESS_MAX; i++) {
        if(OS_PROCESS_OK[i] != 0) {
            debug_printf("Task %d: prio=%d, state=%d, wait=%d\r\n",
                        i, os_task_get_priority(i), 
                        os_task_get_state(i), OS_TASK[i].wait_type);
        }
    }
}
```

### 检查 IPC 资源

```c
void debug_ipc_resources(void)
{
    debug_printf("=== IPC Resources ===\r\n");
    for(u8 i=0; i<OS_RESOURCE_MAX; i++) {
        if(OS_RES[i].value != 0 || OS_RES[i].wait_cnt != 0) {
            debug_printf("Res %d: val=%d, own=%d, wait=%d\r\n",
                        i, OS_RES[i].value, OS_RES[i].owner, OS_RES[i].wait_cnt);
        }
    }
}
```

## 调试检查清单

在结束调试之前：

- [ ] 问题清楚定义
- [ ] 根本原因已识别
- [ ] 已实施修复
- [ ] 已测试修复
- [ ] 已执行回归测试
- [ ] 已更新文档
- [ ] 已添加测试用例（如适用）
- [ ] 已移除检测
- [ ] 已验证系统稳定

## 性能分析

### 任务 CPU 使用率

```c
typedef struct {
    u32 total_ticks;
    u32 task_ticks[OS_PROCESS_MAX];
} cpu_profile_t;

cpu_profile_t g_cpu_profile;

void profile_tick(void)
{
    g_cpu_profile.total_ticks++;
    g_cpu_profile.task_ticks[OS_CURRENT_TASK]++;
}

void print_cpu_usage(void)
{
    for(u8 i=0; i<OS_PROCESS_MAX; i++) {
        u32 usage = (g_cpu_profile.task_ticks[i] * 100) / g_cpu_profile.total_ticks;
        debug_printf("Task %d: %lu%%\r\n", i, usage);
    }
}
```

### 响应时间测量

```c
u32 measure_response_time(void (*task_func)(void))
{
    u32 start = os_uptime_ms();
    task_func();
    u32 end = os_uptime_ms();
    return end - start;
}
```

## 故障排除指南

### 快速参考

| 症状 | 可能原因 | 首先检查 |
|---------|--------------|-------------|
| 系统挂起 | 中断被禁用 | 检查 EA 标志 |
| 任务未运行 | 优先级太低 | 检查优先级 |
| 死锁 | 互斥锁未解锁 | 检查互斥锁所有权 |
| 栈溢出 | 栈太小 | 检查栈使用 |
| ISR 未触发 | 定时器未配置 | 检查定时器寄存器 |
| 内存损坏 | 栈溢出 | 检查栈保护 |

### 决策树

```
System Problem?
├─ System hangs?
│  ├─ Check EA flag
│  ├─ Check timer configuration
│  └─ Check critical sections
├─ Task not running?
│  ├─ Check task creation
│  ├─ Check priority
│  └─ Check ready flag
├─ IPC deadlock?
│  ├─ Check mutex ownership
│  ├─ Check wait queues
│  └─ Check resource states
└─ Memory issues?
   ├─ Check stack usage
   ├─ Check memory guards
   └─ Check heap (if used)
```

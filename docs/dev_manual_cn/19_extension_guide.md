# HRTOS 扩展指南

## 模块介绍

本指南为需要使用新功能、模块或功能扩展 HRTOS 的开发人员提供信息。它涵盖了在保持与现有设计兼容的同时扩展内核的推荐方法、模式和考虑因素。

## 主要职责

扩展指南涵盖：

- 添加新的 IPC 机制
- 添加新的系统服务
- 扩展现有模块
- 添加新的 API
- 配置扩展
- 移植到新硬件

## 扩展指南

### 一般原则

1. **保持兼容性**：不要破坏现有 API 或行为
2. **遵循模式**：使用现有的设计模式和约定
3. **最小化影响**：保持更改本地化和最小化
4. **记录更改**：更新所有更改的文档
5. **彻底测试**：确保新功能正常工作

### 扩展领域

#### 1. 添加新的 IPC 机制

**何时添加**：需要现有 IPC 未提供的新同步或通信机制。

**步骤**：

1. **定义资源类型**
   - 在 `Inc/config.h` 中添加新的等待类型：
   ```c
   #define WAIT_NEW_IPC  8   /* 新 IPC 类型 */
   ```

2. **实现资源操作**
   - 在适当的目录中创建新的源文件（例如 `Src/new_ipc/`）
   - 实现 init、wait、post 操作
   - 使用统一的 `OS_RESOURCE` 结构
   - 使用 `os_wait()` 进行阻塞操作

3. **添加公共 API**
   - 将 API 声明添加到 `Inc/new_ipc.h`
   - 遵循命名约定：`os_new_ipc_xxx()`
   - 如需要包含在 `Inc/hrtos.h` 中

4. **ISR 安全版本（如需要）**
   - 在 `Src/interrupt/` 中添加 ISR 安全函数
   - 遵循模式：`os_new_ipc_xxx_from_isr()`
   - 使用 `os_schedule_request()` 进行唤醒

**示例模式**：
```c
// Inc/new_ipc.h
char os_new_ipc_init(u8 id);
char os_new_ipc_wait(u8 id, u16 tick);
char os_new_ipc_post(u8 id);

// Src/new_ipc/new_ipc_wait.c
u8 os_new_ipc_wait(u8 id, u16 tick)
{
    if(id >= OS_RESOURCE_MAX) return 0;
    EA = 0;
    if(OS_RES[id].value == 0) {
        EA = 1;
        return os_wait(WAIT_NEW_IPC, id, tick);
    }
    if(OS_RES[id].value > 0) {
        OS_RES[id].value--;
        EA = 1;
        return WAIT_SIGNAL;
    }
    EA = 1;
    return 0;
}
```

#### 2. 添加新的系统服务

**何时添加**：需要与 IPC 或任务管理无关的新内核级服务。

**步骤**：

1. **定义服务接口**
   - 在 `Inc/` 中创建头文件
   - 定义 API 函数
   - 如需要定义数据结构

2. **实现服务**
   - 在适当的 `Src/` 子目录中创建源文件
   - 实现服务逻辑
   - 使用现有内核服务（等待、临界区等）

3. **与内核集成**
   - 如需要将初始化添加到 `hrtos_main()`
   - 如需要将清理添加到空闲任务
   - 确保适当的同步

4. **添加到文档**
   - 记录新服务
   - 添加使用示例
   - 更新架构文档

**示例**：添加统计服务

```c
// Inc/stats.h
typedef struct {
    u32 task_switches;
    u32 total_ticks;
    u16 idle_ticks;
} os_stats_t;

void os_stats_init(void);
void os_stats_get(os_stats_t *stats);

// Src/stats/stats.c
os_stats_t g_stats;

void os_stats_init(void)
{
    os_memset(&g_stats, 0, sizeof(os_stats_t));
}

void os_stats_get(os_stats_t *stats)
{
    EA = 0;
    *stats = g_stats;
    EA = 1;
}
```

#### 3. 扩展现有模块

**何时扩展**：需要在不破坏兼容性的情况下为现有模块添加功能。

**步骤**：

1. **分析现有代码**
   - 了解当前实现
   - 识别扩展点
   - 检查依赖关系

2. **添加新函数**
   - 添加到现有源文件或在模块目录中创建新文件
   - 遵循现有命名约定
   - 使用现有模式

3. **更新头文件**
   - 将新 API 声明添加到模块头文件
   - 记录新函数
   - 维持向后兼容性

4. **测试兼容性**
   - 确保现有功能仍然工作
   - 测试新功能
   - 检查副作用

**示例**：添加任务 CPU 使用率

```c
// Inc/task.h（添加到现有）
u8 os_task_get_cpu_usage(u8 id);

// Src/task/task_cpu_usage.c（新文件）
u8 os_task_get_cpu_usage(u8 id)
{
    // 使用现有定时基础设施实现
    return calculate_cpu_usage(id);
}
```

#### 4. 添加新的 API

**何时添加**：需要公开现有内部功能或添加新的公共接口。

**步骤**：

1. **定义 API 契约**
   - 指定参数
   - 指定返回值
   - 指定行为
   - 记录用法

2. **实现 API**
   - 在适当的源文件中实现
   - 添加错误检查
   - 如需要添加临界区

3. **添加到公共头文件**
   - 将声明添加到适当的 `Inc/*.h`
   - 如需要添加到 `Inc/hrtos.h`
   - 在头文件注释中记录

4. **更新文档**
   - 添加到 API 文档
   - 添加使用示例
   - 更新设计文档

**示例**：添加任务名称查询

```c
// Inc/task.h
const char* os_task_get_name(u8 id);

// Src/task/task_name.c
const char* os_task_get_name(u8 id)
{
    if(id >= OS_PROCESS_MAX) return NULL;
    return g_task_names[id];  // 假设名称数组存在
}
```

#### 5. 配置扩展

**何时添加**：需要新的配置选项或参数。

**步骤**：

1. **添加配置常量**
   - 添加到 `Inc/config.h` 或 `Inc/hrtos_internal.h`
   - 使用适当的命名约定
   - 设置合理的默认值

2. **在代码中使用配置**
   - 在实现中引用常量
   - 如需要添加条件编译
   - 记录配置效果

3. **更新文档**
   - 记录新配置选项
   - 解释有效范围
   - 提供示例

**示例**：添加时钟速率配置

```c
// Inc/config.h
#define OS_TICK_RATE_HZ  100  // 100 Hz = 10ms 时钟周期

// Src/time/tick_config.c
void os_tick_config(u8 slice_count, u16 tick_value)
{
    // 使用 OS_TICK_RATE_HZ 计算 tick_value
    OS_TIME_T0 = calculate_tick_value(OS_TICK_RATE_HZ);
    // ...
}
```

#### 6. 移植到新硬件

**何时添加**：需要支持新的微控制器或硬件变体。

**步骤**：

1. **分析目标硬件**
   - 内存布局
   - 寄存器组
   - 定时器配置
   - 中断系统

2. **创建移植层**
   - 创建或修改 `Src/port/` 文件
   - 实现硬件特定操作
   - 定义寄存器映射

3. **调整内存布局**
   - 更新 `Inc/hrtos_internal.h` 中的内存常量
   - 如需要调整栈大小
   - 如需要更新 XDATA 布局

4. **实现定时器 ISR**
   - 配置硬件定时器
   - 实现时钟中断处理程序
   - 测试定时精度

5. **彻底测试**
   - 测试所有内核功能
   - 测试定时精度
   - 测试内存使用
   - 压力测试

**示例**：移植到增强 8052

```c
// Inc/hrtos_internal.h（目标特定）
#define OS_USER_RAM_INIT            66
#define OS_USER_RAM_EXIT            255  // 更多 RAM
#define OS_SYS_GLOBAL_BASE          0x0200
#define OS_SYS_GLOBAL_SIZE          2048 // 更多 XDATA

// Src/port/timer2_init.c（新文件）
void timer2_init(void)
{
    T2CON = 0x04;      // Timer2，自动重载
    RCAP2H = TIMER2_RELOAD_H;
    RCAP2L = TIMER2_RELOAD_L;
    TH2 = RCAP2H;
    TL2 = RCAP2L;
    TR2 = 1;
    ET2 = 1;
    EA = 1;
}
```

## 扩展模式

### 模式 1：统一资源模型

添加 IPC 时，使用统一的 `OS_RESOURCE` 结构：

```c
// 好：使用统一模型
char os_new_ipc_init(u8 id)
{
    if(id >= OS_RESOURCE_MAX) return -1;
    os_res_init(&OS_RES[id]);
    OS_RES[id].value = initial_value;
    return 1;
}
```

### 模式 2：ISR 安全包装器

添加 ISR 安全功能时：

```c
// 好：ISR 安全模式
char os_new_ipc_post_from_isr(u8 id)
{
    if(id >= OS_RESOURCE_MAX) return -1;
    OS_RES[id].value++;
    OS_RES[id].pending_signal++;
    os_schedule_request(0);
    return 1;
}
```

### 模式 3：临界区保护

访问共享数据时：

```c
// 好：临界区模式
void shared_data_operation(void)
{
    OS_ENTER_CRITICAL();
    // 修改共享数据
    OS_EXIT_CRITICAL();
}
```

### 模式 4：错误检查

实现新 API 时：

```c
// 好：参数验证
char os_new_api(u8 param1, u16 param2)
{
    if(param1 > MAX_VALUE) return -1;
    if(param2 == 0) return -1;
    // 实现
    return 1;
}
```

## 扩展约束

### 内存约束

- 总 XDATA 限制为 512 字节（默认）
- 用户栈限制为 62 字节
- 最多 16 个标准任务
- 最多 8 个 IPC 资源
- 考虑扩展的内存影响

### 性能约束

- 必须维持实时性能
- 有界的执行时间
- 最小的中断延迟
- 快速路径优化

### 兼容性约束

- 不要破坏现有 API
- 如可能维持二进制兼容性
- 不要更改数据结构布局
- 记录任何破坏性更改

### 设计约束

- 遵循现有模式
- 尽可能使用统一模型
- 维持分层架构
- 避免循环依赖

## 扩展检查清单

在提交扩展之前，验证：

- [ ] 遵循现有命名约定
- [ ] 使用现有设计模式
- [ ] 包含错误检查
- [ ] 使用临界区保护共享数据
- [ ] 更新文档
- [ ] 包含使用示例
- [ ] 彻底测试
- [ ] 不破坏现有功能
- [ ] 考虑内存影响
- [ ] 考虑性能影响
- [ ] 维持实时保证

## 常见扩展错误

### 错误 1：破坏兼容性

**问题**：更改现有 API 签名或行为

**解决方案**：添加新 API 而不是更改现有 API

### 错误 2：忽略内存限制

**问题**：添加超出可用内存的功能

**解决方案**：在实现之前计算内存影响

### 错误 3：缺少临界区

**问题**：不保护共享数据

**解决方案**：始终对共享数据访问使用临界区

### 错误 4：错误处理不当

**问题**：不验证参数或处理错误

**解决方案**：添加全面的错误检查

### 错误 5：命名不一致

**问题**：不遵循命名约定

**解决方案**：所有 API 遵循 `os_xxx` 模式

## 扩展示例

### 示例 1：添加屏障同步

```c
// Inc/barrier.h
#define OS_BARRIER_MAX  4

char os_barrier_init(u8 id, u8 count);
char os_barrier_wait(u8 id);

// Src/barrier/barrier.c
typedef struct {
    u8 count;
    u8 waiting;
    u16 wait_mask;
} os_barrier_t;

os_barrier_t g_barriers[OS_BARRIER_MAX];

char os_barrier_init(u8 id, u8 count)
{
    if(id >= OS_BARRIER_MAX) return -1;
    g_barriers[id].count = count;
    g_barriers[id].waiting = 0;
    g_barriers[id].wait_mask = 0;
    return 1;
}

char os_barrier_wait(u8 id)
{
    u8 tid = OS_CURRENT_TASK;
    EA = 0;
    g_barriers[id].waiting++;
    g_barriers[id].wait_mask |= (1 << tid);
    
    if(g_barriers[id].waiting >= g_barriers[id].count) {
        // 释放所有
        g_barriers[id].waiting = 0;
        for(u8 i=0; i<OS_PROCESS_MAX; i++) {
            if(g_barriers[id].wait_mask & (1 << i)) {
                wake_task(i, WAIT_SIGNAL);
            }
        }
        g_barriers[id].wait_mask = 0;
        EA = 1;
        return WAIT_SIGNAL;
    }
    EA = 1;
    return os_wait(WAIT_BARRIER, id, 0);
}
```

### 示例 2：添加任务挂起计数

```c
// Inc/task.h（扩展）
u8 os_task_get_suspend_count(u8 id);

// Src/task/task_suspend_count.c
u8 os_task_get_suspend_count(u8 id)
{
    if(id >= OS_PROCESS_MAX) return 0;
    // 假设在 TCB 扩展中跟踪挂起计数
    return OS_TASK[id].suspend_count;
}
```

## 测试扩展

### 单元测试

- 单独测试新函数
- 测试边界情况
- 测试错误条件
- 测试参数验证

### 集成测试

- 与现有内核功能一起测试
- 与多个任务一起测试
- 与 IPC 操作一起测试
- 与中断一起测试

### 性能测试

- 测量执行时间
- 测量内存使用
- 在负载下测试
- 验证实时保证

### 回归测试

- 确保现有功能仍然工作
- 运行现有测试套件
- 检查副作用
- 验证兼容性

## 文档要求

### 代码文档

- 为新代码添加注释
- 记录函数目的
- 记录参数
- 记录返回值
- 记录副作用

### API 文档

- 在头文件中记录新 API
- 提供使用示例
- 记录行为
- 记录约束

### 架构文档

- 更新设计文档
- 更新数据结构文档
- 更新调用流程图
- 更新依赖信息

## 提交扩展

如果向主 HRTOS 项目贡献扩展：

1. **遵循编码标准**：匹配现有代码风格
2. **包含测试**：提供测试用例
3. **更新文档**：更新所有相关文档
4. **审查流程**：准备好进行代码审查
5. **向后兼容性**：维持兼容性，除非破坏性更改是必要且已记录的

# HRTOS 移植层

## 模块介绍

移植层为 HRTOS 提供硬件抽象，将硬件特定代码与内核核心隔离。这使得 HRTOS 可以移植到不同的 8051 变体或类似的微控制器，而对内核代码的更改最小。

## 主要职责

移植层处理：

- CPU 特定操作
- 硬件寄存器访问
- 上下文保存/恢复实现
- 中断向量配置
- 定时器配置
- 栈操作原语

## 主要文件

### 源文件

- `Src/port/cpu_nop.c`：CPU 空操作指令

### 头文件

- `Inc/hrtos.h`：包含 8051 寄存器的 `reg52.h`
- `Inc/config.h`：硬件特定配置
- `Inc/hrtos_internal.h`：内部移植定义

## 数据结构

### 寄存器定义

HRTOS 包含标准 8051 寄存器定义：

```c
#include <reg52.h>  /* 51单片机通用寄存器定义 */
```

这提供对以下内容的访问：
- 特殊功能寄存器（SFR）
- 可位寻址寄存器
- I/O 端口
- 定时器寄存器
- 中断寄存器

## 核心函数

### cpu_nop()

**位置**：`Src/port/cpu_nop.c`

**目的**：CPU 空操作指令

**实现**：通常是单个 NOP 指令或空函数

**用途**：用于短延时或时序填充

## 移植要求

### 所需硬件功能

要将 HRTOS 移植到新目标，硬件必须支持：

1. **定时器**：至少一个硬件定时器（默认使用 Timer0）
2. **中断**：可配置中断向量
3. **栈**：硬件栈支持
4. **内存**：DATA、IDATA 和 XDATA 段（或等效）

### 移植步骤

#### 1. 寄存器定义

创建或修改寄存器定义文件：

```c
// 对于目标特定寄存器
#include <reg_target.h>
```

#### 2. 内存布局

在 `Inc/hrtos_internal.h` 中更新内存配置：

```c
#define OS_USER_RAM_INIT            <target_stack_start>
#define OS_USER_RAM_EXIT            <target_stack_end>
#define OS_SYS_GLOBAL_BASE          <target_xdata_base>
#define OS_SYS_GLOBAL_SIZE          <target_xdata_size>
```

#### 3. 定时器配置

在目标特定代码中修改定时器初始化：

```c
// Timer0 配置
void timer0_init(void) {
    TMOD &= 0xF0;      // 设置 Timer0 模式
    TMOD |= 0x01;      // 模式 1：16 位定时器
    TH0 = <reload_high>;
    TL0 = <reload_low>;
    TR0 = 1;           // 启动定时器
    ET0 = 1;           // 启用 Timer0 中断
    EA = 1;            // 全局中断启用
}
```

#### 4. 中断向量

为目标定义中断向量：

```c
// Timer0 中断向量
void timer0_isr(void) interrupt 1 {
    // HRTOS 时钟处理
}
```

#### 5. 上下文保存/恢复

为目标架构实现上下文保存/恢复：

```c
// 上下文保存格式取决于 CPU
void context_save(void) {
    // 保存寄存器
}

void context_restore(void) {
    // 恢复寄存器
}
```

#### 6. 栈操作

确保栈操作适用于目标的栈：

```c
// 栈压入/弹出
#pragma asm
PUSH    direct
#pragma endasm
```

## 硬件抽象

### 定时器抽象

HRTOS 默认使用 Timer0。对于移植：

```c
// 定时器配置
#define OS_TIME_T0  <target_timer_reload>

// 定时器 ISR
void timer0_isr(void) interrupt TIMER0_VECTOR {
    // HRTOS 时钟处理
}
```

### 中断抽象

中断处理可能需要调整：

```c
// 中断启用/禁用
#define OS_ENTER_CRITICAL()   <target_disable_interrupts>
#define OS_EXIT_CRITICAL()    <target_enable_interrupts>

// 中断向量
#define TIMER0_VECTOR          <target_timer0_vector>
```

### 内存抽象

内存段可能不同：

```c
// 直接寻址
volatile unsigned char data VAR _at_ <address>;

// 间接寻址
volatile unsigned char idata VAR _at_ <address>;

// 外部内存
volatile unsigned char xdata VAR _at_ <address>;
```

## 目标特定考虑

### 8051 变体

#### 标准 8051

- 128 字节内部 RAM
- 4 个 I/O 端口
- 2 个定时器
- 5 个中断源

#### 8052

- 256 字节内部 RAM
- 额外定时器（Timer2）
- 更多中断源

#### 增强 8051

- 更多内部 RAM
- 额外外设
- 不同时钟速度

### 非 8051 目标

对于移植到非 8051 架构：

1. **内存模型**：适应目标内存架构
2. **寄存器组**：将目标寄存器映射到 HRTOS 期望
3. **中断系统**：实现中断抽象层
4. **定时器**：配置等效定时器硬件
5. **栈**：使栈操作适应目标调用约定

## 移植检查清单

### 内存配置

- [ ] 更新 `OS_USER_RAM_INIT` 和 `OS_USER_RAM_EXIT`
- [ ] 更新 `OS_SYS_GLOBAL_BASE` 和 `OS_SYS_GLOBAL_SIZE`
- [ ] 验证栈空间充足
- [ ] 如需要调整上下文保存区域大小

### 定时器配置

- [ ] 配置定时器以获得所需时钟速率
- [ ] 设置定时器重载值
- [ ] 实现定时器 ISR
- [ ] 测试时钟精度

### 中断配置

- [ ] 定义中断向量
- [ ] 实现临界区宏
- [ ] 测试中断嵌套
- [ ] 验证 ISR 安全 API

### 上下文切换

- [ ] 实现上下文保存
- [ ] 实现上下文恢复
- [ ] 测试任务切换
- [ ] 验证寄存器保留

### 测试

- [ ] 运行基本任务创建测试
- [ ] 测试任务切换
- [ ] 测试延时功能
- [ ] 测试 IPC 机制
- [ ] 测试 ISR 交互
- [ ] 使用多个任务进行压力测试

## 移植示例：增强 8051

### 配置更改

```c
// 具有更多 RAM 的增强 8051
#define OS_USER_RAM_INIT            66
#define OS_USER_RAM_EXIT            255      // 更多栈空间
#define OS_SYS_GLOBAL_BASE          0x0200
#define OS_SYS_GLOBAL_SIZE          1024     // 更多 XDATA
```

### 定时器配置

```c
// 使用 Timer2 获得更高分辨率
void timer2_init(void) {
    T2CON = 0x04;      // Timer2，自动重载
    RCAP2H = <reload_high>;
    RCAP2L = <reload_low>;
    TH2 = RCAP2H;
    TL2 = RCAP2L;
    TR2 = 1;           // 启动 Timer2
    ET2 = 1;           // 启用 Timer2 中断
    EA = 1;
}

void timer2_isr(void) interrupt 5 {
    // HRTOS 时钟处理
}
```

## 约束

- 必须至少有一个硬件定时器
- 必须支持中断嵌套
- 必须有足够的内核结构 RAM
- 栈必须支持硬件压入/弹出操作
- 上下文保存/恢复必须保留所有必要的寄存器

## 限制

- 目前针对 8051 架构优化
- 系统时钟限制为单个定时器
- 不支持对称多处理
- 不支持内存保护单元
- 内核不支持浮点

## 未来移植增强

可移植性的潜在改进：

1. **HAL 层**：更全面的硬件抽象层
2. **驱动接口**：标准化驱动接口
3. **架构支持**：支持 ARM、RISC-V 等
4. **可配置内存**：更灵活的内存配置
5. **定时器选择**：支持多个定时器选项
6. **中断控制器**：支持高级中断控制器

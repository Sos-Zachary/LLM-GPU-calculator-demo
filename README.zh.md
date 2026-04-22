<div align="center">

# 🧮 LLM 显存占用计算器

**为 Qwen3.5 全系列模型打造的专业 GPU 显存估算工具。**

[![Live Demo](https://img.shields.io/badge/🔗-在线演示-blue)](https://sos-zachary.github.io/GPUmemory-calculator-demo/)
[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/-Apache--2.0-green)](./LICENSE)

🚀 [**https://sos-zachary.github.io/GPUmemory-calculator-demo/**](https://sos-zachary.github.io/GPUmemory-calculator-demo/)

</div>

---

## 📝 项目简介

LLM 显存占用计算器是一款交互式单页 Web 应用，用于估算在不同配置下运行 **Qwen3.5** 大语言模型所需的 GPU 显存。涵盖完整模型阵容——从轻量级的 **0.8B** 到旗舰 **397B-A17B** MoE 模型——并支持多种量化方法、推理引擎、上下文长度和并发数配置。

### ✨ 功能特性

| 特性 | 说明 |
|------|------|
| 🎛️ **交互式配置** | 实时调整量化方式、推理引擎、上下文长度与并发数 |
| 📊 **可视化拆分** | 堆叠柱状图与饼图直观展示显存占用分布 |
| 💡 **GPU 推荐** | 根据当前配置智能推荐合适的 GPU 硬件 |
| 🌗 **深色 / 浅色主题** | 无缝主题切换，保护视力 |
| 📱 **响应式设计** | 完美适配桌面端与移动端 |

---

## 🤖 关于本项目

> 💻 本项目由 [**Kimi K2.6**](https://www.moonshot.cn/) 大语言模型辅助，采用 **Vibe Coding** 方式完成。

从 UI 设计到计算逻辑，整个应用均通过自然语言提示与 AI 辅助迭代协作开发，展现了 AI 驱动软件开发工作流的潜力。

---

## 🧪 计算公式

本工具采用业界通用的简化估算公式：

### 1. 模型权重 (Model Weights)

$$
\text{模型权重} = \frac{\text{总参数量(B)} \times \text{每参数字节数}}{2^{30}} \text{ GB}
$$

> 💡 **MoE 模型**：所有专家参数都会加载到显存中。

### 2. KV Cache

$$
\text{KV Cache} = \frac{2 \times \text{层数} \times \text{KV 头数} \times \text{头维度} \times \text{上下文长度} \times \text{并发数} \times \text{KV 每参数字节数}}{2^{30}} \text{ GB}
$$

> 💡 使用模型的架构维度（对应激活参数量）进行计算。

### 3. 激活值 (Activations)

$$
\text{激活值} \approx \frac{\text{并发数} \times \text{上下文长度} \times \text{隐藏层大小} \times 18 \times \text{每参数字节数}}{2^{30}} \text{ GB}
$$

### 4. 引擎开销 (Engine Overhead)

$$
\text{引擎开销} = (\text{权重} + \text{KV Cache} + \text{激活值}) \times \text{开销系数}
$$

### 5. 总显存占用 (Total VRAM)

$$
\text{总显存} = \text{权重} + \text{KV Cache} + \text{激活值} + \text{引擎开销}
$$

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | [React](https://react.dev/) 19 |
| 语言 | [TypeScript](https://www.typescriptlang.org/) 5.9 |
| 构建工具 | [Vite](https://vitejs.dev/) 7 |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) 3 |
| UI 组件 | [shadcn/ui](https://ui.shadcn.com/) |
| 图表 | [Recharts](https://recharts.org/) |
| 图标 | [Lucide React](https://lucide.dev/) |

---

## 📦 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 📂 项目结构

```
src/
├── main.tsx          # 入口文件
├── App.tsx           # 主应用 UI（约 750 行）
├── index.css         # 全局样式与主题系统
├── components/ui/    # 40+ 个 shadcn/ui 组件
├── data/modelData.ts # 领域模型与显存计算逻辑
├── hooks/useTheme.tsx# 深色 / 浅色主题上下文
└── lib/utils.ts      # Tailwind 类名合并工具
```

---

## 📄 许可证

本项目采用 [Apache-2.0 许可证](./LICENSE) 开源。

<div align="center">

# 🧮 LLM VRAM Calculator

**A professional GPU VRAM estimation tool for the Qwen3.5 model family.**

[![Live Demo](https://img.shields.io/badge/🔗-Live%20Demo-blue)](https://sos-zachary.github.io/GPUmemory-calculator-demo/)
[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/-Apache--2.0-green)](./LICENSE)

🚀 [**https://sos-zachary.github.io/GPUmemory-calculator-demo/**](https://sos-zachary.github.io/GPUmemory-calculator-demo/)

</div>

---

## 📝 Overview

LLM VRAM Calculator is an interactive, single-page web application that estimates GPU VRAM consumption for running **Qwen3.5** LLM models under various configurations. It covers the complete model lineup — from the lightweight **0.8B** to the flagship **397B-A17B** MoE model — and supports multiple quantization methods, inference engines, context lengths, and concurrency levels.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🎛️ **Interactive Config** | Adjust quantization, engine, context length, and concurrency in real time |
| 📊 **Visual Breakdown** | Stacked bar charts and pie charts show memory distribution |
| 💡 **GPU Recommendations** | Get tailored GPU hardware suggestions based on your config |
| 🌗 **Dark / Light Theme** | Seamless theme switching for comfortable viewing |
| 📱 **Responsive Design** | Optimized for both desktop and mobile devices |

---

## 🤖 About This Project

> 💻 This project was built with **Vibe Coding** assisted by the [**Kimi K2.6**](https://www.moonshot.cn/) large language model.

The entire application — from UI design to calculation logic — was collaboratively developed through natural language prompts and AI-assisted iterations, demonstrating the potential of AI-powered software development workflows.

---

## 🧪 Formulas

The calculator uses industry-standard simplified estimation formulas:

### 1. Model Weights

$$
\text{Model Weights} = \frac{\text{totalParams} \times \text{bytesPerParam}}{2^{30}} \text{ GB}
$$

> 💡 For **MoE** models, **all** expert parameters are loaded into VRAM.

### 2. KV Cache

$$
\text{KV Cache} = \frac{2 \times \text{layers} \times \text{numKVHeads} \times \text{headDim} \times \text{contextLength} \times \text{concurrency} \times \text{kvBytesPerParam}}{2^{30}} \text{ GB}
$$

> 💡 Calculated using the model's architecture dimensions (activated parameters).

### 3. Activations

$$
\text{Activations} \approx \frac{\text{concurrency} \times \text{contextLength} \times \text{hiddenSize} \times 18 \times \text{bytesPerParam}}{2^{30}} \text{ GB}
$$

### 4. Engine Overhead

$$
\text{Engine Overhead} = (\text{weights} + \text{KV Cache} + \text{activations}) \times \text{overheadFactor}
$$

### 5. Total VRAM

$$
\text{Total VRAM} = \text{weights} + \text{KV Cache} + \text{activations} + \text{Engine Overhead}
$$

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React](https://react.dev/) 19 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.9 |
| Build Tool | [Vite](https://vitejs.dev/) 7 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3 |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```
src/
├── main.tsx          # Entry point
├── App.tsx           # Main application UI (~750 lines)
├── index.css         # Global styles & theme system
├── components/ui/    # 40+ shadcn/ui components
├── data/modelData.ts # Domain models & VRAM calculation logic
├── hooks/useTheme.tsx# Dark / light theme context
└── lib/utils.ts      # Tailwind class merge utility
```

---

## 📄 License

This project is licensed under the [Apache-2.0 License](./LICENSE).

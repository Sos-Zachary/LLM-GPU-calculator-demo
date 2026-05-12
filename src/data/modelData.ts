// ==========================================
// Qwen3.5 Full Series Model Specifications
// ==========================================

export interface ModelSpec {
  id: string;
  name: string;
  totalParams: number;      // in billions
  activeParams: number;     // in billions (for MoE: activated params; for Dense: same as total)
  architecture: 'Dense' | 'MoE';
  layers: number;
  hiddenSize: number;
  numHeads: number;
  numKVHeads: number;
  headDim: number;
  ffnSize: number;
  vocabSize: number;
  maxContext: number;       // native max context length
  releaseDate: string;
  description: string;
}

export const qwen35Models: ModelSpec[] = [
  {
    id: 'qwen3.5-0.8b',
    name: 'Qwen3.5-0.8B',
    totalParams: 0.8,
    activeParams: 0.8,
    architecture: 'Dense',
    layers: 24,
    hiddenSize: 1024,
    numHeads: 16,
    numKVHeads: 4,
    headDim: 64,
    ffnSize: 2816,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-03-02',
    description: '极致轻量，IoT/移动端首选',
  },
  {
    id: 'qwen3.5-2b',
    name: 'Qwen3.5-2B',
    totalParams: 2,
    activeParams: 2,
    architecture: 'Dense',
    layers: 28,
    hiddenSize: 1280,
    numHeads: 20,
    numKVHeads: 4,
    headDim: 64,
    ffnSize: 3584,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-03-02',
    description: '轻量级本地AI助手',
  },
  {
    id: 'qwen3.5-4b',
    name: 'Qwen3.5-4B',
    totalParams: 4,
    activeParams: 4,
    architecture: 'Dense',
    layers: 32,
    hiddenSize: 1536,
    numHeads: 24,
    numKVHeads: 4,
    headDim: 64,
    ffnSize: 4608,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-03-02',
    description: '轻量智能体基座',
  },
  {
    id: 'qwen3.5-9b',
    name: 'Qwen3.5-9B',
    totalParams: 9,
    activeParams: 9,
    architecture: 'Dense',
    layers: 32,
    hiddenSize: 4096,
    numHeads: 16,
    numKVHeads: 4,
    headDim: 128,
    ffnSize: 12288,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-03-02',
    description: '中小企业AI服务平台首选',
  },
  {
    id: 'qwen3.5-27b',
    name: 'Qwen3.5-27B',
    totalParams: 27,
    activeParams: 27,
    architecture: 'Dense',
    layers: 64,
    hiddenSize: 5120,
    numHeads: 40,
    numKVHeads: 8,
    headDim: 128,
    ffnSize: 17408,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-02-24',
    description: '高性能稠密模型，代码能力顶尖',
  },
  {
    id: 'qwen3.5-35b-a3b',
    name: 'Qwen3.5-35B-A3B',
    totalParams: 35,
    activeParams: 3,
    architecture: 'MoE',
    layers: 36,
    hiddenSize: 2048,
    numHeads: 24,
    numKVHeads: 4,
    headDim: 128,
    ffnSize: 5632,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-02-24',
    description: 'MoE架构，35B总参/3B激活，性能超Qwen3-235B',
  },
  {
    id: 'qwen3.5-122b-a10b',
    name: 'Qwen3.5-122B-A10B',
    totalParams: 122,
    activeParams: 10,
    architecture: 'MoE',
    layers: 64,
    hiddenSize: 8192,
    numHeads: 64,
    numKVHeads: 8,
    headDim: 128,
    ffnSize: 22016,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-02-24',
    description: '企业级强推理与多模态',
  },
  {
    id: 'qwen3.5-397b-a17b',
    name: 'Qwen3.5-397B-A17B',
    totalParams: 397,
    activeParams: 17,
    architecture: 'MoE',
    layers: 94,
    hiddenSize: 8192,
    numHeads: 64,
    numKVHeads: 8,
    headDim: 128,
    ffnSize: 22016,
    vocabSize: 151936,
    maxContext: 262144,
    releaseDate: '2026-02-16',
    description: '开源旗舰，397B总参/17B激活，对标GPT-5',
  },
];

// ==========================================
// Quantization Methods
// ==========================================

export interface QuantMethod {
  id: string;
  name: string;
  bits: number;
  bytesPerParam: number;
  qualityRetention: string;  // percentage vs FP16
  speedup: string;
  vramReduction: string;
  description: string;
  bestFor: string;
  engineSupport: string[];
}

export const quantMethods: QuantMethod[] = [
  {
    id: 'fp16',
    name: 'FP16 (BF16)',
    bits: 16,
    bytesPerParam: 2,
    qualityRetention: '100%',
    speedup: '1.0x',
    vramReduction: '0%',
    description: '半精度浮点，标准基线。每个参数2字节。适合精度敏感场景和高端GPU部署。',
    bestFor: '精度基准、高端GPU部署、训练微调',
    engineSupport: ['vLLM', 'TensorRT-LLM', 'SGLang', 'HuggingFace', 'llama.cpp'],
  },
  {
    id: 'fp8',
    name: 'FP8 (E4M3)',
    bits: 8,
    bytesPerParam: 1,
    qualityRetention: '~99%',
    speedup: '1.5-1.8x',
    vramReduction: '~50%',
    description: '8位浮点(Hopper/Blackwell原生支持)。精度损失极小，显存减半。H100/H200首选。',
    bestFor: 'H100/H200/Hopper架构生产环境',
    engineSupport: ['vLLM', 'TensorRT-LLM', 'SGLang'],
  },
  {
    id: 'int8',
    name: 'INT8',
    bits: 8,
    bytesPerParam: 1,
    qualityRetention: '~97-98%',
    speedup: '1.3-1.5x',
    vramReduction: '~45%',
    description: '8位整数量化。广泛兼容，精度损失小。SmoothQuant等方法优化激活值异常值问题。',
    bestFor: '精度敏感的生产服务、通用GPU部署',
    engineSupport: ['vLLM', 'TensorRT-LLM', 'SGLang', 'HuggingFace'],
  },
  {
    id: 'int4',
    name: 'INT4 (GPTQ)',
    bits: 4,
    bytesPerParam: 0.5,
    qualityRetention: '~93-95%',
    speedup: '1.8-2.2x',
    vramReduction: '~73%',
    description: '4位整数量化，逐层优化量化误差。显存缩减至1/4。适合显存受限的GPU推理。',
    bestFor: '显存受限场景、消费级GPU部署',
    engineSupport: ['vLLM', 'HuggingFace', 'AutoGPTQ'],
  },
  {
    id: 'int4-awq',
    name: 'INT4 (AWQ)',
    bits: 4,
    bytesPerParam: 0.5,
    qualityRetention: '~94-96%',
    speedup: '1.8-2.2x',
    vramReduction: '~73%',
    description: '激活感知权重量化，保护1%关键权重。INT4下精度最优，vLLM生产部署首选。',
    bestFor: 'vLLM生产部署、VRAM受限环境',
    engineSupport: ['vLLM', 'AutoAWQ', 'HuggingFace'],
  },
  {
    id: 'int4-autoround',
    name: 'INT4 (AutoRound)',
    bits: 4,
    bytesPerParam: 0.5,
    qualityRetention: '~95-97%',
    speedup: '1.8-2.2x',
    vramReduction: '~73%',
    description: 'Intel提出的无校准量化方法，4-bit精度超越GPTQ/AWQ。量化速度快，兼容GGUF/vLLM。',
    bestFor: '快速量化部署、精度优先的INT4场景',
    engineSupport: ['vLLM', 'HuggingFace'],
  },
  {
    id: 'q4_k_m',
    name: 'GGUF Q4_K_M',
    bits: 4,
    bytesPerParam: 0.5,
    qualityRetention: '~92-94%',
    speedup: '1.5-1.8x(CPU)',
    vramReduction: '~73%',
    description: 'llama.cpp原生格式，分组量化(Q4_K)。本地/边缘CPU推理首选，Ollama默认格式。',
    bestFor: '本地CPU+GPU混合推理、Ollama用户',
    engineSupport: ['llama.cpp', 'Ollama'],
  },
  {
    id: 'q8_0',
    name: 'GGUF Q8_0',
    bits: 8,
    bytesPerParam: 1,
    qualityRetention: '~97-98%',
    speedup: '1.0-1.2x(CPU)',
    vramReduction: '~45%',
    description: 'llama.cpp 8位量化格式。CPU推理中高精度选项，适合质量优先的本地部署。',
    bestFor: 'CPU推理高精度场景',
    engineSupport: ['llama.cpp', 'Ollama'],
  },
];

// ==========================================
// Inference Engines
// ==========================================

export interface InferenceEngine {
  id: string;
  name: string;
  overheadFactor: number;   // additional memory overhead multiplier
  kvCacheEfficiency: number; // KV cache utilization efficiency
  description: string;
  strengths: string[];
  bestFor: string;
  quantizationSupport: string[];
}

export const inferenceEngines: InferenceEngine[] = [
  {
    id: 'vllm',
    name: 'vLLM',
    overheadFactor: 0.05,
    kvCacheEfficiency: 0.95,
    description: 'PagedAttention首创者，显存利用率95%+。连续批处理、广泛模型支持，通用生产环境首选。',
    strengths: ['PagedAttention', '连续批处理', 'OpenAI API兼容', '量化支持全面'],
    bestFor: '通用生产环境、快速部署、广泛模型支持',
    quantizationSupport: ['FP16', 'FP8', 'INT8', 'INT4-GPTQ', 'INT4-AWQ'],
  },
  {
    id: 'tensorrt-llm',
    name: 'TensorRT-LLM',
    overheadFactor: 0.08,
    kvCacheEfficiency: 0.92,
    description: 'NVIDIA官方编译优化框架。内核融合、极致性能。编译后吞吐量比vLLM高30-50%。',
    strengths: ['极致吞吐量', 'FP8硬件优化', '投机解码', 'NVIDIA硬件深度优化'],
    bestFor: 'NVIDIA集群大规模生产、极致性能追求',
    quantizationSupport: ['FP16', 'FP8', 'INT8', 'INT4'],
  },
  {
    id: 'sglang',
    name: 'SGLang',
    overheadFactor: 0.06,
    kvCacheEfficiency: 0.93,
    description: 'RadixAttention自动前缀缓存，结构化输出优化。多轮对话和Agent场景表现突出。',
    strengths: ['RadixAttention前缀缓存', '结构化生成', '多轮对话优化', '编程灵活性'],
    bestFor: 'Agent应用、多轮对话、RAG系统',
    quantizationSupport: ['FP16', 'FP8', 'INT8', 'INT4'],
  },
  {
    id: 'hf',
    name: 'HuggingFace Transformers',
    overheadFactor: 0.15,
    kvCacheEfficiency: 0.75,
    description: '最通用的推理方式。显存利用率较低(~75%)，但兼容性和易用性最好。',
    strengths: ['最大兼容性', '最易上手', '生态系统丰富', '调试方便'],
    bestFor: '开发调试、原型验证、教育研究',
    quantizationSupport: ['FP16', 'INT8', 'INT4-GPTQ', 'INT4-AWQ'],
  },
  {
    id: 'llamacpp',
    name: 'llama.cpp / Ollama',
    overheadFactor: 0.10,
    kvCacheEfficiency: 0.80,
    description: 'CPU+GPU混合推理专家。GGUF格式原生支持，本地部署和消费级硬件首选。',
    strengths: ['CPU推理', 'GGUF原生支持', '跨平台', '本地隐私'],
    bestFor: '本地部署、边缘设备、CPU推理、隐私敏感场景',
    quantizationSupport: ['GGUF-Q4_K_M', 'GGUF-Q8_0', 'GGUF-Q5_K_M', 'GGUF-Q2_K'],
  },
];

// ==========================================
// Context Length Presets
// ==========================================

export const contextPresets = [
  { label: '4K', value: 4096 },
  { label: '8K', value: 8192 },
  { label: '16K', value: 16384 },
  { label: '32K', value: 32768 },
  { label: '64K', value: 65536 },
  { label: '128K', value: 131072 },
  { label: '256K', value: 262144 },
];

// ==========================================
// Concurrency Presets
// ==========================================

export const concurrencyPresets = [
  { label: '1 (单用户)', value: 1 },
  { label: '2', value: 2 },
  { label: '4', value: 4 },
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: '32', value: 32 },
  { label: '64', value: 64 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
];

// ==========================================
// VRAM Calculation Functions
// ==========================================

export interface VRAMBreakdown {
  modelWeights: number;      // GB
  kvCache: number;           // GB
  originalKVCache?: number;  // GB (before optimization)
  activations: number;       // GB
  engineOverhead: number;    // GB
  total: number;             // GB
}

export interface CalculationParams {
  model: ModelSpec;
  quantMethod: QuantMethod;
  engine: InferenceEngine;
  contextLength: number;
  concurrency: number;
  kvCacheQuant?: QuantMethod;     // optional KV cache quantization (default FP16)
  prefixCacheHitRate?: number;    // 0-1, prefix caching hit rate (default 0)
}

/**
 * Calculate VRAM breakdown for given configuration
 *
 * Formulas (industry-standard simplified estimation):
 * 1. Model Weights = totalParams(B) × bytesPerParam / 2^30
 * 2. KV Cache = 2 × layers × numKVHeads × headDim × contextLength × concurrency × kvBytes / 2^30
 *    (2 for K + V tensors)
 * 3. Activations ≈ batch × seq_len × hiddenSize × 18 × bytesPerParam / 2^30
 *    (factor 18 = attention Q/K/V/O + FFN intermediate buffers for single layer,
 *     inference uses layer-by-layer computation so only ~1 layer stored at a time)
 * 4. Engine Overhead = (Model Weights + KV Cache + Activations) × overheadFactor
 *    (covers PagedAttention metadata, CUDA workspace, activation buffers, etc.)
 */
export function calculateVRAM(params: CalculationParams): VRAMBreakdown {
  const { model, quantMethod, engine, contextLength, concurrency, kvCacheQuant, prefixCacheHitRate } = params;

  // KV cache bytes per parameter: default FP16 (2 bytes).
  // Advanced engines support KV cache quantization (FP8/INT8) independent of weight quantization.
  const kvBytesPerParam = kvCacheQuant ? kvCacheQuant.bytesPerParam : 2;

  // 1. Model Weights — ALL parameters must be loaded (including all experts for MoE)
  const modelWeightsGB = model.totalParams * 1e9 * quantMethod.bytesPerParam / (1024 ** 3);

  // 2. KV Cache — size depends on model architecture (layers, kv_heads, head_dim),
  //    NOT on parameter count. MoE benefits: KV Cache scales with active params' config.
  const perTokenKVBytes = 2 * model.layers * model.numKVHeads * model.headDim * kvBytesPerParam;
  const totalKVCacheBytes = perTokenKVBytes * contextLength * concurrency;
  const originalKVCacheGB = totalKVCacheBytes / (1024 ** 3);

  // Apply prefix caching: shared prefix KV is stored once and reused across requests.
  // hitRate=0.7 means 70% of KV Cache is shared and only stored once.
  const hitRate = prefixCacheHitRate ?? 0;
  const effectiveConcurrency = concurrency === 1
    ? 1
    : 1 + (concurrency - 1) * (1 - hitRate);
  const kvCacheGB = originalKVCacheGB * (effectiveConcurrency / concurrency);

  // 3. Activations — simplified estimation for inference (single forward pass, no gradients).
  // Factor 18 accounts for: Q/K/V/O projections (4x) + FFN up/gate/down (3x) + buffers (~11x).
  // During inference, activations are computed layer-by-layer, so we don't need all layers simultaneously.
  const ACTIVATION_FACTOR = 18;
  const activationBytes = concurrency * contextLength * model.hiddenSize * ACTIVATION_FACTOR * quantMethod.bytesPerParam;
  const activationsGB = activationBytes / (1024 ** 3);

  // 4. Engine Overhead — applies to ALL memory (weights + KV cache + activations)
  const overheadGB = (modelWeightsGB + kvCacheGB + activationsGB) * engine.overheadFactor;

  const total = modelWeightsGB + kvCacheGB + activationsGB + overheadGB;

  return {
    modelWeights: Math.round(modelWeightsGB * 100) / 100,
    kvCache: Math.round(kvCacheGB * 100) / 100,
    originalKVCache: Math.round(originalKVCacheGB * 100) / 100,
    activations: Math.round(activationsGB * 100) / 100,
    engineOverhead: Math.round(overheadGB * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// Get GPU recommendations based on total VRAM
export function getGPURecommendations(totalVRAM: number): { name: string; vram: number; count: number }[] {
  const gpus = [
    { name: 'RTX 4090', vram: 24 },
    { name: 'RTX 3090', vram: 24 },
    { name: 'A100 40GB', vram: 40 },
    { name: 'A100 80GB', vram: 80 },
    { name: 'H100 80GB', vram: 80 },
    { name: 'H200 141GB', vram: 141 },
    { name: 'A6000 48GB', vram: 48 },
    { name: 'RTX 6000 Ada', vram: 48 },
  ];

  return gpus
    .map(gpu => ({
      ...gpu,
      count: Math.ceil(totalVRAM / gpu.vram),
    }))
    .filter(g => g.count <= 8) // reasonable max
    .sort((a, b) => a.count - b.count || a.vram - b.vram)
    .slice(0, 4);
}

// ==========================================
// Factor Impact Analysis Data
// ==========================================

export interface FactorImpact {
  factor: string;
  impact: '线性' | '平方' | '对数' | '常数' | '指数';
  description: string;
  formula: string;
  examples: string[];
}

export const factorImpacts: FactorImpact[] = [
  {
    factor: '模型参数量 (Parameters)',
    impact: '线性',
    description: '模型权重显存占用与总参数量严格成正比。MoE模型需加载全部专家参数，但KV Cache按激活参数计算。',
    formula: '模型权重(GB) = 参数量(B) × 每参数字节数 / 2³⁰',
    examples: [
      '70B × 2B(FP16) = 140 GB',
      '397B MoE × 0.5B(INT4) = ~199 GB (权重)',
      '397B MoE 激活17B, KV Cache按17B配置计算',
    ],
  },
  {
    factor: '量化精度 (Quantization)',
    impact: '线性',
    description: '每参数字节数直接决定模型权重大小。INT4减半(0.5B)，INT8/FP8为1B，FP16为2B。也影响KV Cache精度。',
    formula: '压缩率 = 原始精度位数 / 量化位数',
    examples: [
      'FP16→INT8: 2x显存节省, 精度损失~2-3%',
      'FP16→INT4: 4x显存节省, 精度损失~5-7%',
      'FP8(H100原生): 2x节省, 精度损失~1%',
    ],
  },
  {
    factor: '上下文长度 (Context Length)',
    impact: '线性',
    description: 'KV Cache显存与上下文长度严格成正比。长上下文是显存消耗的大头，256K上下文可能消耗数百GB。',
    formula: 'KV Cache ∝ context_length × num_layers × num_kv_heads × head_dim',
    examples: [
      'Llama-70B, 4K context: KV Cache ~1.3GB',
      'Llama-70B, 32K context: KV Cache ~10.7GB',
      'Llama-70B, 128K context: KV Cache ~42.8GB',
    ],
  },
  {
    factor: '并发数量 (Batch Size)',
    impact: '线性',
    description: 'KV Cache与并发用户数严格成正比。10并发 = 10倍KV Cache。是服务容量规划的核心变量。',
    formula: 'KV Cache ∝ batch_size (每个请求独立缓存)',
    examples: [
      '1并发, 32K ctx: KV Cache ~10GB',
      '10并发, 32K ctx: KV Cache ~100GB',
      '100并发, 32K ctx: KV Cache ~1TB',
    ],
  },
  {
    factor: '推理引擎 (Engine)',
    impact: '常数',
    description: '引擎本身占用固定比例的额外显存(5-15%)。PagedAttention类引擎(vLLM)利用率最高(95%+)。',
    formula: 'Overhead = (权重 + KV Cache) × overheadFactor (5%-15%)',
    examples: [
      'vLLM: 5% overhead, 95%利用率',
      'TensorRT-LLM: 8% overhead, 92%利用率',
      'HuggingFace: 15% overhead, 75%利用率',
    ],
  },
  {
    factor: '模型架构 (Architecture)',
    impact: '常数',
    description: 'GQA/MQA架构显著降低KV Cache。Qwen3.5采用GQA(KV头数= Query头数/ N)，KV Cache减少N倍。',
    formula: 'KV Cache ∝ num_kv_heads (GQA: num_kv_heads << num_heads)',
    examples: [
      '传统MHA: 64 KV heads → KV Cache 100%',
      'GQA(8 KV heads): KV Cache 降低8x → 12.5%',
      'MQA(1 KV head): KV Cache 降低64x → 1.56%',
    ],
  },
];

// ==========================================
// Production Optimization Techniques
// ==========================================

export interface ProductionOptimization {
  id: string;
  name: string;
  description: string;
  impact: string;
  savingsRange: string;
  engines: string[];
}

export const productionOptimizations: ProductionOptimization[] = [
  {
    id: 'kv-cache-quant',
    name: 'KV Cache 量化',
    description: '将 KV Cache 从 FP16 压缩到 FP8 或 INT8。与权重量化独立，可叠加使用。vLLM/TensorRT-LLM 原生支持。',
    impact: 'KV Cache 显存减半',
    savingsRange: '~50% KV Cache',
    engines: ['vLLM', 'TensorRT-LLM', 'SGLang'],
  },
  {
    id: 'prefix-caching',
    name: 'Prefix Caching (RadixAttention)',
    description: '多个请求共享相同前缀（系统提示、RAG文档）时，前缀部分的 KV 只存一份，后续请求复用。SGLang RadixAttention 和 vLLM Prefix Caching 已实现。',
    impact: '共享前缀只存一次',
    savingsRange: '10%-70% KV Cache (取决于前缀长度和命中率)',
    engines: ['SGLang', 'vLLM'],
  },
  {
    id: 'paged-attention',
    name: 'PagedAttention',
    description: '将 KV Cache 分页存储到非连续内存块，按需分配。消除预分配浪费和内存碎片，显存利用率从 ~70% 提升到 95%+。',
    impact: '消除内存碎片和预分配浪费',
    savingsRange: '20%-40% 整体显存利用率提升',
    engines: ['vLLM', 'TensorRT-LLM', 'SGLang'],
  },
  {
    id: 'continuous-batching',
    name: 'Continuous Batching',
    description: '新请求随时加入 batch，完成的请求随时退出（不互相等待）。对比 Static Batching，吞吐量提升 10-20 倍，但显存模型不变。',
    impact: '吞吐量提升，显存模型不变',
    savingsRange: '10-20x 吞吐量提升',
    engines: ['vLLM', 'TensorRT-LLM', 'SGLang'],
  },
  {
    id: 'speculative-decoding',
    name: '投机解码 (Speculative Decoding)',
    description: '用小模型（draft model）快速生成候选 token，大模型并行验证。速度提升 1.5-2.5 倍，需额外加载 draft model 显存。',
    impact: '推理延迟降低',
    savingsRange: '1.5-2.5x 速度提升，额外 ~5-20GB draft model',
    engines: ['vLLM', 'TensorRT-LLM'],
  },
  {
    id: 'offloading',
    name: 'KV Cache Offloading',
    description: '将不活跃的 KV Cache 从 GPU HBM 卸载到 CPU DRAM 或 SSD。Mooncake、vLLM v1 架构支持。适合超长上下文+高并发场景。',
    impact: '突破单卡显存上限',
    savingsRange: '可将 KV Cache 扩展到 TB 级',
    engines: ['Mooncake', 'vLLM (v1)', 'TensorRT-LLM'],
  },
];

import { useState, useMemo } from 'react';
import './App.css';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import {
  qwen35Models,
  quantMethods,
  inferenceEngines,
  contextPresets,
  calculateVRAM,
  getGPURecommendations,
  factorImpacts,
  productionOptimizations,
} from './data/modelData';
import {
  MemoryStick,
  Zap,
  Layers,
  Calculator,
  BarChart3,
  Monitor,
  Server,
  HardDrive,
  Microchip,
  Box,
  Maximize,
  Users,
  BrainCircuit,
  Sun,
  Moon,
  ChevronDown,
  BookOpen,
  Lightbulb,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip as ShadTooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

/* =====================================
   Custom Tooltip
   ===================================== */
function ChartTooltip({ active, payload, isDark }: { active?: boolean; payload?: Array<{ value: number; name: string }>; isDark: boolean }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-3 py-2 text-sm shadow-lg border"
        style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          color: isDark ? '#f1f5f9' : '#0f172a',
        }}
      >
        <div className="font-semibold mb-0.5">{payload[0].name}</div>
        <div className="font-mono text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          {payload[0].value.toFixed(2)} GB
        </div>
      </div>
    );
  }
  return null;
}

/* =====================================
   Preset Button Component
   ===================================== */
function PresetBtn({ label, active, onClick, isDark }: { label: string; active: boolean; onClick: () => void; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className="px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all duration-150"
      style={{
        backgroundColor: active
          ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.1)')
          : (isDark ? 'transparent' : 'transparent'),
        borderColor: active
          ? (isDark ? 'rgba(59,130,246,0.4)' : 'rgba(37,99,235,0.35)')
          : (isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.6)'),
        color: active
          ? (isDark ? '#60a5fa' : '#2563eb')
          : (isDark ? '#475569' : '#94a3b8'),
      }}
    >
      {label}
    </button>
  );
}

/* =====================================
   Accordion Card Component
   ===================================== */
function AccordionCard({
  title,
  icon,
  defaultOpen,
  isDark,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  isDark: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div
      className="rounded-xl border overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)',
        borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{icon}</span>
          <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
            {title}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isDark ? '#475569' : '#94a3b8',
          }}
        />
      </button>
      {open && (
        <div
          className="px-4 pb-3"
          style={{ borderTop: `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(203,213,225,0.4)'}` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* =====================================
   Main App Content
   ===================================== */
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedModelId, setSelectedModelId] = useState(qwen35Models[4].id);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedQuantId, setSelectedQuantId] = useState('int4-awq');
  const [selectedEngineId, setSelectedEngineId] = useState(inferenceEngines[0].id);
  const [contextLength, setContextLength] = useState(32768);
  const [concurrency, setConcurrency] = useState(1);
  const [kvCacheQuantId, setKvCacheQuantId] = useState('fp16');
  const [prefixCacheHitRate, setPrefixCacheHitRate] = useState(0);

  const model = qwen35Models.find(m => m.id === selectedModelId) || qwen35Models[0];
  const quant = quantMethods.find(q => q.id === selectedQuantId) || quantMethods[0];
  const engine = inferenceEngines.find(e => e.id === selectedEngineId) || inferenceEngines[0];
  const kvCacheQuant = quantMethods.find(q => q.id === kvCacheQuantId);

  const vram = useMemo(
    () => calculateVRAM({ model, quantMethod: quant, engine, contextLength, concurrency, kvCacheQuant, prefixCacheHitRate: prefixCacheHitRate / 100 }),
    [model, quant, engine, contextLength, concurrency, kvCacheQuant, prefixCacheHitRate]
  );

  const gpuRecs = useMemo(() => getGPURecommendations(vram.total), [vram.total]);

  const barColors = [
    isDark ? '#60a5fa' : '#2563eb',
    isDark ? '#fbbf24' : '#d97706',
    isDark ? '#34d399' : '#059669',
    isDark ? '#a78bfa' : '#7c3aed',
  ];
  const barChartData = [
    { name: '模型权重', value: vram.modelWeights, color: barColors[0], pct: ((vram.modelWeights / vram.total) * 100).toFixed(1) },
    { name: 'KV Cache', value: vram.kvCache, color: barColors[1], pct: ((vram.kvCache / vram.total) * 100).toFixed(1) },
    { name: '激活值', value: vram.activations, color: barColors[2], pct: ((vram.activations / vram.total) * 100).toFixed(1) },
    { name: '引擎开销', value: vram.engineOverhead, color: barColors[3], pct: ((vram.engineOverhead / vram.total) * 100).toFixed(1) },
  ];
  const pieChartData = [
    { name: '模型权重', value: vram.modelWeights },
    { name: 'KV Cache', value: vram.kvCache },
    { name: '激活值', value: vram.activations },
    { name: '引擎开销', value: vram.engineOverhead },
  ];

  const bgGradient = isDark
    ? 'linear-gradient(135deg, #0b0f19 0%, #0f1525 50%, #0b0f19 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e8edf5 100%)';

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col transition-colors duration-300"
      style={{ background: bgGradient, color: isDark ? '#f1f5f9' : '#0f172a' }}
    >
      {/* ============ HEADER ============ */}
      <header
        className="shrink-0 flex items-center justify-between px-6 py-2.5 border-b backdrop-blur-xl transition-colors duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(11,15,25,0.9)' : 'rgba(248,250,252,0.95)',
          borderColor: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(203,213,225,0.6)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
          >
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-tight" style={{ color: isDark ? '#fff' : '#0f172a' }}>
              LLM VRAM Calculator
            </h1>
            <p className="text-[10px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
              Qwen3.5 全系列显存占用计算器
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
              color: isDark ? '#f1f5f9' : '#475569',
            }}
          >
            {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            {isDark ? '暗' : '亮'}
          </button>
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main className="flex-1 min-h-0 px-4 py-3 grid grid-cols-12 gap-3 overflow-hidden">
        {/* ====== LEFT COLUMN: Controls ====== */}
        <div className="col-span-3 flex flex-col gap-2.5 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          {/* Model */}
          <div
            className="rounded-xl border p-3 transition-colors duration-300"
            style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Box className="w-4 h-4" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
              <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>选择模型</span>
            </div>
            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex h-8 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                  style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#cbd5e1', color: isDark ? '#f1f5f9' : '#0f172a' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{model.name}</span>
                    <Badge className="text-[10px] px-1 py-0" style={{ backgroundColor: model.architecture === 'MoE' ? (isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)') : (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'), color: model.architecture === 'MoE' ? (isDark ? '#fbbf24' : '#b45309') : (isDark ? '#60a5fa' : '#2563eb') }}>
                      {model.architecture === 'MoE' ? `${model.totalParams}B/${model.activeParams}B` : `${model.totalParams}B`}
                    </Badge>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start" sideOffset={4} style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#cbd5e1' }}>
                <div className="flex flex-col gap-0.5 p-1">
                  {qwen35Models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModelId(m.id); setModelOpen(false); }}
                      className="flex items-center justify-between w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
                      style={{
                        backgroundColor: selectedModelId === m.id
                          ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.1)')
                          : 'transparent',
                        color: isDark ? '#f1f5f9' : '#0f172a',
                      }}
                    >
                      <div className="flex items-center gap-2 py-0.5">
                        <span className="font-semibold text-sm">{m.name}</span>
                        <Badge className="text-[10px] px-1 py-0" style={{ backgroundColor: m.architecture === 'MoE' ? (isDark ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.15)') : (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)'), color: m.architecture === 'MoE' ? (isDark ? '#fbbf24' : '#b45309') : (isDark ? '#60a5fa' : '#2563eb'), border: `1px solid ${m.architecture === 'MoE' ? (isDark ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.25)') : (isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.25)')}` }}>
                          {m.architecture}
                        </Badge>
                        <Badge className="text-[10px] px-1 py-0" style={{ backgroundColor: m.architecture === 'MoE' ? (isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)') : (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'), color: m.architecture === 'MoE' ? (isDark ? '#fbbf24' : '#b45309') : (isDark ? '#60a5fa' : '#2563eb') }}>
                          {m.architecture === 'MoE' ? `${m.totalParams}B/${m.activeParams}B` : `${m.totalParams}B`}
                        </Badge>
                      </div>
                      {selectedModelId === m.id && (
                        <Check className="w-4 h-4 shrink-0" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {[
                { label: '层数', value: model.layers },
                { label: 'Hidden', value: model.hiddenSize },
                { label: 'KV Heads', value: model.numKVHeads },
                { label: 'Head Dim', value: model.headDim },
              ].map(item => (
                <div key={item.label} className="rounded-lg px-2 py-1" style={{ backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)' }}>
                  <div className="text-[10px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{item.label}</div>
                  <div className="font-mono text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quant */}
          <div
            className="rounded-xl border p-3 transition-colors duration-300"
            style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="w-4 h-4" style={{ color: isDark ? '#fbbf24' : '#d97706' }} />
              <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>量化方法</span>
            </div>
            <Select value={selectedQuantId} onValueChange={setSelectedQuantId}>
              <SelectTrigger className="h-8 text-sm font-medium border" style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#cbd5e1', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#cbd5e1' }}>
                {quantMethods.map(q => (
                  <SelectItem key={q.id} value={q.id} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    <span className="font-semibold text-sm">{q.name}</span>
                    <span className="ml-2 text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{q.bits}bit</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div className="text-center rounded-lg py-1" style={{ backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)' }}>
                <div className="text-[10px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>精度</div>
                <div className="font-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{quant.qualityRetention}</div>
              </div>
              <div className="text-center rounded-lg py-1" style={{ backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)' }}>
                <div className="text-[10px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>速度</div>
                <div className="font-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{quant.speedup}</div>
              </div>
              <div className="text-center rounded-lg py-1" style={{ backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)' }}>
                <div className="text-[10px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>节省</div>
                <div className="font-bold" style={{ color: isDark ? '#34d399' : '#059669' }}>{quant.vramReduction}</div>
              </div>
            </div>
          </div>

          {/* Engine */}
          <div
            className="rounded-xl border p-3 transition-colors duration-300"
            style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-4 h-4" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
              <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>推理引擎</span>
            </div>
            <Select value={selectedEngineId} onValueChange={setSelectedEngineId}>
              <SelectTrigger className="h-8 text-sm font-medium border" style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#cbd5e1', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#cbd5e1' }}>
                {inferenceEngines.map(e => (
                  <SelectItem key={e.id} value={e.id} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    <span className="font-semibold text-sm">{e.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                利用率 <strong style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{(engine.kvCacheEfficiency * 100).toFixed(0)}%</strong>
              </span>
              <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                Overhead <strong style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{(engine.overheadFactor * 100).toFixed(0)}%</strong>
              </span>
            </div>
          </div>

          {/* Context + Concurrency */}
          <div
            className="rounded-xl border p-3 transition-colors duration-300 flex-1"
            style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Maximize className="w-4 h-4" style={{ color: isDark ? '#06b6d4' : '#0891b2' }} />
              <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>上下文</span>
              <span className="ml-auto font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.1)', color: isDark ? '#60a5fa' : '#2563eb' }}>
                {(contextLength / 1024).toFixed(0)}K
              </span>
            </div>
            <Slider value={[contextLength]} onValueChange={v => setContextLength(v[0])} min={4096} max={262144} step={4096} />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {contextPresets.map(p => (
                <PresetBtn key={p.value} label={p.label} active={contextLength === p.value} onClick={() => setContextLength(p.value)} isDark={isDark} />
              ))}
            </div>

            <div className="flex items-center gap-1.5 mt-3 mb-2">
              <Users className="w-4 h-4" style={{ color: isDark ? '#fbbf24' : '#d97706' }} />
              <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>并发</span>
              <span className="ml-auto font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(217,119,6,0.1)', color: isDark ? '#fbbf24' : '#d97706' }}>
                {concurrency}
              </span>
            </div>
            <Slider value={[concurrency]} onValueChange={v => setConcurrency(v[0])} min={1} max={200} step={1} />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[1, 4, 8, 16, 32, 64, 100, 200].map(v => (
                <PresetBtn key={v} label={String(v)} active={concurrency === v} onClick={() => setConcurrency(v)} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>

        {/* ====== CENTER COLUMN: Main Display ====== */}
        <div className="col-span-6 flex flex-col gap-2.5 min-h-0">
          {/* Total VRAM */}
          <div
            className="rounded-xl border p-4 transition-colors duration-300 relative overflow-hidden"
            style={{
              background: isDark ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))' : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))',
              borderColor: isDark ? 'rgba(71,85,105,0.5)' : 'rgba(203,213,225,0.9)',
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.03)' }} />
            <div className="flex items-center justify-between mb-2 relative">
              <div className="flex items-center gap-2">
                <MemoryStick className="w-5 h-5" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#475569' }}>预估显存占用</span>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-bold px-2 py-0.5"
                style={{
                  borderColor: model.architecture === 'MoE' ? (isDark ? 'rgba(245,158,11,0.4)' : 'rgba(245,158,11,0.3)') : (isDark ? 'rgba(59,130,246,0.4)' : 'rgba(37,99,235,0.3)'),
                  color: model.architecture === 'MoE' ? (isDark ? '#fbbf24' : '#b45309') : (isDark ? '#60a5fa' : '#2563eb'),
                  backgroundColor: model.architecture === 'MoE' ? (isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.06)') : (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(37,99,235,0.06)'),
                }}
              >
                {model.architecture === 'MoE' ? 'MoE' : 'Dense'} · {model.totalParams}B
              </Badge>
            </div>
            <div className="flex items-baseline gap-2 mb-3 relative">
              <span className="text-5xl font-extrabold tracking-tight value-animate" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {Math.ceil(vram.total)}
              </span>
              <span className="text-lg font-semibold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>GB</span>
              <span className="text-xs ml-1" style={{ color: isDark ? '#475569' : '#94a3b8' }}>({vram.total.toFixed(2)} GB)</span>
            </div>
            <div className="grid grid-cols-4 gap-2 relative">
              {barChartData.map(item => (
                <div
                  key={item.name}
                  className="rounded-lg px-2.5 py-2 border transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    backgroundColor: isDark ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)',
                    borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.6)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-semibold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{item.name}</span>
                  </div>
                  <div className="text-base font-extrabold font-mono" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    {item.value.toFixed(1)} <span className="text-[10px] font-bold">GB</span>
                  </div>
                  <div className="text-[10px] font-bold" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{item.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
            {/* Bar Chart */}
            <div
              className="rounded-xl border p-3 transition-colors duration-300 flex flex-col"
              style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5" style={{ color: isDark ? '#34d399' : '#059669' }} />
                <span className="text-xs font-bold" style={{ color: isDark ? '#e2e8f0' : '#475569' }}>显存构成 (GB)</span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical" barSize={22} margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} horizontal={false} />
                    <XAxis type="number" stroke={isDark ? '#475569' : '#94a3b8'} fontSize={10} tickFormatter={v => `${v}`} />
                    <YAxis type="category" dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} width={58} />
                    <Tooltip content={<ChartTooltip isDark={isDark} />} />
                    <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                      {barChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div
              className="rounded-xl border p-3 transition-colors duration-300 flex flex-col"
              style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Monitor className="w-3.5 h-3.5" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
                <span className="text-xs font-bold" style={{ color: isDark ? '#e2e8f0' : '#475569' }}>占比分布</span>
              </div>
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={2} stroke={isDark ? '#0f172a' : '#ffffff'}>
                      {pieChartData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip isDark={isDark} />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-lg font-extrabold font-mono" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>{Math.ceil(vram.total)}</div>
                    <div className="text-[9px] font-bold" style={{ color: isDark ? '#475569' : '#94a3b8' }}>GB</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-1">
                {barChartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: barColors[i] }} />
                    <span className="text-[10px] font-semibold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{item.name} {item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GPU Recommendations */}
          <div
            className="rounded-xl border p-3 transition-colors duration-300"
            style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Microchip className="w-4 h-4" style={{ color: isDark ? '#f87171' : '#dc2626' }} />
              <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#475569' }}>GPU 配置建议</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {gpuRecs.map((gpu, i) => (
                <div
                  key={gpu.name}
                  className="rounded-lg px-2.5 py-2 border transition-all duration-200"
                  style={{
                    backgroundColor: i === 0
                      ? (isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.04)')
                      : (isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)'),
                    borderColor: i === 0
                      ? (isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.25)')
                      : (isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.6)'),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>{gpu.name}</span>
                    {i === 0 && <span className="text-[9px] font-bold px-1 py-0 rounded" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.12)', color: isDark ? '#60a5fa' : '#2563eb' }}>推荐</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-medium" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    <span><HardDrive className="w-2.5 h-2.5 inline mr-0.5" />{gpu.vram}GB</span>
                    <span><Server className="w-2.5 h-2.5 inline mr-0.5" />{gpu.count > 1 ? `${gpu.count}卡` : '单卡'}</span>
                  </div>
                  <div className="text-[10px] mt-0.5 font-semibold" style={{ color: isDark ? '#475569' : '#94a3b8' }}>
                    总{gpu.vram * gpu.count}GB
                    {gpu.vram * gpu.count >= vram.total
                      ? <span className="ml-1 font-bold" style={{ color: isDark ? '#34d399' : '#059669' }}>满足</span>
                      : <span className="ml-1 font-bold" style={{ color: isDark ? '#f87171' : '#dc2626' }}>不足</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====== RIGHT COLUMN: Stacked Info Cards ====== */}
        <div className="col-span-3 flex flex-col gap-1.5 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          {/* Formula Accordion -->
          <AccordionCard title="计算公式" icon={<BookOpen className="w-4 h-4" />} defaultOpen isDark={isDark}>
            <div className="space-y-2 mt-2">
              <FormulaBlock
                title="模型权重"
                formula={
                  <>
                    <FormulaTooltip tip="模型总参数量（Billion）">{model.totalParams}B</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="量化精度，每参数字节数">{quant.bytesPerParam}byte</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="Billion 转实际数值">10⁹</FormulaTooltip>
                    {' / '}
                    <FormulaTooltip tip="字节转 GB">1024³</FormulaTooltip>
                  </>
                }
                result={`${vram.modelWeights.toFixed(2)} GB`}
                color="#3b82f6"
                isDark={isDark}
              />
              <FormulaBlock
                title="KV Cache"
                formula={
                  <>
                    <FormulaTooltip tip="Key 和 Value 两个张量">2</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="Transformer 层数">{model.layers}</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="KV 注意力头数">{model.numKVHeads}</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="每个注意力头的维度">{model.headDim}</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="上下文长度（token 数）">{(contextLength / 1024).toFixed(0)}K</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="并发请求数">{concurrency}</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="KV Cache 量化精度（每参数字节数）">{quant.bits <= 4 ? 2 : quant.bytesPerParam}byte</FormulaTooltip>
                    {' / '}
                    <FormulaTooltip tip="字节转 GB">1024³</FormulaTooltip>
                  </>
                }
                result={`${vram.kvCache.toFixed(2)} GB`}
                color="#f59e0b"
                isDark={isDark}
              />
              <FormulaBlock
                title="激活值"
                formula={
                  <>
                    <FormulaTooltip tip="并发请求数">{concurrency}</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="上下文长度（token 数）">{(contextLength / 1024).toFixed(0)}K</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="隐藏层维度">{model.hiddenSize}</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="经验系数，表示中间状态数">18</FormulaTooltip>
                    {' × '}
                    <FormulaTooltip tip="激活值数据类型字节数">{quant.bytesPerParam}byte</FormulaTooltip>
                    {' / '}
                    <FormulaTooltip tip="字节转 GB">1024³</FormulaTooltip>
                  </>
                }
                result={`${vram.activations.toFixed(2)} GB`}
                color="#10b981"
                isDark={isDark}
              />
              <FormulaBlock
                title="引擎开销"
                formula={
                  <>
                    {'('}
                    <FormulaTooltip tip="模型权重显存">{vram.modelWeights.toFixed(1)}</FormulaTooltip>
                    {' + '}
                    <FormulaTooltip tip="KV Cache 显存">{vram.kvCache.toFixed(1)}</FormulaTooltip>
                    {' + '}
                    <FormulaTooltip tip="激活值显存">{vram.activations.toFixed(1)}</FormulaTooltip>
                    {') × '}
                    <FormulaTooltip tip="推理引擎额外开销比例">{(engine.overheadFactor * 100).toFixed(0)}%</FormulaTooltip>
                  </>
                }
                result={`${vram.engineOverhead.toFixed(2)} GB`}
                color="#8b5cf6"
                isDark={isDark}
              />
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2 mt-1"
                style={{
                  backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(37,99,235,0.06)',
                  border: `1px solid ${isDark ? 'rgba(59,130,246,0.25)' : 'rgba(37,99,235,0.2)'}`,
                }}
              >
                <span className="text-xs font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>总计</span>
                <span className="text-base font-extrabold font-mono" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>
                  {vram.total.toFixed(2)} GB
                </span>
              </div>
            </div>
          </AccordionCard>

          {/* Factors Accordion */}
          <AccordionCard title="影响因素" icon={<Calculator className="w-4 h-4" />} isDark={isDark}>
            <div className="space-y-2 mt-2 max-h-64 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {factorImpacts.map(factor => (
                <div
                  key={factor.factor}
                  className="rounded-lg p-2 border transition-all duration-200"
                  style={{
                    backgroundColor: isDark ? 'rgba(30,41,59,0.4)' : 'rgba(248,250,252,0.8)',
                    borderColor: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(203,213,225,0.5)',
                  }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-bold" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{factor.factor}</span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: factor.impact === '线性'
                          ? (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.1)')
                          : (isDark ? 'rgba(100,116,139,0.15)' : 'rgba(148,163,184,0.15)'),
                        color: factor.impact === '线性'
                          ? (isDark ? '#60a5fa' : '#2563eb')
                          : (isDark ? '#94a3b8' : '#64748b'),
                      }}
                    >
                      {factor.impact}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: isDark ? '#64748b' : '#64748b' }}>{factor.description}</p>
                  <div
                    className="rounded px-2 py-1 mt-1 font-mono text-[10px]"
                    style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.6)', color: isDark ? '#94a3b8' : '#475569' }}
                  >
                    {factor.formula}
                  </div>
                </div>
              ))}
            </div>
          </AccordionCard>

          {/* MoE Insight */}
          <AccordionCard title="架构差异" icon={<Lightbulb className="w-4 h-4" />} isDark={isDark}>
            <div className="mt-2 space-y-2 text-[11px] leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
              <p>
                <strong style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>MoE:</strong>
                加载<span style={{ color: isDark ? '#fbbf24' : '#b45309' }}>全部专家参数</span>到显存，但KV Cache按<span style={{ color: isDark ? '#34d399' : '#059669' }}>激活参数</span>计算。
              </p>
              <p>例: 397B-A17B 权重按 397B, KV Cache 按 17B</p>
              <p>
                <strong style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>Dense:</strong>
                所有参数参与计算，权重和KV Cache使用相同参数量。
              </p>
            </div>
          </AccordionCard>

          {/* Key Insight */}
          <AccordionCard title="💡 关键洞察" icon={<Lightbulb className="w-4 h-4" />} defaultOpen isDark={isDark}>
            <div className="mt-2 space-y-1.5 text-[11px] leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
              <p>
                KV Cache 通常是显存消耗的最大部分。高并发+长上下文场景下，KV Cache 可能超过模型权重数十倍。
              </p>
              <p>
                <span style={{ color: isDark ? '#34d399' : '#059669' }}>每个请求的 KV Cache 是独享的</span>（per-request），batch 推理只是让多个请求共享 GPU 计算单元，显存上不合并。
              </p>
              <p>
                <span style={{ color: isDark ? '#34d399' : '#059669' }}>优化:</span> GQA/MQA 架构、KV Cache 量化、PagedAttention、前缀缓存、Offloading。
              </p>
            </div>
          </AccordionCard>

          {/* Production Optimizations */}
          <AccordionCard title="🚀 生产级显存优化" icon={<Zap className="w-4 h-4" />} isDark={isDark}>
            <div className="mt-2 space-y-3 text-[11px] leading-relaxed max-h-[420px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', color: isDark ? '#94a3b8' : '#475569' }}>
              {/* KV Cache Quant */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>KV Cache 量化</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.1)', color: isDark ? '#60a5fa' : '#2563eb' }}>
                    独立于此前的权重量化
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {(['fp16', 'fp8', 'int8'] as const).map((id) => {
                    const q = quantMethods.find(qm => qm.id === id);
                    if (!q) return null;
                    const active = kvCacheQuantId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setKvCacheQuantId(id)}
                        className="flex-1 px-2 py-1 rounded text-[11px] font-medium border transition-all"
                        style={{
                          backgroundColor: active ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.1)') : 'transparent',
                          borderColor: active ? (isDark ? 'rgba(59,130,246,0.4)' : 'rgba(37,99,235,0.35)') : (isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.6)'),
                          color: active ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#94a3b8' : '#64748b'),
                        }}
                      >
                        {q.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1 text-[10px]" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                  默认 FP16 (2B/token)。FP8/INT8 可减半 KV Cache，精度损失 &lt;2%。
                </p>
              </div>

              {/* Prefix Caching */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>前缀缓存命中率</span>
                  <span className="font-mono font-bold" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{prefixCacheHitRate}%</span>
                </div>
                <Slider
                  value={[prefixCacheHitRate]}
                  onValueChange={(v) => setPrefixCacheHitRate(v[0])}
                  min={0}
                  max={90}
                  step={10}
                  className="w-full"
                />
                <p className="mt-1 text-[10px]" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                  多个请求共享系统提示/RAG文档时，前缀 KV 只存一次。SGLang RadixAttention / vLLM Prefix Caching 实现。
                </p>
              </div>

              {/* Savings comparison */}
              {vram.originalKVCache && vram.originalKVCache > vram.kvCache && (
                <div
                  className="rounded-lg p-2 border"
                  style={{
                    backgroundColor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(37,99,235,0.05)',
                    borderColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.15)',
                  }}
                >
                  <div className="text-[11px] font-semibold mb-1.5" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>
                    优化效果对比
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>原始 KV Cache</span>
                      <span className="font-mono">{vram.originalKVCache.toFixed(2)} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>优化后 KV Cache</span>
                      <span className="font-mono" style={{ color: isDark ? '#34d399' : '#059669' }}>{vram.kvCache.toFixed(2)} GB</span>
                    </div>
                    <div className="flex justify-between font-semibold" style={{ color: isDark ? '#fbbf24' : '#b45309' }}>
                      <span>节省显存</span>
                      <span className="font-mono">{(vram.originalKVCache - vram.kvCache).toFixed(2)} GB ({((1 - vram.kvCache / vram.originalKVCache) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-1 border-t" style={{ borderColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.15)' }}>
                      <span>总显存需求</span>
                      <span className="font-mono">{vram.total.toFixed(2)} GB</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization techniques list — compact table */}
              <div>
                <div className="font-semibold text-[11px] mb-1.5" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>
                  大厂常用优化手段
                </div>
                <div className="rounded-md overflow-hidden border" style={{ borderColor: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(203,213,225,0.5)' }}>
                  {productionOptimizations.map((opt, idx) => (
                    <div
                      key={opt.id}
                      className="px-2.5 py-1.5 text-[10px] leading-relaxed"
                      style={{
                        backgroundColor: idx % 2 === 0
                          ? (isDark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,0.6)')
                          : (isDark ? 'rgba(15,23,42,0.15)' : 'rgba(255,255,255,0.3)'),
                        borderBottom: idx < productionOptimizations.length - 1 ? `1px solid ${isDark ? 'rgba(51,65,85,0.2)' : 'rgba(203,213,225,0.3)'}` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{opt.name}</span>
                        <span className="text-[10px] px-1 py-0 rounded shrink-0" style={{ backgroundColor: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(5,150,105,0.08)', color: isDark ? '#34d399' : '#059669' }}>
                          {opt.savingsRange}
                        </span>
                      </div>
                      <p className="mt-0.5" style={{ color: isDark ? '#64748b' : '#64748b' }}>{opt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionCard>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="shrink-0 border-t px-6 py-1.5 text-center text-[10px] font-medium transition-colors duration-300"
        style={{ borderColor: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(203,213,225,0.4)', color: isDark ? '#475569' : '#94a3b8' }}
      >
        基于 Qwen3.5 官方技术规格及行业标准显存计算公式构建 · 结果仅供参考
      </footer>
    </div>
  );
}

/* =====================================
   Formula Block Component
   ===================================== */
function FormulaTooltip({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <ShadTooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help underline decoration-dotted underline-offset-2" style={{ textDecorationColor: 'rgba(148,163,184,0.5)' }}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-center text-xs">
        <p>{tip}</p>
      </TooltipContent>
    </ShadTooltip>
  );
}

function FormulaBlock({
  title,
  formula,
  result,
  color,
  isDark,
}: {
  title: string;
  formula: React.ReactNode;
  result: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      className="rounded-lg p-2 border-l-[3px]"
      style={{
        backgroundColor: isDark ? 'rgba(30,41,59,0.3)' : 'rgba(241,245,249,0.7)',
        borderLeftColor: color,
      }}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] font-bold" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{title}</span>
        <span className="font-mono text-xs font-bold" style={{ color }}>{result}</span>
      </div>
      <div
        className="font-mono text-[10px] rounded px-1.5 py-1 break-all leading-relaxed"
        style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.6)', color: isDark ? '#94a3b8' : '#475569' }}
      >
        {formula}
      </div>
    </div>
  );
}

/* =====================================
   Root Export
   ===================================== */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

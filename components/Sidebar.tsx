import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Wand2, Layers, Sun, Palette, Maximize, Sparkles } from 'lucide-react';
import { STYLE_PRESETS, LIGHTING_PRESETS, RenderOptions, RenderHistoryItem } from '../src/types';
import { History } from './History';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  onRender: (options: RenderOptions, image: string) => void;
  isRendering: boolean;
  history: RenderHistoryItem[];
  onSelectHistory: (item: RenderHistoryItem) => void;
  onClearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onRender, 
  isRendering, 
  history, 
  onSelectHistory, 
  onClearHistory 
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<RenderOptions>({
    prompt: "",
    style: "modern",
    lighting: "golden_hour",
    materials: "Madeira, Concreto, Vidro",
    aspectRatio: "16:9",
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleRender = () => {
    if (image) {
      onRender(options, image);
    }
  };

  return (
    <aside className="w-80 h-full border-r border-zinc-200 bg-white flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-8">
        {/* Upload Section */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
            <Upload className="w-4 h-4" />
            <span>Upload do Projeto</span>
          </div>
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2",
              isDragActive ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50",
              image ? "p-2" : "p-6"
            )}
          >
            <input {...getInputProps()} />
            {image ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-medium">Trocar Imagem</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Clique ou arraste</p>
                  <p className="text-[10px] text-zinc-500">Esboço, planta ou foto (PNG, JPG)</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Prompt Section */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
            <Wand2 className="w-4 h-4" />
            <span>Descrição do Render</span>
          </div>
          <textarea 
            value={options.prompt}
            onChange={(e) => setOptions({ ...options, prompt: e.target.value })}
            placeholder="Ex: Uma casa moderna com grandes janelas de vidro, cercada por pinheiros..."
            className="w-full h-24 p-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
          />
        </section>

        {/* Style Presets */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
            <Palette className="w-4 h-4" />
            <span>Estilo Arquitetônico</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                onClick={() => setOptions({ ...options, style: style.id })}
                className={cn(
                  "p-2 text-[10px] font-medium rounded-lg border transition-all text-center",
                  options.style === style.id 
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-md" 
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                )}
              >
                {style.name}
              </button>
            ))}
          </div>
        </section>

        {/* Lighting Presets */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
            <Sun className="w-4 h-4" />
            <span>Iluminação</span>
          </div>
          <select 
            value={options.lighting}
            onChange={(e) => setOptions({ ...options, lighting: e.target.value })}
            className="w-full p-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {LIGHTING_PRESETS.map((light) => (
              <option key={light.id} value={light.id}>{light.name}</option>
            ))}
          </select>
        </section>

        {/* Materials */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>Materiais</span>
          </div>
          <input 
            type="text"
            value={options.materials}
            onChange={(e) => setOptions({ ...options, materials: e.target.value })}
            placeholder="Ex: Madeira, Vidro, Aço"
            className="w-full p-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </section>

        {/* Aspect Ratio */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
            <Maximize className="w-4 h-4" />
            <span>Formato</span>
          </div>
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setOptions({ ...options, aspectRatio: ratio as any })}
                className={cn(
                  "flex-1 py-1 text-[10px] font-bold rounded-lg transition-all",
                  options.aspectRatio === ratio ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400"
                )}
              >
                {ratio}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 mt-auto border-t border-zinc-100 bg-zinc-50/50">
        <button 
          onClick={handleRender}
          disabled={!image || isRendering}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg",
            !image || isRendering 
              ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
          )}
        >
          {isRendering ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Renderizando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Gerar Render</span>
            </>
          )}
        </button>
      </div>

      <History 
        items={history} 
        onSelect={(item) => {
          setImage(item.originalImage);
          setOptions(item.options);
          onSelectHistory(item);
        }} 
        onClear={onClearHistory} 
      />
    </aside>
  );
};

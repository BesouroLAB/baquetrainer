import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Wand2, Loader2, Download, RefreshCw, Layers, Sun, Palette } from 'lucide-react';
import { renderImage, RenderOptions } from '../services/gemini';
import confetti from 'canvas-confetti';

const RenderTool = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<RenderOptions>({
    prompt: '',
    style: 'Moderno Contemporâneo',
    lighting: 'Luz do Dia (Golden Hour)',
    materials: 'Concreto, Madeira e Vidro',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setRenderedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRender = async () => {
    if (!sourceImage) return;

    setIsRendering(true);
    setError(null);

    try {
      const result = await renderImage(sourceImage, options);
      setRenderedImage(result);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399']
      });
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar sua imagem.");
    } finally {
      setIsRendering(false);
    }
  };

  const downloadImage = () => {
    if (!renderedImage) return;
    const link = document.createElement('a');
    link.href = renderedImage;
    link.download = `arquirender-${Date.now()}.png`;
    link.click();
  };

  return (
    <section id="render" className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Sua Estação de Trabalho</h2>
            <p className="text-stone-600">Configure os detalhes e veja a mágica acontecer.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  Configurações
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Estilo Arquitetônico
                    </label>
                    <select
                      value={options.style}
                      onChange={(e) => setOptions({ ...options, style: e.target.value })}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option>Moderno Contemporâneo</option>
                      <option>Brutalista</option>
                      <option>Minimalista Escandinavo</option>
                      <option>Tropical Brasileiro</option>
                      <option>Industrial</option>
                      <option>Clássico Europeu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <Sun className="w-4 h-4" /> Iluminação
                    </label>
                    <select
                      value={options.lighting}
                      onChange={(e) => setOptions({ ...options, lighting: e.target.value })}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option>Luz do Dia (Golden Hour)</option>
                      <option>Nublado / Suave</option>
                      <option>Noturno com Luzes Artificiais</option>
                      <option>Crepúsculo</option>
                      <option>Interior Aconchegante</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Materiais Predominantes</label>
                    <input
                      type="text"
                      value={options.materials}
                      onChange={(e) => setOptions({ ...options, materials: e.target.value })}
                      placeholder="Ex: Madeira, Vidro, Aço..."
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Instruções Extras (Prompt)</label>
                    <textarea
                      value={options.prompt}
                      onChange={(e) => setOptions({ ...options, prompt: e.target.value })}
                      placeholder="Descreva detalhes específicos..."
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleRender}
                    disabled={!sourceImage || isRendering}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                      !sourceImage || isRendering
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                    }`}
                  >
                    {isRendering ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Renderizando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-6 h-6" />
                        Gerar Render
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-8">
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 h-full min-h-[500px] flex flex-col">
                <div className="flex-grow relative rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center border-2 border-dashed border-stone-200">
                  <AnimatePresence mode="wait">
                    {!sourceImage ? (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center p-12"
                      >
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Upload className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-2">Upload do Esboço ou Foto</h4>
                        <p className="text-stone-500 mb-8 max-w-xs mx-auto">
                          Arraste uma imagem ou clique no botão abaixo para começar.
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-3 bg-white text-stone-900 border-2 border-stone-200 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all"
                        >
                          Selecionar Arquivo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full relative group"
                      >
                        {renderedImage ? (
                          <div className="w-full h-full flex flex-col md:flex-row">
                            <div className="relative flex-1 border-r border-white/20">
                              <img src={sourceImage} alt="Original" className="w-full h-full object-cover" />
                              <span className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full">Original</span>
                            </div>
                            <div className="relative flex-1">
                              <img src={renderedImage} alt="Rendered" className="w-full h-full object-cover" />
                              <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">AI Render</span>
                              
                              <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                  onClick={downloadImage}
                                  className="p-3 bg-white text-stone-900 rounded-full shadow-lg hover:bg-emerald-50 transition-all"
                                  title="Baixar Imagem"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => setRenderedImage(null)}
                                  className="p-3 bg-white text-stone-900 rounded-full shadow-lg hover:bg-stone-50 transition-all"
                                  title="Tentar Novamente"
                                >
                                  <RefreshCw className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full relative">
                            <img src={sourceImage} alt="Preview" className="w-full h-full object-contain" />
                            <button
                              onClick={() => setSourceImage(null)}
                              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md text-stone-900 rounded-full hover:bg-white transition-all shadow-md"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RenderTool;

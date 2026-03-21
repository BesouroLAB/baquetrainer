import React from 'react';
import { motion } from 'framer-motion';
import { Box, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-emerald-600 uppercase bg-emerald-50 rounded-full border border-emerald-100">
                O Futuro da Arquitetura Brasileira
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8 text-stone-900">
                Renderização Fiel com <span className="text-emerald-600">Inteligência Artificial</span>
              </h1>
              <p className="text-xl text-stone-600 mb-10 max-w-2xl">
                Transforme seus esboços e fotos em renderizações fotorrealistas em segundos. 
                A ferramenta definitiva para arquitetos brasileiros que buscam agilidade e perfeição.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#render"
                  className="px-8 py-4 bg-stone-900 text-white rounded-xl font-bold text-lg hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
                >
                  Começar a Renderizar
                </a>
                <a
                  href="#gallery"
                  className="px-8 py-4 bg-white text-stone-900 border-2 border-stone-200 rounded-xl font-bold text-lg hover:border-stone-300 transition-all"
                >
                  Ver Exemplos
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
            >
              <img
                src="https://picsum.photos/seed/architecture-modern/800/600"
                alt="Exemplo de Render"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500 rounded-lg">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Renderização Instantânea</p>
                    <p className="text-white/80 text-sm">Processado em 4.2 segundos</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-stone-200 rounded-full blur-3xl opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

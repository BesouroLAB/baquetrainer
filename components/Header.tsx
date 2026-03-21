import React, { useState, useEffect } from 'react';
import { Box, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Box className="w-8 h-8 text-emerald-600" />
          <span className="text-2xl font-bold tracking-tighter text-stone-900">
            ArquiRender <span className="text-emerald-600">AI</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-stone-600 hover:text-stone-900 font-medium transition-all">Início</a>
          <a href="#render" className="text-stone-600 hover:text-stone-900 font-medium transition-all">Renderizar</a>
          <a href="#" className="text-stone-600 hover:text-stone-900 font-medium transition-all">Preços</a>
          <a href="#" className="text-stone-600 hover:text-stone-900 font-medium transition-all">Blog</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className="px-5 py-2 text-stone-600 font-semibold hover:text-stone-900 transition-all">
            Login
          </button>
          <button className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">
            Criar Conta
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-stone-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <a href="#" className="text-lg font-semibold text-stone-900">Início</a>
              <a href="#render" className="text-lg font-semibold text-stone-900">Renderizar</a>
              <a href="#" className="text-lg font-semibold text-stone-900">Preços</a>
              <a href="#" className="text-lg font-semibold text-stone-900">Blog</a>
              <hr className="border-stone-100" />
              <div className="flex flex-col gap-4">
                <button className="w-full py-3 text-stone-600 font-bold border-2 border-stone-100 rounded-xl">
                  Login
                </button>
                <button className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold">
                  Criar Conta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

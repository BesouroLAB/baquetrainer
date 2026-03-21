import React from 'react';
import { Box, Instagram, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Box className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-bold tracking-tighter">ArquiRender <span className="text-emerald-500">AI</span></span>
            </div>
            <p className="text-stone-400 max-w-sm mb-8">
              A plataforma líder em renderização por IA no Brasil. 
              Feito por arquitetos, para arquitetos.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-all text-stone-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-all text-stone-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-all text-stone-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Produto</h4>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#render" className="hover:text-emerald-500 transition-all">Renderizador</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-all">Preços</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-all">API</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-all">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Suporte</h4>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#" className="hover:text-emerald-500 transition-all">Documentação</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-all">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-all">Contato</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-all">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-500 text-sm">
            © 2026 ArquiRender AI. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-sm text-stone-500">
            <a href="#" className="hover:text-white transition-all">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-all">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

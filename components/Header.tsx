
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 p-4 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          <span className="text-amber-400">Baque</span>Trainer
        </h1>
        <p className="text-sm text-slate-400">Interactive Maracatu Practice Tool</p>
      </div>
    </header>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Gunakan Div sebagai pengganti Image agar tidak perlu request ke internet */}
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
        <span className="text-white font-black text-xl">M</span>
      </div>
      
      <span className="font-black text-xl tracking-tighter text-slate-900">
        MERCHIFY
      </span>
    </div>
  );
}
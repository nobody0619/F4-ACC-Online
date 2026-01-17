
import React from 'react';
import { ExternalLink, Zap, Layout, Target } from 'lucide-react';
import { QUICK_LINKS } from '../constants';

const QuickTools: React.FC = () => {
  const icons = [<Zap className="w-5 h-5" />, <Layout className="w-5 h-5" />, <Target className="w-5 h-5" />];

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">专属学习工具箱</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link, idx) => (
          <a 
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-95 overflow-hidden"
          >
            <div className={`p-3 rounded-xl ${link.color} text-white mr-4 shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
              {icons[idx]}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-sm mb-0.5 group-hover:text-blue-600">{link.title}</h3>
              <p className="text-[11px] text-gray-400 line-clamp-1">{link.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-200 group-hover:text-blue-400" />
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               {icons[idx]}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickTools;

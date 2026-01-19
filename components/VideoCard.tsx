
import React from 'react';
import { Play, Lock, CheckCircle, Download, Clock, BookOpen } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  isCompleted?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect, isCompleted }) => {
  const isFree = video.IsFree === "Yes";

  // 根据分类生成不同的背景颜色
  const getBgColor = (category: string) => {
    if (category.includes('基础')) return 'from-blue-500 to-blue-600';
    if (category.includes('Bab 1') || category.includes('Bab 2')) return 'from-indigo-500 to-indigo-600';
    if (category.includes('Bab 3') || category.includes('Bab 4')) return 'from-purple-500 to-purple-600';
    return 'from-slate-500 to-slate-600';
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full ${
        isCompleted ? 'border-green-200 bg-green-50/10' : 'border-gray-100'
      }`}
      onClick={() => onSelect(video)}
    >
      <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${getBgColor(video.Category)} flex items-center justify-center shrink-0`}>
        {/* 去除图片，改为文字图标占位 */}
        <div className="flex flex-col items-center text-white/20 group-hover:scale-110 transition-transform duration-500">
           <BookOpen className="w-12 h-12 mb-2" />
           <span className="text-sm font-black uppercase tracking-widest">{video.Category}</span>
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
          <div className="flex justify-between items-center w-full">
             <span className="flex items-center text-[10px] text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
               <Clock className="w-3 h-3 mr-1" />
               {video.DurationMin} 分钟
             </span>
             {isCompleted && (
               <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                 <CheckCircle className="w-4 h-4" />
               </div>
             )}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="bg-white/90 p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            {isFree ? (
              <Play className="w-6 h-6 text-blue-600 fill-current" />
            ) : (
              <Lock className="w-6 h-6 text-amber-600" />
            )}
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {isFree ? (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              免费
            </span>
          ) : (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              会员
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {video.Category}
          </span>
        </div>
        <h3 className="font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors mb-4 flex-1">
          {video.Title}
        </h3>
        
        {video.MaterialLink && isFree && (
          <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-auto">
            <button 
              className="flex items-center text-xs text-blue-500 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                window.open(video.MaterialLink, '_blank');
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              下载讲义
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;

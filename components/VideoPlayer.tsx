
import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Lock, Loader2, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onWatched: (videoID: string) => void;
  isUnlocked: boolean;
  isLoading: boolean;
  error?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  onClose, 
  onWatched, 
  isUnlocked, 
  isLoading,
  error 
}) => {
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [hasMarked, setHasMarked] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const targetSeconds = Math.min((video.DurationMin * 60) / 2, 5 * 60);

  const getVideoEmbedUrl = (url: string = "") => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    }
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
    }
    return null;
  };

  const embedUrl = getVideoEmbedUrl(video.realVideoUrl);

  useEffect(() => {
    let interval: any;
    if (isUnlocked && videoRef.current) {
      interval = setInterval(() => {
        if (!videoRef.current?.paused) {
          setSecondsWatched(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUnlocked]);

  useEffect(() => {
    if (!hasMarked && secondsWatched >= targetSeconds && video.IsFree === "No") {
      onWatched(video.VideoID);
      setHasMarked(true);
    }
  }, [secondsWatched, targetSeconds, hasMarked, video, onWatched]);

  const openOriginal = () => {
    if (video.realVideoUrl) {
      window.open(video.realVideoUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
             <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{video.Title}</h2>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                  {video.IsFree === "Yes" ? "✅ 免费公开课" : "💎 会员特训视频"}
                </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Player Area */}
        <div className="aspect-video bg-neutral-900 flex items-center justify-center relative group">
          {isLoading ? (
            <div className="flex flex-col items-center text-white">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
              <p className="text-sm font-medium opacity-60">正在获取视频流...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-white px-8 text-center">
              <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
              <p className="text-lg font-bold mb-2">解锁视频失败</p>
              <p className="text-gray-400 text-sm mb-6 max-w-sm">{error}</p>
              <button onClick={onClose} className="px-8 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100">
                返回重试
              </button>
            </div>
          ) : isUnlocked ? (
            <div className="w-full h-full relative">
              {embedUrl ? (
                <>
                  <iframe 
                    src={embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  
                  {/* 改良版小助手：右上角悬浮按钮 */}
                  <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                      onClick={() => setShowHelp(!showHelp)}
                      className="bg-black/60 hover:bg-blue-600 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg flex items-center gap-2"
                     >
                       <HelpCircle className="w-5 h-5" />
                       <span className="text-xs font-bold pr-1">播放遇到问题？</span>
                     </button>
                     
                     {showHelp && (
                        <div className="bg-white rounded-xl p-4 shadow-2xl border border-blue-100 max-w-[200px] animate-in slide-in-from-top-2 duration-200">
                           <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
                             由于浏览器安全限制，部分手机可能无法直接播放。
                           </p>
                           <button 
                             onClick={openOriginal}
                             className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                           >
                             <ExternalLink className="w-3.5 h-3.5" />
                             外部播放
                           </button>
                        </div>
                     )}
                  </div>
                </>
              ) : (
                <video ref={videoRef} src={video.realVideoUrl} controls className="w-full h-full" autoPlay />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <Lock className="w-12 h-12 text-amber-500 mb-4" />
              <p className="font-bold">内容受保护，解锁中...</p>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-gray-700">播放贴士</span>
             </div>
             <p className="text-[11px] text-gray-500 leading-relaxed">
               如果播放器显示“视频不可用”，请点击右侧的 <span className="text-blue-600 font-bold">【解决黑屏/报错】</span>。
             </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {video.realVideoUrl && (
              <button 
                onClick={openOriginal}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                解决黑屏/报错
              </button>
            )}
            {video.realMaterialLink && (
              <a 
                href={video.realMaterialLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                <Download className="w-4 h-4 mr-2" />
                下载讲义
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

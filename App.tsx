
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, BookOpen, Clock, PlayCircle, Trophy, RefreshCw, AlertTriangle, ExternalLink, Settings, Globe, ShieldAlert, Copy } from 'lucide-react';
import Navbar from './components/Navbar';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import LoginModal from './components/LoginModal';
import QuickTools from './components/QuickTools';
import Testimonials from './components/Testimonials';
import { api } from './services/api';
import { Video, Student } from './types';
import { CATEGORIES, CACHE_KEY_VIDEOS, GAS_URL } from './constants';

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<Student | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getVideos();
      if (data && data.length > 0) {
        setVideos(data);
      } else {
        setError('服务器响应正常，但未在 Google Sheet 中检测到视频条目。');
      }
    } catch (err: any) {
      console.error("加载失败:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('ji_laoshi_student');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const titleMatch = v.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      
      // 核心修复：添加 trim() 确保分类名哪怕带了空格也能正确识别
      const videoCat = (v.Category || "").trim();
      const targetCat = selectedCategory.trim();
      
      const categoryMatch = targetCat === '全部' || videoCat === targetCat;
      return titleMatch && categoryMatch;
    });
  }, [videos, searchTerm, selectedCategory]);

  const handleLogin = async (id: string, pass: string) => {
    const res = await api.login(id, pass);
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('ji_laoshi_student', JSON.stringify(res.data));
      setShowLogin(false);
    } else {
      throw new Error(res.message || '登录验证失败，请核对信息');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ji_laoshi_student');
    setSelectedVideo(null);
  };

  const handleVideoSelect = useCallback(async (video: Video) => {
    const isFree = video.IsFree === "Yes";
    
    if (!isFree && !user) {
      setShowLogin(true);
      return;
    }

    setSelectedVideo({ ...video, isUnlocked: false });
    setIsUnlocking(true);
    setUnlockError('');

    try {
      const currentID = user ? user.StudentID : 'GUEST';
      const res = await api.unlockVideo(currentID, video.VideoID);
      
      if (res.success && res.data) {
        if (!isFree && user) {
          const updatedUser = { 
            ...user, 
            UsageCount: Math.min(Number(user.UsageCount) + 1, user.MaxUsage)
          };
          setUser(updatedUser);
          localStorage.setItem('ji_laoshi_student', JSON.stringify(updatedUser));
        }
        setSelectedVideo({
          ...video,
          isUnlocked: true,
          realVideoUrl: res.data.videoUrl,
          realMaterialLink: res.data.materialLink || video.MaterialLink
        });
      } else {
        setUnlockError(res.message || '该视频目前无法播放，请联系管理员。');
      }
    } catch (err) {
      setUnlockError('网络请求连接超时，请检查您的互联网连接。');
    } finally {
      setIsUnlocking(false);
    }
  }, [user]);

  const handleMarkWatched = useCallback(async (videoID: string) => {
    if (!user) return;
    if (!user.WatchedHistory.includes(videoID)) {
      const updatedHistory = [...user.WatchedHistory, videoID];
      const updatedUser = { ...user, WatchedHistory: updatedHistory };
      setUser(updatedUser);
      localStorage.setItem('ji_laoshi_student', JSON.stringify(updatedUser));
      await api.markWatched(user.StudentID, videoID);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar user={user} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} />
      
      <section className="bg-blue-600 text-white py-16 px-4 shadow-inner overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
          <BookOpen className="w-80 h-80 rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-md text-white">
              纪老师会计特训站
            </h1>
            <p className="text-blue-100 text-xl font-medium opacity-90 max-w-2xl leading-relaxed">
              专为 Form 4 学生打造的会计学核心课程。从基础到进阶，助力您的 SPM 会计之路。
            </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm border-l-4 border-l-red-500">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-900 font-bold text-lg mb-1">系统离线中</h3>
                <p className="text-red-700 text-sm mb-4 leading-relaxed">{error}</p>
                <button onClick={fetchVideos} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-95">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
                  重新同步数据
                </button>
              </div>
            </div>
          </div>
        )}

        <QuickTools />

        <div className="mb-10 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="搜索课程、关键词或 Bab 名称..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none shadow-sm transition-all text-gray-700 placeholder:text-gray-300"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 w-full lg:w-auto px-1">
            {CATEGORIES.map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedCategory(c)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                  selectedCategory === c ? 'bg-blue-600 text-white shadow-blue-200 ring-2 ring-blue-500 ring-offset-2' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 aspect-[4/3] rounded-3xl" />
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {filteredVideos.map(v => (
              <VideoCard 
                key={v.VideoID} 
                video={v} 
                onSelect={handleVideoSelect} 
                isCompleted={user?.WatchedHistory.includes(v.VideoID)}
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold text-xl mb-2">未找到匹配的课程</p>
              <p className="text-gray-300 text-sm">请尝试更改搜索词或选择其他章节分类</p>
            </div>
          )
        )}

        <Testimonials />
      </main>

      <footer className="mt-20 py-16 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-black mb-3 tracking-tight">纪老师会计特训站</h3>
            <p className="text-gray-500 text-sm mb-8">Empowering Form 4 Accounting Students to Achieve Excellence.</p>
            <div className="h-px bg-white/5 w-full mb-8"></div>
            <p className="text-gray-700 text-[10px] uppercase tracking-widest">© 2024 Accounting Mastery Platform. Made with Passion.</p>
        </div>
      </footer>

      {selectedVideo && (
        <VideoPlayer 
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onWatched={handleMarkWatched}
          isUnlocked={selectedVideo.isUnlocked || false}
          isLoading={isUnlocking}
          error={unlockError}
        />
      )}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
    </div>
  );
};

export default App;

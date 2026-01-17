
import React, { useState } from 'react';
import { Award, Star, User, X, Maximize2 } from 'lucide-react';

// 辅助函数：根据需求返回不同尺寸的 Google Drive 图片
const getDriveImageUrl = (url: string, size: number = 1000) => {
  if (!url) return "";
  const match = url.match(/\/d\/(.+?)\/(view|edit|preview)/) || url.match(/id=(.+?)(&|$)/);
  const id = match ? match[1] : null;
  
  if (id) {
    // sz 参数决定了返回图片的宽度
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
  }
  return url;
};

const TESTIMONIALS = [
  {
    image: "https://drive.google.com/file/d/1QyITFsQ9vmZ6H6BT7IAcELRomqDxZegR/view?usp=drive_link",
    name: "Enqi",
    score: "F4 F5 SPM ACC ALL A+",
    comment: "从 Form 4 第一次接触会计到 SPM 拿 A+，在纪老师清楚又简单的教导下，我一直保持 A+，会计也成了我最有信心的一科。"
  },
  {
    image: "https://drive.google.com/file/d/1WN8eHmeLmVQJsDFEANwH2H6sZ8hQqF2s/view?usp=drive_link",
    name: "Ng Min Hui",
    score: "SPM ACC A+",
    comment: "从 Bio 转去会计并不容易，但纪老师清楚的讲解、完整的 recording 和耐心解答，让我一步一步走到 SPM Accounting A+。"
  },
  {
    image: "https://drive.google.com/file/d/12HgLwdT8nate5M8PLWYF-nUMchfetyjO/view?usp=drive_link",
    name: "Tan Chun Pew",
    score: "SPM ACC A+",
    comment: "以前 Accounting 每次不及格，Trial 只有 50 分，在纪老师的带领下成功逆转，SPM Accounting 拿到 A+。"
  }
];

const Testimonials: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-20 mt-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 mr-2 fill-amber-600" />
            学生战绩与反馈
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">见证成长的每一刻</h2>
          <p className="text-gray-500 max-w-xl mx-auto">每一个高分的背后，都是汗水与正确方法的结合。点击照片可查看成绩单大图。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div key={idx} className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div 
                className="relative mb-6 cursor-zoom-in"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative">
                  <img 
                    src={getDriveImageUrl(item.image, 800)} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                       <Maximize2 className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-200">
                    <User className="w-12 h-12 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Photo Loading...</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-2 bg-blue-600 text-white p-4 rounded-2xl shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform z-20">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-3 px-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{item.score}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-500 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / 大图预览弹窗 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-5xl max-h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
            <img 
              src={getDriveImageUrl(selectedImage, 1600)} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-white/60 text-sm font-medium">点击背景任何位置关闭预览</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;

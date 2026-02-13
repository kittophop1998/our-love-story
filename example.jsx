import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Camera, 
  Video, 
  Send, 
  LogOut, 
  QrCode, 
  History, 
  Music,
  Share2,
  Lock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('login'); // login, creator, lover_view
  const [loveData, setLoveData] = useState({
    photos: [], // Array of { url: '', memory: '' }
    videoUrl: '',
    videoMemory: '',
    message: '',
  });

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setView('creator');
  };

  // Multiple Image Upload
  const handleMultiplePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoveData(prev => ({
          ...prev,
          photos: [...prev.photos, { url: reader.result, memory: '' }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setLoveData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const updatePhotoMemory = (index, text) => {
    const newPhotos = [...loveData.photos];
    newPhotos[index].memory = text;
    setLoveData(prev => ({ ...prev, photos: newPhotos }));
  };

  const CreatorMode = () => (
    <div className="min-h-screen bg-rose-50 pb-20">
      <nav className="bg-white/80 backdrop-blur-md p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xl">
          <Heart fill="currentColor" size={24} />
          <span>Love Creator</span>
        </div>
        <button onClick={() => setView('login')} className="text-gray-500 flex items-center gap-1 text-sm">
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </nav>

      <main className="max-w-2xl mx-auto p-4 space-y-8 mt-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">สร้างความทรงจำของเรา</h1>
          <p className="text-gray-500">เพิ่มรูปภาพหลายๆ รูป เพื่อเล่าเรื่องราวความรักของคุณ</p>
        </header>

        {/* Section: Multiple Photos */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100">
          <div className="flex items-center justify-between mb-6 text-rose-600 font-semibold">
            <div className="flex items-center gap-2">
              <Camera size={20} />
              <h2>คลังรูปภาพความทรงจำ ({loveData.photos.length})</h2>
            </div>
            <label className="cursor-pointer bg-rose-100 p-2 rounded-full hover:bg-rose-200 transition-colors">
              <Plus size={20} />
              <input type="file" className="hidden" onChange={handleMultiplePhotoUpload} accept="image/*" multiple />
            </label>
          </div>

          <div className="space-y-6">
            {loveData.photos.length === 0 && (
              <label className="block w-full h-40 border-2 border-dashed border-rose-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors">
                <Camera size={32} className="text-rose-300 mb-2" />
                <span className="text-rose-400 font-medium">เพิ่มรูปภาพแรกของคุณ</span>
                <input type="file" className="hidden" onChange={handleMultiplePhotoUpload} accept="image/*" multiple />
              </label>
            )}

            {loveData.photos.map((photo, index) => (
              <div key={index} className="group relative bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <button 
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 size={14} />
                </button>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-200">
                  <img src={photo.url} alt={`Memory ${index}`} className="w-full h-full object-cover" />
                </div>
                <textarea 
                  placeholder="เขียนความทรงจำสั้นๆ สำหรับรูปนี้..."
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-300 text-sm"
                  value={photo.memory}
                  onChange={(e) => updatePhotoMemory(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section: Video */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100">
          <div className="flex items-center gap-2 mb-4 text-rose-600 font-semibold">
            <Video size={20} />
            <h2>วิดีโอ (YouTube Link)</h2>
          </div>
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="วางลิงก์วิดีโอ YouTube..."
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300"
              value={loveData.videoUrl}
              onChange={(e) => setLoveData({...loveData, videoUrl: e.target.value})}
            />
            <textarea 
              placeholder="เขียนความรู้สึกที่อยากให้แฟนอ่านขณะดูวิดีโอ..."
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300 min-h-[80px]"
              value={loveData.videoMemory}
              onChange={(e) => setLoveData({...loveData, videoMemory: e.target.value})}
            />
          </div>
        </section>

        {/* Section: Final Message */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100">
          <div className="flex items-center gap-2 mb-4 text-rose-600 font-semibold">
            <Send size={20} />
            <h2>จดหมายถึงคนพิเศษ</h2>
          </div>
          <textarea 
            placeholder="ข้อความสุดท้ายที่อยากบอก..."
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300 min-h-[120px]"
            value={loveData.message}
            onChange={(e) => setLoveData({...loveData, message: e.target.value})}
          />
        </section>

        <button 
          onClick={() => setView('lover_view')}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <QrCode size={20} />
          สร้างหน้าเว็บ และดูตัวอย่าง
        </button>
      </main>
    </div>
  );

  const LoverView = () => {
    const [activePhoto, setActivePhoto] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'fixed text-rose-300 pointer-events-none animate-pulse';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '105vh';
        heart.style.opacity = '0.6';
        heart.style.transition = 'all 5s linear';
        document.body.appendChild(heart);
        setTimeout(() => {
          heart.style.top = '-10vh';
          heart.style.opacity = '0';
        }, 50);
        setTimeout(() => heart.remove(), 5000);
      }, 600);
      return () => clearInterval(interval);
    }, []);

    const nextPhoto = () => setActivePhoto((prev) => (prev + 1) % loveData.photos.length);
    const prevPhoto = () => setActivePhoto((prev) => (prev - 1 + loveData.photos.length) % loveData.photos.length);

    return (
      <div className="min-h-screen bg-rose-100 p-4 md:p-8 flex flex-col items-center">
        <div className="fixed bottom-4 right-4 z-50">
           <button onClick={() => setView('creator')} className="bg-white p-3 px-5 rounded-full shadow-xl border border-rose-200 text-rose-500 flex items-center gap-2 text-sm font-bold">
             <QrCode size={18} /> แชร์ให้แฟน
           </button>
        </div>

        <div className="max-w-lg w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <header className="text-center space-y-4">
            <Heart fill="#f43f5e" className="text-rose-500 mx-auto animate-bounce" size={48} />
            <h1 className="text-3xl font-serif font-bold text-rose-800">Happy Valentine's Day</h1>
            <p className="text-rose-500 italic">"ความรักของเราคือสิ่งที่ดีที่สุดที่เคยเกิดขึ้น"</p>
          </header>

          {/* Photo Gallery Carousel */}
          {loveData.photos.length > 0 && (
            <div className="space-y-6">
              <div className="relative group">
                <div className="bg-white p-3 rounded-2xl shadow-2xl transform rotate-1 transition-transform duration-500 overflow-hidden">
                  <img 
                    src={loveData.photos[activePhoto].url} 
                    alt="Memory" 
                    className="w-full aspect-[4/5] object-cover rounded-xl" 
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center">
                    <button onClick={prevPhoto} className="bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button onClick={nextPhoto} className="bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {loveData.photos.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === activePhoto ? 'w-6 bg-rose-500' : 'w-2 bg-rose-200'}`} />
                  ))}
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl text-center border border-white/60">
                <p className="font-serif text-rose-900 italic text-xl leading-relaxed">
                  "{loveData.photos[activePhoto].memory || 'เรามีความสุขกันมากนะ...'}"
                </p>
              </div>
            </div>
          )}

          {/* Video Section */}
          {loveData.videoUrl && (
            <div className="space-y-4">
               <div className="bg-rose-200 aspect-video rounded-3xl flex items-center justify-center shadow-lg border-4 border-white overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <Video size={50} className="text-white z-10 animate-pulse" />
                  <p className="absolute bottom-4 text-white z-10 font-bold">กดเพื่อดูช่วงเวลาของเรา</p>
               </div>
               <div className="text-center p-4">
                  <p className="text-rose-700 font-medium italic">{loveData.videoMemory}</p>
               </div>
            </div>
          )}

          {/* Heart-felt Letter */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-10 rounded-[3rem] shadow-2xl text-white text-center space-y-6 relative overflow-hidden">
            <Heart className="absolute -top-6 -right-6 text-white opacity-10" size={150} />
            <h3 className="text-2xl font-serif font-bold italic tracking-wider">ความในใจของฉัน...</h3>
            <p className="text-lg leading-relaxed font-light">
              {loveData.message || 'รักคุณเสมอและตลอดไป'}
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Heart fill="white" size={20} className="animate-bounce" />
            </div>
          </div>

          <footer className="text-center pb-12">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-rose-200 inline-block">
               <p className="text-rose-500 font-bold mb-4">Keep our memories alive</p>
               <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-rose-100">
                  <QrCode size={120} className="text-gray-800" />
               </div>
            </div>
          </footer>
        </div>
      </div>
    );
  };

  const LoginView = () => (
    <div className="min-h-screen bg-rose-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="bg-rose-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
            <Heart className="text-rose-500 animate-pulse" size={40} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Happy Valentine</h1>
          <p className="text-gray-400">เข้าสู่ระบบเพื่อสร้างของขวัญพิเศษ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="ชื่อผู้ใช้งาน" 
            defaultValue="lover"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-300"
          />
          <input 
            type="password" 
            placeholder="รหัสผ่าน" 
            defaultValue="password"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-300"
          />
          <button 
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            เปิดประตูหัวใจ
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {view === 'login' && <LoginView />}
      {view === 'creator' && <CreatorMode />}
      {view === 'lover_view' && <LoverView />}
    </div>
  );
};

export default App;
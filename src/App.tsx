import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  ExternalLink,
  MessageSquare,
  Gift,
  Heart,
  Calendar,
  Check,
  User,
  Coffee,
  Instagram,
  Smile,
  Shield,
  Briefcase,
  Layers,
  Sparkle,
  Music,
  Volume2,
  VolumeX,
  Pause,
  Play,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ----------------------------------------------------
// DUAL RESOLUTION FOR USER IMAGES & VIDEOS
// Supports both public/images/* and src/images/*
// ----------------------------------------------------
const srcImages = (import.meta as any).glob('/src/images/*.{png,jpg,jpeg,JPG,JPEG,PNG,webp,WEBP}', { eager: true, import: 'default' });
const srcVideos = (import.meta as any).glob('/src/images/*.mp4', { eager: true, import: 'default' });

function resolveImage(path: string): string {
  const fileName = path.split('/').pop();
  if (fileName) {
    const matchedKey = Object.keys(srcImages).find(key => key.endsWith('/' + fileName));
    if (matchedKey) {
      return srcImages[matchedKey] as string;
    }
  }
  return path;
}

function resolveVideo(path: string): string {
  const fileName = path.split('/').pop();
  if (fileName) {
    const matchedKey = Object.keys(srcVideos).find(key => key.endsWith('/' + fileName));
    if (matchedKey) {
      return srcVideos[matchedKey] as string;
    }
  }
  return path;
}

// ----------------------------------------------------
// SAFETY BACKUP IMAGES FOR PREMIUM AMBIENCE (UNSPLASH)
// Used dynamically if local files are not found/uploaded
// ----------------------------------------------------
const BACKUP_IMAGES = {
  heroFallback: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
  shopExterior: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
  shopLobby: "https://images.unsplash.com/photo-1544161515-4af6b1d8d16e?auto=format&fit=crop&w=1200&q=80",
  shopRoom: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80",
  step1: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=85", // Juice
  step2: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=85", // Foot Bath
  step3: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=85", // Head Spa
  step4: "https://images.unsplash.com/photo-1600334188221-3dfd552e1793?auto=format&fit=crop&w=800&q=85", // Massage
  step5: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=85", // Hotstone
  step6: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=85", // Stretching
};

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackKey: keyof typeof BACKUP_IMAGES;
  className?: string;
}

function SafeImage({ 
  src, 
  alt, 
  fallbackKey, 
  className 
}: SafeImageProps) {
  const resolved = resolveImage(src);
  const [imgSrc, setImgSrc] = useState(resolved);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setImgSrc(resolveImage(src));
    setHasFailed(false);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasFailed) {
          setHasFailed(true);
          setImgSrc(BACKUP_IMAGES[fallbackKey]);
        }
      }}
    />
  );
}

interface StepImageSliderProps {
  images: string[];
  fallbackKey: keyof typeof BACKUP_IMAGES;
  alt: string;
}

function StepImageSlider({ images, fallbackKey, alt }: StepImageSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearTimeout(interval);
  }, [index, images.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full group/slider">
      {images.map((src, i) => (
        <div 
          key={src}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <SafeImage 
            src={src} 
            alt={`${alt} ${i + 1}`} 
            fallbackKey={fallbackKey}
            className="w-full h-full object-cover select-none" 
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-stone-950/5 z-10"></div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-amber-100 border border-stone-200 text-stone-800 transition-all duration-300 z-20 cursor-pointer opacity-0 group-hover/slider:opacity-100 shadow-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#B5945F]" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-amber-100 border border-stone-200 text-stone-800 transition-all duration-300 z-20 cursor-pointer opacity-0 group-hover/slider:opacity-100 shadow-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-3.5 h-3.5 text-[#B5945F]" />
          </button>

          {/* Miniature Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-25 bg-stone-950/40 backdrop-blur-xs py-1 px-2 rounded-full">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIndex(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "bg-amber-400 scale-110" : "bg-white/60"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const HEALING_BGM_URL = "https://archive.org/download/GymnopedieNo.1_447/ErikSatie-GymnopedieNo.1.mp3";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<'spa' | 'nail' | null>(null);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState<'spa' | 'nail'>('spa');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sound Therapy states - simplified single track
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    // Pre-initialize and preload audio for instant tactile response on click
    try {
      const audio = new Audio(HEALING_BGM_URL);
      audio.loop = true;
      audio.volume = 0.25; // Gentle, calming volume level
      audio.preload = "auto";
      audioRef.current = audio;
    } catch (e) {
      console.error("Failed preloading background music:", e);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(HEALING_BGM_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25;
        audioRef.current.preload = "auto";
      }

      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        audioRef.current.play().catch(err => {
          console.warn("Audio playback gesture caught or offline: ", err);
        });
      }
    } catch (e) {
      console.error("Audio toggle failed:", e);
    }
  };



  // 10 Steps journey details
  const journeySteps = [
    {
      num: "01",
      icon: "🚗",
      title: "Resort & Airport Pickup",
      titleKo: "Complementary Island-wide Transfer (1 Round Trip)",
      desc: "Get 1 free round-trip transfer anywhere in Phu Quoc. When booking a VIP course for 2 or more guests, we provide comfortable, air-conditioned transport from the airport or any local resort to our spa, or from the spa back to your resort.",
      images: ["images/1. 픽업차량.JPG"],
      fallbackKey: "step1" as const
    },
    {
      num: "02",
      icon: "🍉",
      title: "Welcome Drink & Consult",
      titleKo: "Chilled Watermelon Smoothie & Consultation",
      desc: "Relish a refreshing, sweet handcrafted cold watermelon smoothie right upon arrival. Our wellness concierge will help tailor your massage pressure, mapping your focused attention spots and any areas to avoid.",
      images: ["images/2. 웰컴 슈박쥬스.JPG", "images/2. 웰컴.JPG"],
      fallbackKey: "step2" as const
    },
    {
      num: "03",
      icon: "🥋",
      title: "Private Gown Exchange",
      titleKo: "Sanitized Robes & Private Treatment Room",
      desc: "Prepare for your therapy in your dedicated room. You will be provided with plush, soft robes that undergo meticulous high-temperature wash cycles and disinfection daily for flawless hygiene.",
      images: ["images/3. 접수.JPG"],
      fallbackKey: "step3" as const
    },
    {
      num: "04",
      icon: "🍋",
      title: "Herbal Foot Bath",
      titleKo: "Fresh Lime & Lemongrass Detoxifying Soak",
      desc: "Dissolve travel fatigue in a warm foot bath infused with pure natural sea salts, fragrant seasonal flower petals, natural local limes, and restorative lemongrass to cleanse impurities and soothe active nerve paths.",
      images: ["images/4. 족욕.JPG", "images/4.족욕2.JPG", "images/4.족욕4.JPG"],
      fallbackKey: "step4" as const
    },
    {
      num: "05",
      icon: "💆‍♀️",
      title: "Premium Scalp Head-Spa",
      titleKo: "Aromatic Head Massage & Relaxing Scalp Spa",
      desc: "A rhythmic acupressure massage using premium nutrient-dense botanical extracts onto cranial tension nodes. This releases built-up mental stress and gently conducts you into a serene state of deep relaxation.",
      images: ["images/5.두피.JPG", "images/5.두피1.JPG", "images/5. 두피2.JPG", "images/5. 두피3.JPG", "images/5. 두피4.JPG"],
      fallbackKey: "step3" as const
    },
    {
      num: "06",
      icon: "✨",
      title: "Customized Full-Body Oil Massage",
      titleKo: "Sincere Handcrafted 1:1 Aromatherapy",
      desc: "Enjoy YUJU's certified healing therapy utilizing customized organic essential oils blended to your sensory liking, relaxing taut muscle groups and smoothing out deep bodily fatigue.",
      images: ["images/6. 마사지.JPG", "images/6. 마사지1.JPG", "images/6. 마사지2.JPG", "images/6. 마사지3.JPG"],
      fallbackKey: "step4" as const
    },
    {
      num: "07",
      icon: "🪨",
      title: "Thermal Volcano Stone Spa",
      titleKo: "Heated Basalt Stone Placement & Therapy",
      desc: "Gently heated natural basalt stones loaded with rich far-infrared energy are glided along key spinal channels to induce deep tissue warmth, increasing metabolic circulation and natural detox processes.",
      images: ["images/7. 스톤.JPG", "images/7. 스톤1.JPG", "images/7. 스톤2.JPG"],
      fallbackKey: "step5" as const
    },
    {
      num: "08",
      icon: "🙌",
      title: "Precision Deep Acupressure",
      titleKo: "Therapeutic Deep Tissue Core-Acupressure",
      desc: "Targeting stubborn physical tension knots within core areas like the neck, upper back scapula, and lumbar region to align muscle fibers and alleviate long-term physical stress.",
      images: ["images/8. 지압.JPG"],
      fallbackKey: "step1" as const
    },
    {
      num: "09",
      icon: "🧘‍♀️",
      title: "Guided Rejuvenating Stretching",
      titleKo: "Spinal Opening & Posture-Realigning Stretch",
      desc: "A carefully guided stretching sequence designed to gently open up tight spinal meridians and shoulder joints, allowing full deep diaphragmatic breathing and a feeling of airy lightness.",
      images: ["images/9 스트레칭.JPG", "images/9. 스트레칭2.JPG"],
      fallbackKey: "step6" as const
    },
    {
      num: "10",
      icon: "🚿",
      title: "Private Shower Refresh",
      titleKo: "Impeccably Clean Hot Shower Facility",
      desc: "Refresh yourself before or after your therapy in our fully equipped, separate male & female hot shower facilities stocked with clean luxury bath linens and premium amenities.",
      images: ["images/10. 샤워.JPG", "images/10 샤워1.JPG", "images/10. 샤워2.JPG", "images/10 샤워3.JPG"],
      fallbackKey: "step5" as const
    },
    {
      num: "11",
      icon: "🍵",
      title: "Herbal Tea & Central Tour",
      titleKo: "Artisan Herbal Tea & Complementary Bag Storage",
      desc: "Conclude your premium healing massage experience with a warm cup of sweet organic herbal tea. Guests can store heavy luggage securely at our lobby luggage zone to enjoy their excursion around Phu Quoc completely weight-free.",
      images: ["images/허브티.JPG"],
      fallbackKey: "step1" as const
    }
  ];

  // Dynamically load Elfsight script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);



  return (
    <div id="main-container" className="min-h-screen bg-[#FAF8F5] text-stone-800 antialiased selection:bg-amber-100 selection:text-amber-950 font-sans scroll-smooth">
      
      {/* ----------------- EXQUISITE HEADER NAV ----------------- */}
      <nav id="nav-header" className="fixed top-0 left-0 right-0 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          
          <a href="#hero" className="flex items-center gap-3 group focus:outline-none text-left">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-900/10 bg-amber-50 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <SafeImage 
                src="images/푸꾸옥유주스파로고.jpg" 
                alt="YUJU SPA Logo" 
                fallbackKey="heroFallback"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold tracking-[0.15em] text-stone-900 uppercase leading-none">YUJU SPA</span>
              <span className="text-[9px] uppercase tracking-widest text-[#B5945F] font-bold mt-1">Phu Quoc resort & nail</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-7 text-[11px] uppercase tracking-widest font-bold text-stone-600">
            <a href="#hero" className="hover:text-amber-800 transition-colors">Main</a>
            <a href="#ambiance" className="hover:text-amber-800 transition-colors">Ambiance</a>
            <a href="#journey" className="hover:text-amber-800 transition-colors">10 Steps</a>
            <a href="#services" className="hover:text-amber-800 transition-colors">Services</a>
            <a href="#nail" className="hover:text-amber-800 transition-colors">Nail Art</a>
            <a href="#find-us" className="hover:text-amber-800 transition-colors">Contact</a>
          </div>

          <div className="hidden md:block">
            <a 
              href="#find-us"
              className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider px-6 py-2.5 transition active:scale-95 inline-block"
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-stone-850 hover:text-amber-850 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile slide down drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-[#FAF8F5]/98 py-5 px-6 space-y-4 shadow-xl absolute w-full left-0 z-50 text-left">
            <a href="#hero" onClick={() => setIsMenuOpen(false)} className="block font-bold text-stone-600 hover:text-amber-800 py-1 text-xs uppercase tracking-wider">Main</a>
            <a href="#ambiance" onClick={() => setIsMenuOpen(false)} className="block font-bold text-stone-600 hover:text-amber-800 py-1 text-xs uppercase tracking-wider">Ambiance</a>
            <a href="#journey" onClick={() => setIsMenuOpen(false)} className="block font-bold text-stone-600 hover:text-amber-800 py-1 text-xs uppercase tracking-wider">10-Step Journey</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="block font-bold text-stone-600 hover:text-amber-800 py-1 text-xs uppercase tracking-wider">Services</a>
            <a href="#nail" onClick={() => setIsMenuOpen(false)} className="block font-bold text-stone-600 hover:text-amber-800 py-1 text-xs uppercase tracking-wider">Nail Art</a>
            <a href="#find-us" onClick={() => setIsMenuOpen(false)} className="block font-bold text-stone-600 hover:text-amber-800 py-1 text-xs uppercase tracking-wider">Contact</a>
            
            <a 
              href="#find-us"
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-[#B5945F] text-white py-3 text-xs font-bold uppercase tracking-widest text-center block"
            >
              Book Now
            </a>
          </div>
        )}
      </nav>

      {/* ----------------- DYNAMIC HERO BANNER WITH VIDEO BACKGROUND ----------------- */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 w-full h-full z-10">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover opacity-65 filter brightness-90"
            src={resolveVideo('images/메인영상.mp4')}
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>
        
        {/* Sleek warm dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/40 to-[#FAF8F5] z-15"></div>
        
        <div className="relative z-20 text-center px-5 max-w-4xl mx-auto border-none">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-full mb-5 backdrop-blur-sm shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-extrabold">PHU QUOC NO.1 RETREAT & BEAUTY</span>
          </div>
          
          <h1 className="text-3xl md:text-6xl font-serif text-white leading-tight mb-6 tracking-wide drop-shadow-xs">
            The Beginning & End of Your Phu Quoc Journey,<br />
            <span className="tracking-[0.1em] font-bold text-amber-400">YUJU SPA</span>
          </h1>
          
          <div className="w-16 h-[1.5px] bg-amber-400/60 mx-auto mb-6"></div>
          
          <p className="text-base md:text-xl font-serif italic text-stone-200 leading-relaxed max-w-2xl mx-auto mb-8">
            "I promise to prepare your tomorrow with the cleanest towels and the most sincere touch."
          </p>
          <p className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400">— Madam YUJU, Phu Quoc —</p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto px-4">
            <button 
              onClick={() => setIsContactMenuOpen(true)}
              className="w-full sm:w-auto bg-amber-700 hover:bg-amber-850 text-white px-7 py-3.5 rounded-xs font-bold tracking-wider text-xs uppercase text-center transition shadow-md cursor-pointer whitespace-nowrap"
            >
              Real-time Booking & Inquiries
            </button>
            <a 
              href="#services" 
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-xs font-bold tracking-wider text-xs uppercase text-center backdrop-blur-xs transition whitespace-nowrap"
            >
              Explore Spa Menu
            </a>
          </div>
        </div>
      </section>

      {/* ----------------- CORE BRAND STATS GRID ----------------- */}
      <section className="py-12 bg-white border-y border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-xl md:text-2.5xl mb-2">💝</div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Heart Fund</h4>
            <p className="text-[9px] text-stone-550 mt-1 uppercase font-semibold">Vietnam Kids Support</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl md:text-2.5xl mb-2">🙏</div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Disaster Relief</h4>
            <p className="text-[9px] text-stone-550 mt-1 uppercase font-semibold">Earthquake & Flood</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl md:text-2.5xl mb-2">👶</div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Kids & Pregnant</h4>
            <p className="text-[9px] text-stone-550 mt-1 uppercase font-semibold">Specialized Care</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl md:text-2.5xl mb-2">✨</div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Premium Hygiene</h4>
            <p className="text-[9px] text-stone-550 mt-1 uppercase font-semibold">1:1 Towel & Tub</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl md:text-2.5xl mb-2">🚿</div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Shower Room</h4>
            <p className="text-[9px] text-stone-550 mt-1 uppercase font-semibold">Full Facilities</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl md:text-2.5xl mb-2">🧳</div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Luggage storage</h4>
            <p className="text-[9px] text-stone-550 mt-1 uppercase font-semibold">Free safe storage</p>
          </div>
        </div>
      </section>

      {/* ----------------- NATIVE PREMIUM ARCHITECTURAL FLOOR LAYOUT (AMBIANCE) ----------------- */}
      <section id="ambiance" className="py-24 max-w-6xl mx-auto px-6 scroll-mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3.5xl font-serif tracking-tight text-stone-900 font-medium h2" id="our-space-title">Our Space</h2>
          <p className="text-[11px] text-amber-700 uppercase tracking-widest font-extrabold mt-2 font-sans">Elegantly Appointed Multi-Floor Healing Ambiance</p>
          <div className="w-12 h-[1px] bg-amber-300 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* 1F Zone Card */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="h-64 overflow-hidden relative">
              <SafeImage 
                src="images/매장.JPG" 
                alt="1F Premium Spa & Nail" 
                fallbackKey="shopLobby"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-stone-900/90 text-amber-100 text-xs font-sans font-extrabold px-3 py-1.5 rounded-md tracking-wider">
                1F
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">Premium Spa & Nail Salon</h3>
                <p className="text-[11px] text-[#B5945F] font-bold uppercase tracking-wider mb-3">1F Spa Reception & Luxury Nail Boutique</p>
                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                  Blending warm aesthetics with comfort, the first floor features our sophisticated nail art bar, private 1-on-1 care rooms, a secure luggage storage zone, and separate private hot shower facilities for you to refresh before or after your treatment.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-stone-100 flex gap-2 flex-wrap text-[10px] uppercase font-bold text-stone-500">
                <span className="bg-stone-50 px-2.5 py-1 rounded border border-stone-150">Main Lobby</span>
                <span className="bg-stone-50 px-2.5 py-1 rounded border border-stone-150">Nail Bar</span>
                <span className="bg-stone-50 px-2.5 py-1 rounded border border-stone-150">Shower Rooms</span>
              </div>
            </div>
          </div>

          {/* 2F Zone Card */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="h-64 overflow-hidden relative">
              <StepImageSlider 
                images={["images/카페1.JPG", "images/카페2.JPG"]} 
                alt="2F Vacation Cafe" 
                fallbackKey="shopRoom"
              />
              <div className="absolute top-4 left-4 bg-amber-700/95 text-white text-xs font-sans font-extrabold px-3 py-1.5 rounded-md tracking-wider z-20">
                2F
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">Vacation Cafe & Lounge</h3>
                <p className="text-[11px] text-[#B5945F] font-bold uppercase tracking-wider mb-3">2F Private Resort Cafe & Waiting Lounge</p>
                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                   Basking in gentle natural light, the second-floor lounge features custom artisan furniture and tropical decorations—a relaxing retreat for companions and guests waiting for transfer services. Waiting guests are treated to refreshing cold welcome beverages.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-stone-100 flex gap-2 flex-wrap text-[10px] uppercase font-bold text-stone-500">
                <span className="bg-stone-50 px-2.5 py-1 rounded border border-stone-150">Relaxation Lounge</span>
                <span className="bg-stone-50 px-2.5 py-1 rounded border border-stone-150">Fresh Welcome Drink</span>
                <span className="bg-stone-50 px-2.5 py-1 rounded border border-stone-150">Luggage Zone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SIGNATURE JOURNEY (11 STEPS) ----------------- */}
      <section id="journey" className="py-24 bg-stone-50 border-y border-stone-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif tracking-tight text-stone-900">The Signature 11-Step Journey</h2>
            <p className="text-[11px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">Yuju Spa's Signature 11-Step Luxury Healing & Restorative Journey</p>
            <div className="w-12 h-[1px] bg-amber-400/80 mx-auto mt-3"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journeySteps.map((step, idx) => (
              <div 
                key={idx} 
                className="group bg-white p-6 border border-stone-200 rounded-lg flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg transition-all duration-300 pointer-events-auto"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-4xl font-serif italic text-amber-700/30 font-bold">{step.num}</span>
                    <div className="text-2.5xl">{step.icon}</div>
                  </div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#B5945F] mb-1">{step.title}</h3>
                  <h4 className="text-sm font-bold text-stone-900 mb-2">{step.titleKo}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-5 font-semibold">{step.desc}</p>
                </div>
                <div className="w-full aspect-[4/3] bg-stone-100 rounded overflow-hidden mt-2 relative group-hover:scale-[1.01] transition-transform">
                  <StepImageSlider 
                    images={step.images} 
                    alt={step.title} 
                    fallbackKey={step.fallbackKey}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- COMPREHENSIVE SERVICE MENU ----------------- */}
      <section id="services" className="py-24 bg-[#FAF9F6] scroll-mt-16 border-t border-stone-200/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900 tracking-tight font-medium">Service Menu</h2>
            <p className="text-[11px] text-amber-700 uppercase tracking-widest font-extrabold mt-2 font-sans">Aesthetic Spa Treatments & Professional Nail Art</p>
            <div className="w-12 h-[1px] bg-amber-300 mx-auto mt-3"></div>
          </div>

          {/* Premium Minimal Tab Switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200/60 shadow-3xs">
              <button 
                onClick={() => setActiveServiceTab('spa')}
                className={`px-8 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeServiceTab === 'spa' 
                    ? "bg-stone-900 text-amber-100 shadow-sm" 
                    : "text-stone-500 hover:text-stone-850"
                }`}
              >
                Yuju Spa Menu
              </button>
              <button 
                onClick={() => setActiveServiceTab('nail')}
                className={`px-8 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeServiceTab === 'nail' 
                    ? "bg-stone-900 text-amber-100 shadow-sm" 
                    : "text-stone-500 hover:text-stone-850"
                }`}
              >
                Yuju Nail Menu
              </button>
            </div>
          </div>

          <div className="text-left">
            {activeServiceTab === 'spa' ? (
              // ----------------- YUJU SPA MENU -----------------
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* 1. Wellness Massage Card */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-xl relative shadow-3xs overflow-hidden flex flex-col justify-between hover:border-amber-500/35 hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500/80"></div>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-serif font-bold text-stone-900">Wellness Massage</h4>
                          <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">Signature</span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-1">Premium Holistic Bath & Skin Therapy</p>
                      </div>
                    </div>

                    <div className="my-5 py-4 border-y border-stone-100/80 space-y-2 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 uppercase font-bold">90 Mins</span>
                        <span className="font-extrabold text-amber-800 text-sm">750,000 VND</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 uppercase font-bold">120 Mins</span>
                        <span className="font-extrabold text-amber-800 text-sm">900,000 VND</span>
                      </div>
                    </div>

                    {/* Highlights Spec */}
                    <div className="space-y-3 pt-1 text-xs text-left">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Herbal Foot Bath & Pink Salt</strong>
                          Natural herbs & Himalayan pink sea salt warm foot bath
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Fresh Cucumber Pack</strong>
                          Nutrient-rich, refreshing sliced cucumber facial pack skin therapy
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Warm Hot Stone Therapy</strong>
                          High-grade heated volcanic basalt stone deep-tissue massage
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Herbal Warm Pillow</strong>
                          Soothing traditional heated herbal neck-pillow relaxation care
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Signature Blending Oils</strong>
                          Aromatic signature deep-tissue full-body and foot therapy integration
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Foot Massage & Upper Body Card */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-xl relative shadow-3xs overflow-hidden flex flex-col justify-between hover:border-amber-500/35 hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-stone-400"></div>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-stone-900">Foot or Upper Body</h4>
                        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-1">Focused Relief & Tension Therapy</p>
                      </div>
                    </div>

                    <div className="my-5 py-4 border-y border-stone-100/80 space-y-2 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 uppercase font-bold">60 Mins</span>
                        <span className="font-extrabold text-amber-800 text-sm">550,000 VND</span>
                      </div>
                    </div>

                    {/* Description Spec */}
                    <div className="space-y-4 pt-1 text-xs text-left">
                      <p className="text-[11px] text-stone-550 leading-relaxed font-semibold mb-4">
                        A rapid, targeted manual bodywork session designed for guests with limited time or seeking to relieve tension in specific areas.
                      </p>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Leg & Foot focus Option</strong>
                          Focused acupressure foot massage with heated lava stone calf-treatment
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Upper Body focus Option</strong>
                          Intensive lifting and relaxation focused on neck, shoulder, and shoulder-blade lines
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Kid Massage Card */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-xl relative shadow-3xs overflow-hidden flex flex-col justify-between hover:border-amber-500/35 hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#B5945F]"></div>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-serif font-bold text-stone-900">Kid Massage</h4>
                          <span className="bg-stone-100 text-stone-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Tall ~ 140cm</span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-1">Gentle Rest & Growth for Kids</p>
                      </div>
                    </div>

                    <div className="my-5 py-4 border-y border-stone-100/80 space-y-2 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 uppercase font-bold">60 Mins</span>
                        <span className="font-extrabold text-amber-800 text-sm">450,000 VND</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 uppercase font-bold">90 Mins</span>
                        <span className="font-extrabold text-amber-800 text-sm">600,000 VND</span>
                      </div>
                    </div>

                    {/* Description Spec */}
                    <div className="space-y-4 pt-1 text-xs text-left">
                      <p className="text-[11px] text-stone-550 leading-relaxed font-semibold mb-4">
                        A nourishing pediatric therapy designed to soothe growing pains, relieve fatigue, and restore peaceful energy in children.
                      </p>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-850 block">Soft Pediatric Touches</strong>
                          Soft pressure custom acupressure to align youthful body balance
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs select-none">•</span>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          <strong className="text-stone-500 block">Sleep & Rest Inducer</strong>
                          Induces restful, deep sleep for children weary from long travel hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ----------------- YUJU NAIL MENU -----------------
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left Column: Basic Care & Value Combos */}
                <div className="space-y-8">
                  {/* Basic Care List */}
                  <div className="bg-white border border-stone-200/80 p-6 rounded-xl shadow-3xs">
                    <h3 className="text-md font-serif font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 uppercase tracking-wider text-amber-800">Basic Care & Service</h3>
                    <div className="space-y-4">
                      {/* item 1 */}
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <h4 className="text-sm font-bold text-stone-850">1. Manicure or Pedicure</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">Basic hygiene and nail care (Cut + Reshape + Cuticle trim)</p>
                        </div>
                        <span className="text-sm font-mono font-bold text-stone-900">100k VND</span>
                      </div>
                      {/* item 2 */}
                      <div className="flex justify-between items-start pt-3 border-t border-stone-100/60">
                        <div>
                          <h4 className="text-sm font-bold text-stone-850">2. Remove Gel</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">Gentle and clean gel polish removal</p>
                        </div>
                        <span className="text-sm font-mono font-bold text-stone-900">100k VND</span>
                      </div>
                      {/* item 3 */}
                      <div className="flex justify-between items-start pt-3 border-t border-stone-100/60">
                        <div>
                          <h4 className="text-sm font-bold text-stone-850">3. Gel Polish</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">Premium solid base gel color application</p>
                        </div>
                        <span className="text-sm font-mono font-bold text-stone-900">300k VND</span>
                      </div>
                      {/* item 4 */}
                      <div className="flex justify-between items-start pt-3 border-t border-stone-100/60">
                        <div className="max-w-[70%]">
                          <h4 className="text-sm font-bold text-stone-850">4. Remove Heel Callus</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">Smoothing foot care (Heel filing + Spa scrub + Soothing foot pack + Massage rolling)</p>
                        </div>
                        <span className="text-sm font-mono font-bold text-stone-900">400k VND</span>
                      </div>
                    </div>
                  </div>

                  {/* Value Combo Deals */}
                  <div className="bg-amber-50/50 border border-amber-200/50 p-6 rounded-xl shadow-3xs relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-600/80"></div>
                    <h3 className="text-md font-serif font-bold text-stone-900 pb-3 mb-4 uppercase tracking-wider text-amber-700">Value Combo Deals (Highly Recommended)</h3>
                    <div className="space-y-4">
                      {/* Combo 1 */}
                      <div className="flex justify-between items-center bg-white p-3 rounded border border-stone-150/80">
                        <div>
                          <span className="text-[9px] bg-amber-700 text-white font-extrabold px-1.5 py-0.5 rounded mr-2">1 + 3</span>
                          <span className="text-[13px] font-bold text-stone-850">Basic Care + Gel Polish</span>
                          <p className="text-[10px] text-stone-550 mt-0.5">Manicure/Pedicure & Gel Polish Combo</p>
                        </div>
                        <span className="text-sm font-mono font-black text-amber-800">350,000 VND</span>
                      </div>
                      {/* Combo 2 */}
                      <div className="flex justify-between items-center bg-white p-3 rounded border border-stone-150/80">
                        <div>
                          <span className="text-[9px] bg-amber-700 text-white font-extrabold px-1.5 py-0.5 rounded mr-2">1 + 2 + 3</span>
                          <span className="text-[13px] font-bold text-stone-850">Basic Care + Gel Removal + Gel Polish</span>
                          <p className="text-[10px] text-stone-550 mt-0.5">Full Polish & Clean Removal Service</p>
                        </div>
                        <span className="text-sm font-mono font-black text-amber-800">400,000 VND</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Add-ons & Design of the month */}
                <div className="space-y-8">
                  {/* Options & Add-ons Grid */}
                  <div className="bg-white border border-stone-200/80 p-6 rounded-xl shadow-3xs">
                    <h3 className="text-md font-serif font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 uppercase tracking-wider text-amber-800">Nail Combo Option / Add-ons</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs text-stone-750">
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">X-Gel Extension Tips</span>
                        <span className="font-mono font-bold">40k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Extension Gel Refill</span>
                        <span className="font-mono font-bold">20k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Marble Acrylic Accent</span>
                        <span className="font-mono font-bold">30k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Premium Ombre Gradient</span>
                        <span className="font-mono font-bold">30k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Elegant French Tips</span>
                        <span className="font-mono font-bold">30k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Magnetic Cat-Eye Gel</span>
                        <span className="font-mono font-bold">30k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Luminous Fine Glitter</span>
                        <span className="font-mono font-bold">30k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Hand-Drawn Custom Art</span>
                        <span className="font-mono font-bold">30k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Accent Deco Stickers</span>
                        <span className="font-mono font-bold">10k</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-50 pb-1.5">
                        <span className="font-semibold text-stone-800">Chic Charms & Crystals</span>
                        <span className="font-mono font-bold">5-50k</span>
                      </div>
                      <div className="flex justify-between col-span-2 pt-3 border-t border-stone-100 bg-stone-50/50 p-2.5 rounded">
                        <span className="font-bold text-stone-900">Full Set Options & Bundle *</span>
                        <span className="font-mono font-black text-amber-800">200k</span>
                      </div>
                    </div>
                  </div>

                  {/* Design of the Month */}
                  <div className="bg-stone-900 text-stone-100 p-6 rounded-xl shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/10 rounded-full blur-xl"></div>
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 border border-amber-400/40 px-2.5 py-1 rounded inline-block mb-3.5 font-bold">Premium Art</span>
                    <h3 className="text-lg font-serif font-black tracking-wide">Design Of The Month</h3>
                    <p className="text-[11px] text-stone-400 uppercase tracking-widest font-bold mt-1">Yuju's highly recommended artistic concepts for the current season</p>
                    <div className="mt-5 flex justify-center items-center gap-1.5 flex-wrap">
                      {['500k', '600k', '700k', '800k', '900k'].map((price, i) => (
                        <div key={i} className="bg-stone-800 text-stone-200 border border-stone-700 font-mono text-xs font-bold px-3 py-1.5 rounded-sm">
                          {price}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Brand Notes */}
            <div className="mt-12 bg-white/40 p-4 border border-stone-200/60 rounded text-center text-[11px] text-stone-500 space-y-1 font-sans">
              <p className="font-bold">* All prices are in VND (000's) | Prices include service charge and VAT. No hidden fee.</p>
              <p className="text-[10.5px] leading-relaxed font-semibold">Get 1 free round-trip transfer anywhere in Phu Quoc. When booking a VIP course for 2 or more guests, safe and comfortable transport is provided from the airport or any local resort to our spa, or from the spa back to your resort. (Secure luggage storage is fully included)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- AESTHETIC MOMENTS GALLERY ----------------- */}
      <section id="gallery" className="py-24 bg-[#FAF9F5] border-t border-stone-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-stone-900">Aesthetic Moments</h2>
            <p className="text-[11px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">A visual journal of Yuju Spa's inviting ambiance and interior details</p>
            <div className="w-12 h-[1px] bg-amber-300 mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { src: "images/매장6-1.JPG", title: "Kids & Family Care Corner" },
              { src: "images/매장6-2.JPG", title: "Sterilized Clean Linen Station" },
              { src: "images/KO4_0209.JPG", title: "Signature Botanical Herbals" },
              { src: "images/매장.JPG", title: "Golden Sanctuary Lobby" },
              { src: "images/매장6-3.JPG", title: "Sensory Lightings & Pathways" },
              { src: "images/매장9.JPG", title: "Cozy Relaxation Space" },
              { src: "images/매장10.JPG", title: "Private Premium Shower Area" },
              { src: "images/매장7.JPG", title: "Pristine Luxury Spa Bed" },
              { src: "images/매장8.JPG", title: "Symmetrical Zen Interior" },
              { src: "images/매장2.JPG", title: "Premium Therapy Suite" },
              { src: "images/KO4_1080.JPG", title: "Carefully Selected Amenities" },
              { src: "images/KO4_1157.JPG", title: "Warm Aromatic Touch" },
              { src: "images/KO4_1173.JPG", title: "Natural Floral Oils" }
            ].map((pic, idx) => (
              <div key={idx} className="bg-white border border-stone-200/80 p-2.5 rounded-xl shadow-xs hover:shadow-md hover:border-amber-500/20 transition-all duration-300 group">
                <div className="overflow-hidden rounded-lg relative aspect-[4/3] w-full bg-stone-100">
                  <SafeImage 
                    src={pic.src} 
                    alt={pic.title} 
                    fallbackKey="shopExterior"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5">
                    <span className="text-[10px] text-white font-sans font-bold uppercase tracking-wider bg-stone-950/85 px-2.5 py-1.5 rounded">
                      {pic.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- NAIL ART PORTFOLIO SECTION ----------------- */}
      <section id="nail" className="py-24 bg-[#FAF7F2] border-t border-stone-200/80 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block p-3.5 bg-amber-55 rounded-full text-amber-800 mb-4 border border-amber-900/5">
            <Instagram className="w-8 h-8 text-amber-800" />
          </div>
          <h2 className="text-3xl font-serif text-stone-900">Nail Art Portfolio</h2>
          <p className="text-[11px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">@yuju.nail_phuquoc</p>
          <div className="w-12 h-[1px] bg-amber-400 mx-auto mt-3 mb-10"></div>
          
          {/* Elfsight Instagram Feed Live Widget */}
          <div className="w-full bg-white border border-stone-200/80 shadow-2xl p-4 md:p-6 rounded-xl flex justify-center items-center">
            {/* Elfsight Instagram Feed | 1 */}
            <div className="elfsight-app-3f91e9c2-8f8e-4588-944b-58ed05d63454 w-full flex justify-center" data-elfsight-app-lazy="true"></div>
          </div>
          
          <div className="mt-8">
            <a 
              href="https://www.instagram.com/yuju.nail_phuquoc/reels/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 shadow-md"
            >
              Follow on Instagram Reels
              <ExternalLink className="w-3.5 h-3.5 text-stone-100" />
            </a>
          </div>
        </div>
      </section>

      {/* ----------------- FAQ (FREQUENTLY ASKED QUESTIONS) ACCORDION ----------------- */}
      <section id="faq" className="py-24 bg-[#FAF9F6] border-t border-stone-200/80 scroll-mt-16 text-left">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-stone-900">Frequently Asked Questions</h2>
            <p className="text-[11px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">YUJU SPA Guide</p>
            <div className="w-12 h-[1px] bg-amber-400 mx-auto mt-3"></div>
            <p className="text-stone-500 text-xs mt-4">Find answers to the most common questions our guests ask before visiting YUJU SPA.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What are the rules for free resort/airport pickup & drop-off?",
                a: "When booking a 90-minute or longer therapy for 2 or more adult guests, 1 complimentary pickup or drop-off transfer can be selected for Phu Quoc Airport as well as all central, southern, and northern regions of the island."
              },
              {
                q: "Is the therapist tip included in the price?",
                a: "Yes! All premium thermal spa packages at YUJU SPA include therapist service tips transparently. There is absolutely no extra pressure or obligation to pay separate tips."
              },
              {
                q: "Can I store my heavy luggage here for free on my checkout day?",
                a: "Absolutely! We offer complimentary luggage storage service for our guests during our operational hours. Store your heavy bags safely with our concierge and explore Phu Quoc with absolute comfort."
              },
              {
                q: "Are shower rooms available and is it free?",
                a: "Yes! Fully-equipped, hygienic separate male/female shower complexes are provided for your fresh feeling. Free towels, organic shampoos, and body washes are always ready for you."
              },
              {
                q: "Can I make a reservation for the same day?",
                a: "Yes, you can request same-day reservations subject to slot availability. However, to secure your preferred time slots, we recommend booking 1-2 days in advance!"
              }
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-xs hover:border-amber-500/20 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors cursor-pointer focus:outline-none"
                  >
                    <div className="pr-4">
                      <h3 className="font-semibold text-stone-850 text-[14px] sm:text-[15px] flex items-start gap-2.5">
                        <span className="text-amber-600 font-serif font-bold text-lg leading-none shrink-0">Q.</span>
                        <span>{item.q}</span>
                      </h3>
                    </div>
                    <div className="shrink-0 text-stone-400 p-1 bg-stone-50 rounded-lg">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-stone-100" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 bg-[#FAF9F6]/50 text-stone-650 text-sm leading-relaxed">
                      <div className="flex gap-2">
                        <span className="font-serif font-bold text-stone-400 shrink-0">A.</span>
                        <p className="text-stone-700 font-medium whitespace-pre-line">{item.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------- COMPREHENSIVE LOCATION SECTION WITH GOOGLE MAP ----------------- */}
      <section id="find-us" className="py-24 bg-white border-t border-stone-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div>
              <h2 className="text-3xl font-serif text-stone-900 mb-2">Find Us</h2>
              <p className="text-[11px] text-amber-500 uppercase tracking-widest font-extrabold mb-8">In the Heart of Phu Quoc</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-1">Spa Location Address</h4>
                  <p className="text-sm font-semibold text-stone-800 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#B5945F] shrink-0 mt-0.5" />
                    <span className="flex flex-col">
                      <span>99A Tran Hung Dao Road, Khu Pho 7, Phu Quoc Island, Kien Giang, Vietnam</span>
                      <a 
                        href="https://www.google.com/maps/place/YUJU+SPA+Phu+Quoc/@10.2026073,103.9652814,16z/data=!3m1!4b1!4m6!3m5!1s0x31a78d7724c83e09:0x288aa007498a6cb2!8m2!3d10.2040486!4d103.9644016!16s%2Fg%2F11v0j5grw7?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-800 hover:underline text-xs font-bold mt-1.5 flex items-center gap-1"
                      >
                        Get Premium Directions on Google Maps →
                      </a>
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-1">Direct Phone</h4>
                  <p className="text-sm font-mono font-bold text-stone-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#B5945F]" />
                    <a href="tel:+84978004100" className="hover:text-amber-800 transition-colors underline decoration-dotted">
                      +84 978 004 100
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-1">Salon Operating Hours</h4>
                  <p className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B5945F]" />
                    <span>Daily 06:00 AM – 12:00 Midnight (Open All Year, 365 Days)</span>
                  </p>
                </div>
              </div>
 
              <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col md:flex-row gap-4">
                <a 
                  href="https://wa.me/84978004100" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-4 px-4 text-center rounded flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  WhatsApp Inquiry
                </a>
                <a 
                  href="https://www.instagram.com/yuju.nail_phuquoc/reels/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider py-4 px-4 text-center rounded flex items-center justify-center gap-2 transition-opacity duration-300"
                >
                  Instagram DM
                </a>
                <a 
                  href="https://www.google.com/maps/place/YUJU+SPA+Phu+Quoc/@10.2026073,103.9652814,16z/data=!3m1!4b1!4m6!3m5!1s0x31a78d7724c83e09:0x288aa007498a6cb2!8m2!3d10.2040486!4d103.9644016!16s%2Fg%2F11v0j5grw7?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider py-4 px-4 text-center rounded flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  Google Maps
                </a>
              </div>
            </div>
 
            {/* Embedded map section */}
            <div className="w-full aspect-video lg:h-96 border border-stone-200 shadow-xl overflow-hidden bg-stone-50 rounded-xl relative">
              <iframe 
                src="https://maps.google.com/maps?q=YUJU%20SPA%20Phu%20Quoc&t=&z=16&ie=UTF-8&iwloc=&output=embed" 
                className="w-full h-full border-none"
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Yuju Spa Location Google Map"
              />
            </div>
          </div>
        </div>
      </section>
 
      {/* ----------------- SILENT PRISTINE FOOTER ----------------- */}
      <footer className="bg-stone-900 text-stone-500 text-[10px] uppercase tracking-widest py-14 text-center border-t border-stone-950">
        <p className="text-white font-serif text-sm mb-2 tracking-[0.15em]">YUJU SPA & NAIL Phu Quoc</p>
        <p className="mb-4">99A Tran Hung Dao Road, Khu Pho 7, Phu Quoc Island, Kien Giang, Vietnam | WhatsApp: +84 978 004 100</p>
        <p>© 2026 YUJU SPA. All Rights Reserved.</p>
      </footer>

      {/* ----------------- FLOATING CONTACT WIDGET ----------------- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Menu list, appears when isContactMenuOpen is true */}
        <div className={`transition-all duration-300 transform origin-bottom-right flex flex-col gap-3 mb-3 ${
          isContactMenuOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}>
          {/* Option 1: WhatsApp */}
          <a 
            href="https://wa.me/84978004100" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1"
          >
            <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">WhatsApp Inquiry</span>
            <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.519.99c-5.41 0-9.814 4.359-9.817 9.773-.002 1.902.51 3.721 1.481 5.347l-.95 3.466 3.593-.934c1.558.85 3.111 1.293 4.821 1.293zm9.057-7.113c-.247-.123-1.463-.722-1.692-.805-.229-.083-.396-.123-.562.124-.166.247-.645.805-.79 1.05-.145.247-.291.278-.538.155-.247-.123-1.043-.385-1.986-1.223-.733-.656-1.229-1.465-1.373-1.712-.145-.247-.016-.381.109-.504.111-.112.247-.29.371-.434.124-.145.166-.247.247-.412.083-.165.042-.31-.021-.434-.062-.124-.562-1.353-.77-1.85-.203-.491-.41-.424-.562-.431-.146-.007-.312-.008-.479-.008-.166 0-.437.062-.666.311-.229.248-.874.855-.874 2.083 0 1.228.895 2.415.992 2.548.096.136 1.761 2.69 4.269 3.774.597.257 1.063.411 1.425.526.6.19 1.144.163 1.576.099.48-.072 1.463-.598 1.671-1.175.208-.578.208-1.073.146-1.175-.062-.103-.229-.165-.476-.288z"/>
              </svg>
            </div>
          </a>

          {/* Option 2: Instagram DM */}
          <a 
            href="https://www.instagram.com/yuju.nail_phuquoc/reels/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1"
          >
            <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Instagram DM</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center shadow-sm">
              <Instagram className="w-5 h-5 text-white" />
            </div>
          </a>

          {/* Option 3: Google Maps */}
          <a 
            href="https://www.google.com/maps/place/YUJU+SPA+Phu+Quoc/@10.2026073,103.9652814,16z/data=!3m1!4b1!4m6!3m5!1s0x31a78d7724c83e09:0x288aa007498a6cb2!8m2!3d10.2040486!4d103.9644016!16s%2Fg%2F11v0j5grw7?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1"
          >
            <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Google Maps Route</span>
            <div className="w-9 h-9 rounded-full bg-[#4285F4] text-white flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </a>

          {/* Option 4: Call Direct */}
          <a 
            href="tel:+84978004100" 
            className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1"
          >
            <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Call Direct</span>
            <div className="w-9 h-9 rounded-full bg-[#B5945F] text-white flex items-center justify-center shadow-sm">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </a>
        </div>

        {/* Root Dial Toggle Button */}
        <button 
          onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform border border-amber-400 text-white cursor-pointer relative ${
            isContactMenuOpen 
              ? "bg-stone-900 rotate-180 hover:bg-stone-850" 
              : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 scale-100"
          }`}
          aria-label="Toggle contact menu"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
          {isContactMenuOpen ? (
            <X className="w-6 h-6 text-amber-100" />
          ) : (
            <Phone className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* ----------------- SOUND THERAPY & BGM PLAYER WIDGET ----------------- */}
      <div id="sound-therapy-bgm" className="fixed bottom-6 left-6 z-50 flex items-center font-sans">
        <button 
          onClick={handleToggleAudio}
          className={`h-11 rounded-full px-5 flex items-center gap-3 shadow-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
            isPlayingAudio 
              ? "bg-stone-900/95 border-amber-400/60 text-white" 
              : "bg-white/90 hover:bg-white border-stone-200/80 text-stone-800"
          }`}
          aria-label="Toggle Spa Sound Therapy"
        >
          {isPlayingAudio ? (
            <div className="flex gap-[2.5px] items-end h-3 w-3.5 shrink-0">
              <span className="w-[2.5px] bg-amber-400 rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.6s' }}></span>
              <span className="w-[2.5px] bg-amber-400 rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.4s' }}></span>
              <span className="w-[2.5px] bg-amber-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.8s' }}></span>
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-stone-400 animate-pulse shrink-0" />
          )}
          
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-wider leading-tight">
              {isPlayingAudio ? "Serene Healing Piano" : "Spa Sound Therapy"}
            </span>
            <span className="text-[8px] text-stone-400 uppercase tracking-widest font-mono font-medium leading-none mt-0.5">
              {isPlayingAudio ? "Serene Piano Hymn" : "Turn Music On"}
            </span>
          </div>

          <div className="ml-1 shrink-0">
            {isPlayingAudio ? (
              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full font-serif shrink-0 border border-amber-400/30">
                PLAYING
              </span>
            ) : (
              <span className="text-[9px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-serif shrink-0">
                OFF
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

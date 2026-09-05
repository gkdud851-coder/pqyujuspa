import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';

// ----------------------------------------------------
// DUAL RESOLUTION FOR USER IMAGES & VIDEOS
// Supports both public/images/* and src/images/*
// ----------------------------------------------------
const srcImages = (import.meta as any).glob('/src/images/*.{png,jpg,jpeg,JPG,JPEG,PNG,webp,WEBP}', { eager: true, import: 'default' });
const srcVideos = (import.meta as any).glob('/src/images/*.{mp4,MP4,mov,MOV,webm,WEBM,m4v,M4V}', { eager: true, import: 'default' });

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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<'spa' | 'nail' | null>(null);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState<'spa' | 'nail'>('spa');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Sequential 3-video playlist (Video 1 -> Video 2 -> Video 3 -> Loop)
  const heroVideos = useMemo(() => [
    resolveVideo('images/메인영상.mp4'),
    '/video2.mp4',
    '/video3.mp4'
  ], []);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const handleVideoError = () => {
    if (heroVideos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }
  };

  // Ensure next video plays smoothly when switched
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled silently
      });
    }
  }, [currentVideoIndex]);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background music setup
  useEffect(() => {
    const audio = audioRef.current || (document.getElementById('bgm-audio-player') as HTMLAudioElement | null);
    if (!audio) return;

    audio.volume = 0.65;

    // Optional autoplay attempt on page load
    audio.play()
      .then(() => {
        setIsMusicPlaying(true);
      })
      .catch(() => {
        // Browser requires direct button click
        setIsMusicPlaying(false);
      });
  }, []);

  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const audio = audioRef.current || (document.getElementById('bgm-audio-player') as HTMLAudioElement | null);
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio playback error:", err);
          setIsMusicPlaying(false);
        });
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  // FAQ state (independent multi-toggle with zero latency)
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };



  // 10 Steps journey details
  const journeySteps = [
    {
      num: "01",
      icon: "🚗",
      title: "Resort & Airport Pickup",
      titleKo: "Complementary Island-wide Transfer (Choice of Pickup or Dropoff)",
      desc: "Get 1 complimentary single-trip transfer (Choice of Pickup OR Dropoff) anywhere in Phu Quoc. When booking a VIP course for 2 or more guests, we provide safe and comfortable transport from airport/resort to our spa, OR from our spa back to your resort/airport. (Includes secure luggage storage; choice of 1-way transfer only)",
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
    <div className="min-h-screen w-full bg-white flex justify-center selection:bg-amber-100 selection:text-amber-950 font-sans">
      <div 
        id="main-container" 
        className="w-full max-w-[480px] min-h-screen bg-[#FAF8F5] text-stone-800 antialiased relative shadow-2xl border-x border-stone-200/80 scroll-smooth overflow-x-hidden flex flex-col"
      >
      
      {/* ----------------- EXQUISITE HEADER NAV ----------------- */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <nav 
          id="nav-header" 
          className="w-full max-w-[480px] bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 pointer-events-auto transition-all duration-300 shadow-xs relative"
        >
          <div className="px-5 py-3.5 flex justify-between items-center">
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

            {/* Mobile hamburger menu */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-stone-850 hover:text-amber-850 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-stone-900" /> : <Menu className="w-6 h-6 text-stone-900" />}
            </button>
          </div>

          {/* Mobile slide down drawer */}
          {isMenuOpen && (
            <div className="border-t border-stone-200 bg-[#FAF8F5]/98 py-5 px-6 space-y-4 shadow-xl absolute w-full left-0 z-50 text-left">
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
      </div>

      {/* ----------------- DYNAMIC HERO BANNER WITH FULL-VIEW VIDEO ----------------- */}
      <section id="hero" className="w-full pt-[64px] bg-stone-950 flex flex-col scroll-mt-16">
        {/* Full Uncut 9:16 Video Player Container with Sequential Multi-Video Looping */}
        <div className="w-full relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
          <video 
            ref={videoRef}
            key={heroVideos[currentVideoIndex]}
            className="w-full h-full object-contain"
            src={heroVideos[currentVideoIndex]}
            autoPlay 
            muted
            playsInline
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />

          {/* Floating Glass Badge on Top-Left (Idea 3) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/40 shadow-md pointer-events-none">
            <span className="text-xs">🚗</span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                Free Transfer
              </span>
              <span className="text-[8px] text-stone-200/90 font-medium tracking-tight">
                Pickup or Drop-off
              </span>
            </div>
          </div>

          {/* Video Indicators for multiple clips */}
          {heroVideos.length > 1 && (
            <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-white/20 pointer-events-auto">
              {heroVideos.slice(0, 3).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentVideoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentVideoIndex ? "w-5 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Switch to clip ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Subtle bottom shadow overlay to transition nicely to the action area */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Action Buttons moved cleanly underneath the full video */}
        <div className="bg-stone-900 py-5 px-5 border-b border-stone-800 text-center">
          {/* Complimentary Transfer Highlight Banner (Idea 1) */}
          <div className="mb-3.5 px-3 py-2.5 bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-500/40 rounded-lg flex items-center justify-center gap-2.5 shadow-sm">
            <span className="text-lg flex-shrink-0">🚗</span>
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-300">
                Free Island-Wide Transfer
              </span>
              <span className="text-[9px] sm:text-[9.5px] text-stone-300 font-medium tracking-tight">
                Complimentary Pickup or Drop-off anywhere in Phu Quoc (Airport & Resorts)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => setIsContactMenuOpen(true)}
              className="w-full bg-amber-700 hover:bg-amber-850 text-white py-3.5 px-4 rounded-xs font-bold tracking-wider text-xs uppercase text-center transition shadow-lg cursor-pointer"
            >
              Real-time Booking & Inquiries
            </button>
            <a 
              href="#services" 
              className="w-full bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 py-3.5 px-4 rounded-xs font-bold tracking-wider text-xs uppercase text-center backdrop-blur-sm transition shadow-sm"
            >
              Explore Spa Menu
            </a>
          </div>
        </div>
      </section>

      {/* ----------------- CORE BRAND STATS GRID (Idea 4: Transfer 1st place) ----------------- */}
      <section className="py-10 bg-white border-y border-stone-200/60">
        <div className="px-4 grid grid-cols-3 gap-y-6 gap-x-2 text-center">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1.5">🚗</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900">Free Transfer</h4>
            <p className="text-[8px] text-amber-700 mt-0.5 uppercase font-bold">Pickup or Drop-off</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1.5">🚿</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900">Shower</h4>
            <p className="text-[8px] text-stone-550 mt-0.5 uppercase font-semibold">Full Facilities</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1.5">🧳</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900">Luggage</h4>
            <p className="text-[8px] text-stone-550 mt-0.5 uppercase font-semibold">Free Storage</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1.5">👶</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900">Kids & Pregnant</h4>
            <p className="text-[8px] text-stone-550 mt-0.5 uppercase font-semibold">Special Care</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1.5">✨</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900">Hygiene</h4>
            <p className="text-[8px] text-stone-550 mt-0.5 uppercase font-semibold">1:1 Towel & Tub</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1.5">💝</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900">Charity Fund</h4>
            <p className="text-[8px] text-stone-550 mt-0.5 uppercase font-semibold">Kids & Relief</p>
          </div>
        </div>
      </section>

      {/* ----------------- NATIVE PREMIUM ARCHITECTURAL FLOOR LAYOUT (AMBIANCE) ----------------- */}
      <section id="ambiance" className="py-20 px-5 scroll-mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif tracking-tight text-stone-900 font-medium h2" id="our-space-title">Our Space</h2>
          <p className="text-[10.5px] text-amber-700 uppercase tracking-widest font-extrabold mt-2 font-sans">Elegantly Appointed Multi-Floor Healing Ambiance</p>
          <div className="w-12 h-[1px] bg-amber-300 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col gap-6">
          {/* 1F Zone Card */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="h-56 overflow-hidden relative">
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
            <div className="p-5 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 mb-1.5">Premium Spa & Nail Salon</h3>
                <p className="text-[10px] text-[#B5945F] font-bold uppercase tracking-wider mb-2.5">1F Spa Reception & Luxury Nail Boutique</p>
                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                  Blending warm aesthetics with comfort, the first floor features our sophisticated nail art bar, private 1-on-1 care rooms, a secure luggage storage zone, and separate private hot shower facilities for you to refresh before or after your treatment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex gap-1.5 flex-wrap text-[9.5px] uppercase font-bold text-stone-500">
                <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-150">Main Lobby</span>
                <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-150">Nail Bar</span>
                <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-150">Shower Rooms</span>
              </div>
            </div>
          </div>

          {/* 2F Zone Card */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="h-56 overflow-hidden relative">
              <StepImageSlider 
                images={["images/카페1.JPG", "images/카페2.JPG"]} 
                alt="2F Vacation Cafe" 
                fallbackKey="shopRoom"
              />
              <div className="absolute top-4 left-4 bg-amber-700/95 text-white text-xs font-sans font-extrabold px-3 py-1.5 rounded-md tracking-wider z-20">
                2F
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 mb-1.5">Vacation Cafe & Lounge</h3>
                <p className="text-[10px] text-[#B5945F] font-bold uppercase tracking-wider mb-2.5">2F Private Resort Cafe & Waiting Lounge</p>
                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                   Basking in gentle natural light, the second-floor lounge features custom artisan furniture and tropical decorations—a relaxing retreat for companions and guests waiting for transfer services. Waiting guests are treated to refreshing cold welcome beverages.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex gap-1.5 flex-wrap text-[9.5px] uppercase font-bold text-stone-500">
                <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-150">Relaxation Lounge</span>
                <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-150">Welcome Drink</span>
                <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-150">Luggage Zone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SIGNATURE JOURNEY (11 STEPS) ----------------- */}
      <section id="journey" className="py-20 bg-stone-50 border-y border-stone-200/80 scroll-mt-16">
        <div className="px-5">
          <div className="text-center mb-12">
            <h2 className="text-2.5xl font-serif tracking-tight text-stone-900">The Signature 11-Step Journey</h2>
            <p className="text-[10.5px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">Yuju Spa's Signature 11-Step Luxury Healing & Restorative Journey</p>
            <div className="w-12 h-[1px] bg-amber-400/80 mx-auto mt-3"></div>
          </div>
          
          <div className="flex flex-col gap-6">
            {journeySteps.map((step, idx) => (
              <div 
                key={idx} 
                className="group bg-white p-5 border border-stone-200 rounded-lg flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg transition-all duration-300 pointer-events-auto"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-3xl font-serif italic text-amber-700/30 font-bold">{step.num}</span>
                    <div className="text-2xl">{step.icon}</div>
                  </div>
                  <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-[#B5945F] mb-1">{step.title}</h3>
                  <h4 className="text-sm font-bold text-stone-900 mb-2">{step.titleKo}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4 font-semibold">{step.desc}</p>
                </div>
                <div className="w-full aspect-[4/3] bg-stone-100 rounded overflow-hidden relative group-hover:scale-[1.01] transition-transform">
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
      <section id="services" className="py-20 bg-[#FAF9F6] scroll-mt-16 border-t border-stone-200/40">
        <div className="px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-stone-900 tracking-tight font-medium">Service Menu</h2>
            <p className="text-[10.5px] text-amber-700 uppercase tracking-widest font-extrabold mt-2 font-sans">Aesthetic Spa Treatments & Professional Nail Art</p>
            <div className="w-12 h-[1px] bg-amber-300 mx-auto mt-3"></div>
          </div>

          {/* Premium Minimal Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200/60 shadow-3xs w-full max-w-xs">
              <button 
                onClick={() => setActiveServiceTab('spa')}
                className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeServiceTab === 'spa' 
                    ? "bg-stone-900 text-amber-100 shadow-sm" 
                    : "text-stone-500 hover:text-stone-850"
                }`}
              >
                Yuju Spa Menu
              </button>
              <button 
                onClick={() => setActiveServiceTab('nail')}
                className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
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
              <div className="flex flex-col gap-6 items-stretch">
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
              <div className="flex flex-col gap-6 items-start w-full">
                
                {/* Left Column: Basic Care & Value Combos */}
                <div className="space-y-6 w-full">
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
                <div className="space-y-6 w-full">
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
              <p className="text-[10.5px] leading-relaxed font-semibold">Get 1 complimentary single-trip transfer (Choice of Pickup OR Dropoff) anywhere in Phu Quoc. When booking a VIP course for 2 or more guests, safe and comfortable transport is provided from airport/resort to spa, OR from spa back to resort/airport. (Secure luggage storage is fully included; 1-way transfer choice of either pickup or dropoff is provided per booking)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- AESTHETIC MOMENTS GALLERY ----------------- */}
      <section id="gallery" className="py-20 bg-[#FAF9F5] border-t border-stone-200/80 scroll-mt-16">
        <div className="px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900">Aesthetic Moments</h2>
            <p className="text-[10.5px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">A visual journal of Yuju Spa's inviting ambiance and interior details</p>
            <div className="w-12 h-[1px] bg-amber-300 mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
      <section id="nail" className="py-20 bg-[#FAF7F2] border-t border-stone-200/80 scroll-mt-16">
        <div className="px-5 text-center">
          <div className="inline-block p-3 bg-amber-55 rounded-full text-amber-800 mb-3 border border-amber-900/5">
            <Instagram className="w-6 h-6 text-amber-800" />
          </div>
          <h2 className="text-3xl font-serif text-stone-900">Nail Art Portfolio</h2>
          <p className="text-[10.5px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">@yuju.nail_phuquoc</p>
          <div className="w-12 h-[1px] bg-amber-400 mx-auto mt-3 mb-8"></div>
          
          {/* Elfsight Instagram Feed Live Widget */}
          <div className="w-full bg-white border border-stone-200/80 shadow-lg p-3 rounded-xl flex justify-center items-center">
            {/* Elfsight Instagram Feed | 1 */}
            <div className="elfsight-app-3f91e9c2-8f8e-4588-944b-58ed05d63454 w-full flex justify-center" data-elfsight-app-lazy="true"></div>
          </div>
          
          <div className="mt-6">
            <a 
              href="https://www.instagram.com/yuju.nail_phuquoc/reels/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 shadow-md rounded"
            >
              Follow on Instagram Reels
              <ExternalLink className="w-3.5 h-3.5 text-stone-100" />
            </a>
          </div>
        </div>
      </section>

      {/* ----------------- FAQ (FREQUENTLY ASKED QUESTIONS) ACCORDION ----------------- */}
      <section id="faq" className="py-20 bg-[#FAF9F6] border-t border-stone-200/80 scroll-mt-16 text-left">
        <div className="px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900">Frequently Asked Questions</h2>
            <p className="text-[10.5px] text-amber-700 uppercase tracking-widest font-extrabold mt-2">YUJU SPA Guide</p>
            <div className="w-12 h-[1px] bg-amber-400 mx-auto mt-3"></div>
            <p className="text-stone-500 text-xs mt-3">Find answers to the most common questions our guests ask before visiting YUJU SPA.</p>
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
              const isOpen = openFaqIndices.includes(idx);
              return (
                <div 
                  key={idx} 
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFaq(idx);
                    }
                  }}
                  className={`w-full bg-white border transition-all duration-200 rounded-xl overflow-hidden shadow-xs cursor-pointer select-none touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500/20 relative z-10 ${
                    isOpen ? "border-amber-400/60 shadow-sm ring-1 ring-amber-400/20" : "border-stone-200/90 hover:border-amber-400/50 hover:shadow-sm"
                  }`}
                >
                  <div
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors pointer-events-none"
                  >
                    <div className="pr-4 pointer-events-none">
                      <h3 className="font-semibold text-stone-850 text-[14px] sm:text-[15px] flex items-start gap-2.5 pointer-events-none">
                        <span className="text-amber-600 font-serif font-bold text-lg leading-none shrink-0">Q.</span>
                        <span className="leading-snug">{item.q}</span>
                      </h3>
                    </div>
                    <div className="shrink-0 text-stone-400 p-1.5 bg-stone-50 rounded-lg transition-colors pointer-events-none">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                    </div>
                  </div>
                  
                  <div 
                    className={`grid transition-[grid-template-rows] duration-200 ease-out pointer-events-none ${
                      isOpen ? "grid-rows-[1fr] border-t border-stone-100" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden min-h-0 pointer-events-none">
                      <div className="p-5 sm:p-6 bg-[#FAF9F6]/70 hover:bg-[#FAF9F6] text-stone-650 text-sm leading-relaxed transition-colors pointer-events-none">
                        <div className="flex gap-2.5 items-start pointer-events-none">
                          <span className="font-serif font-bold text-amber-700 shrink-0 text-base">A.</span>
                          <p className="text-stone-700 font-medium whitespace-pre-line text-[13.5px] sm:text-sm">{item.a}</p>
                        </div>
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
      <section id="find-us" className="py-20 bg-white border-t border-stone-200/80 scroll-mt-16">
        <div className="px-5">
          <div className="flex flex-col gap-8 text-left">
            <div>
              <h2 className="text-3xl font-serif text-stone-900 mb-1.5">Find Us</h2>
              <p className="text-[10.5px] text-amber-500 uppercase tracking-widest font-extrabold mb-6">In the Heart of Phu Quoc</p>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-stone-400 mb-1">Spa Location Address</h4>
                  <p className="text-xs font-semibold text-stone-800 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#B5945F] shrink-0 mt-0.5" />
                    <span className="flex flex-col">
                      <span>99A Tran Hung Dao Road, Khu Pho 7, Phu Quoc Island, Kien Giang, Vietnam</span>
                      <a 
                        href="https://www.google.com/maps/place/YUJU+SPA+Phu+Quoc/@10.2026073,103.9652814,16z/data=!3m1!4b1!4m6!3m5!1s0x31a78d7724c83e09:0x288aa007498a6cb2!8m2!3d10.2040486!4d103.9644016!16s%2Fg%2F11v0j5grw7?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-800 hover:underline text-xs font-bold mt-1 flex items-center gap-1"
                      >
                        Directions on Google Maps →
                      </a>
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-stone-400 mb-1">Direct Phone</h4>
                  <p className="text-xs font-mono font-bold text-stone-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#B5945F]" />
                    <a href="tel:+84978004100" className="hover:text-amber-800 transition-colors underline decoration-dotted">
                      +84 978 004 100
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-stone-400 mb-1">Salon Operating Hours</h4>
                  <p className="text-xs font-semibold text-stone-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B5945F]" />
                    <span>Daily 06:00 AM – 12:00 Midnight (365 Days)</span>
                  </p>
                </div>
              </div>
 
              <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col gap-2.5">
                <a 
                  href="https://wa.me/84978004100" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 text-center rounded flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  WhatsApp Inquiry
                </a>
                <a 
                  href="https://www.instagram.com/yuju.nail_phuquoc/reels/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 text-center rounded flex items-center justify-center gap-2 transition-opacity duration-300"
                >
                  Instagram DM
                </a>
                <a 
                  href="https://www.google.com/maps/place/YUJU+SPA+Phu+Quoc/@10.2026073,103.9652814,16z/data=!3m1!4b1!4m6!3m5!1s0x31a78d7724c83e09:0x288aa007498a6cb2!8m2!3d10.2040486!4d103.9644016!16s%2Fg%2F11v0j5grw7?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 text-center rounded flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  Google Maps
                </a>
              </div>
            </div>
 
            {/* Embedded map section */}
            <div className="w-full h-72 border border-stone-200 shadow-md overflow-hidden bg-stone-50 rounded-xl relative">
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

      {/* Backdrop overlay when contact menu is open */}
      {isContactMenuOpen && (
        <div 
          onClick={() => setIsContactMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] pointer-events-auto"
        />
      )}

      {/* ----------------- FLOATING CONTACT & AUDIO WIDGET ----------------- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none z-50 flex justify-end px-4">
        <div className="pointer-events-none flex flex-col items-end gap-2.5">
          {/* Menu list, appears only when isContactMenuOpen is true to avoid invisible click blocking */}
          {isContactMenuOpen && (
            <div className="flex flex-col gap-3 mb-2 pointer-events-auto">
              {/* Option 1: WhatsApp */}
              <a 
                href="https://wa.me/84978004100" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1 pointer-events-auto cursor-pointer"
              >
                <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">WhatsApp Inquiry</span>
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.519.99c-5.41 0-9.814 4.359-9.817 9.773-.002 1.902.51 3.721 1.481 5.347l-.95 3.466 3.593-.934c1.558.85 3.111 1.293 4.821 1.293zm9.057-7.113c-.247-.123-1.463-.722-1.692-.805-.229-.083-.396-.123-.562.124-.166.247-.645.805-.79 1.05-.145.247-.291.278-.538.155-.247-.123-1.043-.385-1.986-1.223-.733-.656-1.229-1.465-1.373-1.712-.145-.247-.016-.381.109-.504.111-.112.247-.29.371-.434.124-.145.166-.247.247-.412.083-.165.042-.31-.021-.434-.062-.124-.562-1.353-.77-1.85-.203-.491-.41-.424-.562-.431-.146-.007-.312-.008-.479-.008-.166 0-.437.062-.666.311-.229.248-.874.855-.874 2.083 0 1.228.895 2.415.992 2.548.096.136 1.761 2.69 4.269 3.774.597.257 1.063.411 1.425.526.6.19 1.144.163 1.576.099.48-.072 1.463-.598 1.671-1.175.208-.578.208-1.073.146-1.175-.062-.103-.229-.165-.476-.288z"/>
                  </svg>
                </div>
              </a>

              {/* Option 2: Spa Instagram DM */}
              <a 
                href="https://www.instagram.com/yuju.spa_phuquoc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1 pointer-events-auto cursor-pointer"
              >
                <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Spa Instagram DM</span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center shadow-sm">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </a>

              {/* Option 3: Nail Instagram DM */}
              <a 
                href="https://www.instagram.com/yuju.nail_phuquoc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1 pointer-events-auto cursor-pointer"
              >
                <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Nail Instagram DM</span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center shadow-sm">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </a>

              {/* Option 4: Google Maps */}
              <a 
                href="https://www.google.com/maps/place/YUJU+SPA+Phu+Quoc/@10.2026073,103.9652814,16z/data=!3m1!4b1!4m6!3m5!1s0x31a78d7724c83e09:0x288aa007498a6cb2!8m2!3d10.2040486!4d103.9644016!16s%2Fg%2F11v0j5grw7?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1 pointer-events-auto cursor-pointer"
              >
                <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Google Maps Route</span>
                <div className="w-9 h-9 rounded-full bg-[#4285F4] text-white flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </a>

              {/* Option 5: Call Direct */}
              <a 
                href="tel:+84978004100" 
                className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-850 px-4 py-3 rounded-full shadow-lg border border-stone-200/80 transition-all duration-300 group hover:-translate-x-1 pointer-events-auto cursor-pointer"
              >
                <span className="text-xs font-bold font-serif whitespace-nowrap text-stone-800">Call Direct</span>
                <div className="w-9 h-9 rounded-full bg-[#B5945F] text-white flex items-center justify-center shadow-sm">
                  <Phone className="w-4 h-4 text-white" />
                </div>
              </a>
            </div>
          )}

          {/* Root Dial Toggle Button */}
          <button 
            onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
            className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform border border-amber-400 text-white cursor-pointer relative ${
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

          {/* Music Play/Pause Toggle Button with clean international UI */}
          <button
            id="music-toggle-btn"
            onClick={toggleMusic}
            className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border cursor-pointer relative ${
              isMusicPlaying
                ? "bg-gradient-to-tr from-amber-600 to-amber-500 text-white border-amber-300 shadow-amber-900/40 scale-100 ring-2 ring-amber-400/30"
                : "bg-stone-900/95 text-stone-400 border-stone-700 hover:text-white hover:bg-stone-800 hover:border-amber-500/50"
            }`}
            aria-label={isMusicPlaying ? "Turn music off" : "Turn music on"}
            title={isMusicPlaying ? "Turn music off" : "Turn music on"}
          >
            {isMusicPlaying ? (
              <Volume2 className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-400" />
            )}
          </button>
        </div>

        {/* Persistent Audio Player */}
        <audio
          id="bgm-audio-player"
          ref={audioRef}
          src="/bgm.mp3"
          loop
          preload="auto"
          playsInline
          onPlay={() => setIsMusicPlaying(true)}
          onPause={() => setIsMusicPlaying(false)}
        />
      </div>


      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { 
  Lock, 
  Unlock, 
  Heart, 
  Music, 
  Play, 
  Pause, 
  RefreshCw, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Volume2,
  VolumeX
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Import generated assets
import memory2Img from "@assets/generated_images/plate_of_french_fries_diner_style.png";
import finalHeartImg from "@assets/generated_images/glowing_heart_with_kiss_mark.png";
import coupleImage from "@assets/generated_images/romantic_couple_holding_hands_at_sunset.png";

// Import user uploaded assets
import realMemory1Img from "@assets/IMG_5660_1765005300159.jpg";
import realMemory3Img from "@assets/IMG_1208_1765005089160.jpg";
import proposalImage from "@assets/IMG_1114.jpg";
import finalSong from "@assets/final_song.mp3";
import backgroundSong from "@assets/Le Aaunga.mp3";

// Memory Slider Images
import featuredMemoryImg from "@assets/IMG_1208_1765005089160.jpg";
import memoryImg1 from "@assets/IMG_1114.jpg";
import memoryImg2 from "@assets/IMG_1157.jpg";
import memoryImg3 from "@assets/IMG_1503_1765005300158.JPG";
import memoryImg4 from "@assets/IMG_1505_1765005300158.JPG";
import memoryImg5 from "@assets/IMG_2593.jpg";
import memoryImg6 from "@assets/IMG_3234.jpg";
import memoryImg7 from "@assets/IMG_4881_1765005300158.jpg";
import memoryImg8 from "@assets/IMG_5660_1765005300159.jpg";
import memoryImg9 from "@assets/IMG_7330.jpg";
import memoryImg10 from "@assets/IMG_1795_1765005300158.JPG";

// Helper function to ensure base path is applied to image URLs
function getImageUrl(imgPath: string): string {
  const base = import.meta.env.BASE_URL || "/";
  
  // If base is "/", no need to modify
  if (base === "/") {
    return imgPath.startsWith("/") ? imgPath : "/" + imgPath;
  }
  
  // Normalize base (ensure it ends with /)
  const normalizedBase = base.endsWith("/") ? base : base + "/";
  
  // If path already includes base, return as is
  if (imgPath.startsWith(normalizedBase)) {
    return imgPath;
  }
  
  // If path starts with /, remove it and prepend base
  if (imgPath.startsWith("/")) {
    return normalizedBase + imgPath.slice(1);
  }
  
  // Otherwise, it's relative, prepend base
  return normalizedBase + imgPath;
}

// Memory Slider Images
const sliderImages = [
  getImageUrl(memoryImg1),
  getImageUrl(memoryImg2),
  getImageUrl(memoryImg3),
  getImageUrl(memoryImg4),
  getImageUrl(memoryImg5),
  getImageUrl(memoryImg6),
  getImageUrl(memoryImg7),
  getImageUrl(memoryImg8),
  getImageUrl(memoryImg9),
  getImageUrl(memoryImg10)
];

type Puzzle = {
  id: number;
  type: string;
  level: number;
  question: string;
  hint: string;
  answer: string;
  successMessage: string;
  errorMessage: string;
  memory: {
    title: string;
    note: string;
    caption: string;
    image: string;
    song: string;
  };
};

const puzzles: Puzzle[] = [
  {
    id: 1,
    type: "Memory Riddle",
    level: 1,
    question: "Our story has many days, but do you remember the exact month we first met?",
    hint: "Think of the month when your life got a little softer.",
    answer: "april",
    successMessage: "Perfect. You really do pay attention.",
    errorMessage: "Close, but not quite. Try what we actually say / do, not the formal version 😉",
    memory: {
      title: "LOVE NOTE",
      note: "The day I met you, life secretly changed its favorite color to your smile. I didn't know it then, but every ordinary moment after that started to feel a little bit magical.",
      caption: "The start of \"us\". I still get butterflies.",
      image: getImageUrl(realMemory1Img),
      song: "Our Beginning",
    },
  },
  {
    id: 2,
    type: "Habit Riddle",
    level: 2,
    question: "What colour shirt i wore on out first meet?",
    hint: "No hint, just answer.",
    answer: "Black",
    successMessage: "Haha,Good janneman",
    errorMessage: "Nope!",
    memory: {
      title: "Our First Meet",
      note: "I pretended to be annoyed, but honestly? Watching you happily munch on my fries is my favorite view. I'd order extra just to see you smile like that.",
      caption: "Our First Meet",
      image: getImageUrl(proposalImage),
      song: "Our First Meet",
    },
  },
  {
    id: 3,
    type: "Heart Question",
    level: 3,
    question: "Where did we go on our first date?",
    hint: "Temple",
    answer: "iskon",
    successMessage: "Good janneman",
    errorMessage: "Nope!",
    memory: {
      title: "Our First Date",
      note: "The day i met you",
      caption: "Our First Date",
      image: getImageUrl(realMemory3Img),
      song: "Our First Date",
    },
  },
];

export default function PuzzleFlow() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  
  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });

  const currentPuzzle = puzzles[currentPuzzleIndex];

  // Play background song when component mounts
  useEffect(() => {
    if (backgroundAudioRef.current && !showFinal) {
      backgroundAudioRef.current.play().catch(e => console.log("Background autoplay prevented:", e));
    }
  }, []);

  // Stop background song when final page shows
  useEffect(() => {
    if (showFinal && backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
  }, [showFinal]);

  useEffect(() => {
    if (showFinal && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      setIsPlaying(true);
      
      // Stop audio after 60 seconds
      const stopTimer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }, 60000); // 60 seconds

      return () => {
        clearTimeout(stopTimer);
      };
    }
  }, [showFinal]);

  const handleUnlock = () => {
    if (input.toLowerCase().trim() === currentPuzzle.answer.toLowerCase()) {
      setStatus("success");
      setTimeout(() => setIsUnlocked(true), 800);
    } else {
      setStatus("error");
    }
  };

  const handleNext = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setIsUnlocked(false);
      setStatus("idle");
      setInput("");
      setIsPlaying(false);
      setTimeout(() => setCurrentPuzzleIndex((prev) => prev + 1), 300);
    } else {
      setShowFinal(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    setShowFinal(false);
    setCurrentPuzzleIndex(0);
    setIsUnlocked(false);
    setStatus("idle");
    setInput("");
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Restart background song
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.play().catch(e => console.log("Background autoplay prevented:", e));
    }
  };

  if (showFinal) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-12 text-center relative overflow-y-auto overflow-x-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-0 fixed" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0 fixed" />
        
        {/* Audio Element (Hidden but functional) */}
        <audio 
          ref={audioRef} 
          src={finalSong}
          onTimeUpdate={(e) => {
            const currentTime = e.currentTarget.currentTime;
            const duration = e.currentTarget.duration;
            // Cap progress at 60 seconds
            const maxTime = Math.min(60, duration || 60);
            setAudioProgress((currentTime / maxTime) * 100);
            
            // Auto-stop at 60 seconds
            if (currentTime >= 60) {
              e.currentTarget.pause();
              setIsPlaying(false);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 fixed">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary/20 rounded-full blur-xl"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%", 
                scale: Math.random() * 0.5 + 0.5 
              }}
              animate={{ 
                y: [null, Math.random() * -100],
                opacity: [0.2, 0.5, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ width: Math.random() * 200 + 50, height: Math.random() * 200 + 50 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-6 sm:gap-8 md:gap-12 pb-6 sm:pb-12 px-4">
          
          {/* Top Section: Featured Image in Heart Shape & Message */}
          <div className="flex flex-col items-center gap-8 w-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center"
            >
              {/* SVG Definitions for Heart Clip Path */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <clipPath id="heartClipPath" clipPathUnits="objectBoundingBox">
                    <path d="M0.5,0.9 C0.5,0.9 0.1,0.6 0.1,0.4 C0.1,0.25 0.25,0.15 0.5,0.3 C0.75,0.15 0.9,0.25 0.9,0.4 C0.9,0.6 0.5,0.9 0.5,0.9 Z" />
                  </clipPath>
                  <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 100, 150, 0.5)" />
                    <stop offset="50%" stopColor="rgba(255, 150, 200, 0.7)" />
                    <stop offset="100%" stopColor="rgba(255, 100, 150, 0.5)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Animated Heart Background */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-0"
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80"
                  style={{ 
                    filter: "drop-shadow(0 0 50px rgba(255, 100, 150, 1)) drop-shadow(0 0 100px rgba(255, 150, 200, 0.6))"
                  }}
                >
                  <path
                    d="M100,180 C100,180 20,120 20,80 C20,50 50,30 100,60 C150,30 180,50 180,80 C180,120 100,180 100,180 Z"
                    fill="url(#heartGradient)"
                    stroke="rgba(255, 120, 160, 1)"
                    strokeWidth="4"
                  />
                </svg>
              </motion.div>
              
              {/* Featured Image inside Heart */}
              <motion.div
                className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 z-10"
                style={{
                  clipPath: "url(#heartClipPath)",
                  WebkitClipPath: "url(#heartClipPath)",
                }}
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img 
                  src={getImageUrl(featuredMemoryImg)} 
                  alt="Our Special Memory" 
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </motion.div>

            <div className="space-y-6 w-full max-w-3xl">
              <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-300 px-4 py-1 text-xs tracking-widest uppercase">
                You Unlocked My Heart
              </Badge>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-handwriting font-bold leading-tight text-center"
                style={{ 
                  fontFamily: "'Dancing Script', 'Caveat', cursive",
                  color: "#7C2D3E",
                  textShadow: "2px 2px 4px rgba(255,255,255,0.8)"
                }}
              >
                I Love You,<br/><span className="text-pink-600 italic">Ruchu</span>
              </motion.h1>
              
              {/* Romantic Story Writeup */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-pink-200/50 shadow-xl"
              >
                <p 
                  className="text-base md:text-lg leading-relaxed font-handwriting text-center"
                  style={{ 
                    fontFamily: "'Dancing Script', 'Caveat', cursive",
                    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                    lineHeight: "1.8",
                    color: "#7C2D3E",
                    textShadow: "none"
                  }}
                >
                  It all began at the temple, where our paths first crossed. That day, something shifted in the universe, and I didn't know it then, but my life was about to change forever.
                </p>
                <p 
                  className="text-base md:text-lg leading-relaxed font-handwriting text-center mt-4"
                  style={{ 
                    fontFamily: "'Dancing Script', 'Caveat', cursive",
                    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                    lineHeight: "1.8",
                    color: "#7C2D3E",
                    textShadow: "none"
                  }}
                >
                  Our first dinner date was magical. I remember watching you smile, and thinking how lucky I was to be sitting across from you. Little did I know, this was just the beginning of our beautiful story.
                </p>
                <p 
                  className="text-base md:text-lg leading-relaxed font-handwriting text-center mt-4"
                  style={{ 
                    fontFamily: "'Dancing Script', 'Caveat', cursive",
                    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                    lineHeight: "1.8",
                    color: "#8B3A4D",
                    textShadow: "none"
                  }}
                >
                  Every day, dropping you from office to Electronic City became my favorite part of the day. Those drives weren't just about the destination—they were about the conversations, the laughter, the way you'd look at me, and how time seemed to stand still when we were together.
                </p>
                <p 
                  className="text-base md:text-lg leading-relaxed font-handwriting text-center mt-4"
                  style={{ 
                    fontFamily: "'Dancing Script', 'Caveat', cursive",
                    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                    lineHeight: "1.8",
                    color: "#8B3A4D",
                    textShadow: "none"
                  }}
                >
                  The drinks at Omu Bhaiya's house, those nightouts that turned into early mornings, the late-night walks where we'd talk about everything and nothing—each moment felt like a page from a love story I never knew I was writing.
                </p>
                <p 
                  className="text-base md:text-lg leading-relaxed font-handwriting text-center mt-4"
                  style={{ 
                    fontFamily: "'Dancing Script', 'Caveat', cursive",
                    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                    lineHeight: "1.8",
                    color: "#8B3A4D",
                    textShadow: "none"
                  }}
                >
                  Those midnight dosa runs, the theatre proposals that made my heart race, every small memory we've created together—they're not just moments, they're the building blocks of us. You solved every little puzzle, just like you solve my bad days with your smile.
                </p>
                <p 
                  className="text-base md:text-lg leading-relaxed font-handwriting text-center mt-4 font-bold"
                  style={{ 
                    fontFamily: "'Dancing Script', 'Caveat', cursive",
                    fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                    lineHeight: "1.8",
                    color: "#9B1A3A",
                    textShadow: "none"
                  }}
                >
                  Consider this a virtual kiss, a giant hug, and a promise: my heart is already yours.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Proposal Image Above Question */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="w-full max-w-md px-2"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-pink-200/50">
              <img 
                src={proposalImage} 
                alt="Our Proposal Moment" 
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: "center 30%",
                  transform: "scale(1.2)"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Proposal Section */}
          {!proposalAccepted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="w-full max-w-2xl space-y-4 sm:space-y-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-pink-200/50 shadow-2xl"
            >
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-handwriting text-center font-bold"
                style={{ 
                  fontFamily: "'Dancing Script', 'Caveat', cursive",
                  color: "#9B1A3A"
                }}
              >
                Will you marry me?
              </motion.h2>
              
              <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 relative w-full min-h-[100px] sm:min-h-[120px] overflow-hidden">
                {/* Yes Button - Fixed Position */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10"
                >
                  <Button
                    onClick={() => setProposalAccepted(true)}
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full shadow-lg min-h-[44px] min-w-[80px]"
                  >
                    Yes!
                  </Button>
                </motion.div>

                {/* No Button - Starts Beside Yes, Runs Away All Over Screen */}
                <motion.div
                  className="relative z-10"
                  style={{
                    x: noButtonPosition.x,
                    y: noButtonPosition.y,
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    // Run all over the screen when trying to touch
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const randomX = (Math.random() - 0.5) * screenWidth * 1.5;
                    const randomY = (Math.random() - 0.5) * screenHeight * 1.5;
                    setNoButtonPosition({ x: randomX, y: randomY });
                    
                    // Keep running away multiple times
                    setTimeout(() => {
                      const randomX2 = (Math.random() - 0.5) * screenWidth * 1.5;
                      const randomY2 = (Math.random() - 0.5) * screenHeight * 1.5;
                      setNoButtonPosition({ x: randomX2, y: randomY2 });
                    }, 200);
                    
                    setTimeout(() => {
                      const randomX3 = (Math.random() - 0.5) * screenWidth * 1.5;
                      const randomY3 = (Math.random() - 0.5) * screenHeight * 1.5;
                      setNoButtonPosition({ x: randomX3, y: randomY3 });
                    }, 400);
                  }}
                  onMouseEnter={() => {
                    // Move away when hovering (desktop)
                    const randomX = (Math.random() - 0.5) * window.innerWidth * 0.8;
                    const randomY = (Math.random() - 0.5) * window.innerHeight * 0.8;
                    setNoButtonPosition({ x: randomX, y: randomY });
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    // Run all over the screen when trying to click
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const randomX = (Math.random() - 0.5) * screenWidth * 1.5;
                    const randomY = (Math.random() - 0.5) * screenHeight * 1.5;
                    setNoButtonPosition({ x: randomX, y: randomY });
                    
                    // Keep running away multiple times
                    setTimeout(() => {
                      const randomX2 = (Math.random() - 0.5) * screenWidth * 1.5;
                      const randomY2 = (Math.random() - 0.5) * screenHeight * 1.5;
                      setNoButtonPosition({ x: randomX2, y: randomY2 });
                    }, 200);
                    
                    setTimeout(() => {
                      const randomX3 = (Math.random() - 0.5) * screenWidth * 1.5;
                      const randomY3 = (Math.random() - 0.5) * screenHeight * 1.5;
                      setNoButtonPosition({ x: randomX3, y: randomY3 });
                    }, 400);
                  }}
                  animate={{
                    x: noButtonPosition.x,
                    y: noButtonPosition.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full border-2 border-gray-300 cursor-pointer pointer-events-auto min-h-[44px] min-w-[80px] touch-none"
                  >
                    No
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Proposal Accepted Message */}
          {proposalAccepted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-full max-w-2xl space-y-4 bg-gradient-to-r from-pink-100 to-red-100 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border-2 border-pink-300 shadow-2xl"
            >
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-handwriting text-center font-bold"
                style={{ 
                  fontFamily: "'Dancing Script', 'Caveat', cursive",
                  color: "#9B1A3A"
                }}
              >
                You said Yes! Yesss! Yeee! 🎉
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl font-handwriting text-center"
                style={{ 
                  fontFamily: "'Dancing Script', 'Caveat', cursive",
                  color: "#7C2D3E"
                }}
              >
                Anyhow option nahi hai jaan! 😂<br/>
                I can't wait to spend forever with you!
              </motion.p>
            </motion.div>
          )}

          {/* Memory Slider Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-xl space-y-4 sm:space-y-6 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-white/10"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-serif font-medium text-white flex items-center gap-2" style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}>
                <Heart className="w-4 h-4 fill-pink-300 text-pink-300" /> Our Memories
              </h3>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
                <button onClick={toggleAudio} className="text-primary hover:text-primary-foreground transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${audioProgress}%` }} 
                  />
                </div>
                <button onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }} className="text-muted-foreground hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <Carousel 
              opts={{ align: "start", loop: true }} 
              plugins={[
                Autoplay({ delay: 6000, stopOnInteraction: false }) // ~6 seconds per image for 60 seconds total (10 images)
              ]}
              className="w-full"
            >
              <CarouselContent>
                {sliderImages.map((img, index) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/2 pl-2 sm:pl-4">
                    <div className="p-1">
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="flex aspect-[3/4] items-center justify-center p-0 overflow-hidden rounded-xl relative group">
                          <img 
                            src={img} 
                            alt={`Memory ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 sm:left-2 bg-black/50 border-none text-white hover:bg-primary h-8 w-8 sm:h-10 sm:w-10" />
              <CarouselNext className="right-1 sm:right-2 bg-black/50 border-none text-white hover:bg-primary h-8 w-8 sm:h-10 sm:w-10" />
            </Carousel>
            
            <p className="text-xs text-white/80 font-mono uppercase tracking-widest" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
              ♫ Playing: Our Final Song (60 seconds)
            </p>
          </motion.div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap justify-center gap-2">
            {["Real feelings", "Next: real date?"].map((tag, i) => (
              <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-6 w-full max-w-xs">
            <Button 
              onClick={restart}
              variant="outline" 
              className="w-full h-12 rounded-full border-primary/20 hover:bg-primary/5 text-primary transition-all duration-300 group"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Play again
            </Button>
            
            <p className="text-xs text-muted-foreground/60 font-mono uppercase tracking-widest">
              Forever your overdramatic coder, Vaibhav. 🫶
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-3 sm:p-4 md:p-8 max-w-6xl mx-auto overflow-x-hidden relative">
      {/* Background Audio Element - Plays throughout the game */}
      <audio 
        ref={backgroundAudioRef} 
        src={backgroundSong}
        loop
        autoPlay
      />

      {/* Header */}
      <header className="flex flex-col justify-center items-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-12 w-full px-2">
        <div className="w-full flex justify-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-handwriting font-bold text-primary flex items-center gap-2 sm:gap-3 text-center px-2"
            style={{ 
              fontFamily: "'Dancing Script', 'Caveat', cursive"
            }}
          >
            Vibhuti <span className="text-red-500">❤️</span> Ruchi
          </h1>
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-xs font-medium text-muted-foreground">
            Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
          </span>
          <div className="flex gap-1">
            {puzzles.map((p, i) => (
              <motion.div 
                key={p.id}
                className={cn(
                  "h-2 w-12 rounded-full transition-colors duration-500",
                  i < currentPuzzleIndex ? "bg-primary" : 
                  i === currentPuzzleIndex ? "bg-primary/60" : "bg-muted"
                )}
                layout
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-12 items-start flex-1 w-full">
        
        {/* Left Column: The Puzzle */}
        <motion.div
          key={`puzzle-${currentPuzzleIndex}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl shadow-primary/5 bg-white/80 dark:bg-card/50 backdrop-blur-sm overflow-hidden md:sticky md:top-8">
            <div className="h-2 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
            <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="font-mono text-xs tracking-wider uppercase">
                    {currentPuzzle.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Lvl {currentPuzzle.level}</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif leading-tight text-foreground">
                  "{currentPuzzle.question}"
                </h2>
                
                <div className="p-4 bg-secondary/30 rounded-lg border border-secondary">
                  <p className="text-sm text-muted-foreground italic flex gap-2">
                    <span className="font-bold not-italic text-primary">Hint:</span>
                    {currentPuzzle.hint}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                  Your Answer
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <Input 
                      placeholder="Type here, genius..." 
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && !isUnlocked && handleUnlock()}
                      disabled={isUnlocked}
                      className={cn(
                        "h-12 sm:h-14 text-base sm:text-lg transition-all duration-300 border-2 focus-visible:ring-0 focus-visible:border-primary",
                        status === 'error' ? "border-destructive bg-destructive/5 text-destructive" :
                        isUnlocked ? "border-green-500 bg-green-50 text-green-700 font-medium" : ""
                      )}
                    />
                    {status === 'success' && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute right-3 top-3 text-green-500"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>
                    )}
                  </div>
                  <Button 
                    size="lg" 
                    className={cn(
                      "h-12 sm:h-14 px-4 sm:px-6 transition-all duration-300 min-w-[80px]",
                      isUnlocked ? "bg-green-500 hover:bg-green-600 w-12 sm:w-14 px-0" : ""
                    )}
                    onClick={handleUnlock}
                    disabled={isUnlocked || !input}
                  >
                    {isUnlocked ? <Unlock className="w-5 h-5" /> : "Unlock"}
                  </Button>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'error' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-sm text-destructive flex items-center gap-2 bg-destructive/10 p-3 rounded-md"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {currentPuzzle.errorMessage}
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded-md"
                    >
                      <Heart className="w-4 h-4 flex-shrink-0 fill-current" />
                      {currentPuzzle.successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: The Memory */}
        <div className="relative min-h-[500px] sm:min-h-[600px]">
          <AnimatePresence mode="wait">
            {!isUnlocked ? (
               <motion.div
                key="locked-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Card className="h-full border-dashed border-2 border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-background shadow-sm flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-serif text-xl font-medium text-foreground/80">Locked Memory</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Solve the puzzle on the left, and I'll show you a memory, a song, and a little piece of my heart that belongs only to you. 💫
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="unlocked-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Card className="h-full w-full border-none shadow-xl bg-white/80 dark:bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                  <div className="h-2 w-full bg-gradient-to-r from-green-500/40 via-green-500 to-green-500/40 flex-shrink-0" />
                  <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 flex flex-col flex-1 overflow-y-auto min-h-0">
                    <div className="space-y-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        Unlocked
                      </Badge>
                      <h3 className="text-xl font-serif font-medium">{currentPuzzle.memory.title}</h3>
                    </div>

                    {/* Memory Image - Make it fully visible */}
                    <div className="relative w-full flex-shrink-0 rounded-lg bg-muted overflow-hidden" style={{ width: "100%", paddingBottom: "133.33%", position: "relative" }}>
                      <img 
                        src={currentPuzzle.memory.image} 
                        alt={currentPuzzle.memory.caption}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3 flex-shrink-0">
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        "{currentPuzzle.memory.note}"
                      </p>
                      <p className="text-xs text-muted-foreground/80 font-medium">
                        {currentPuzzle.memory.caption}
                      </p>
                    </div>

                    <div className="pt-4 border-t space-y-3 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Music className="w-4 h-4 text-primary" />
                        <h4 className="font-medium text-sm truncate">{currentPuzzle.memory.song}</h4>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                      size="lg"
                    >
                      {currentPuzzleIndex < puzzles.length - 1 ? (
                        <>
                          Next Puzzle <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          See Final <Heart className="w-4 h-4 ml-2 fill-current" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

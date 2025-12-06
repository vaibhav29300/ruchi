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
import kissMarkImg from "@assets/generated_images/red_lipstick_kiss_mark_transparent_background.png";

// Import user uploaded assets
import realMemory1Img from "@assets/IMG_5660_1765004494814.jpg";
import realMemory3Img from "@assets/981d0463-28d5-4a97-b8d8-5791dc2e37fb_1765004494814.jpg";

// Memory Slider Images
const sliderImages = [
  realMemory1Img,
  realMemory3Img,
  memory2Img,
  finalHeartImg
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
    answer: "january",
    successMessage: "Perfect. You really do pay attention. 💚",
    errorMessage: "Close, but not quite. Try what we actually say / do, not the formal version 😉",
    memory: {
      title: "LOVE NOTE",
      note: "The day I met you, life secretly changed its favorite color to your smile. I didn't know it then, but every ordinary moment after that started to feel a little bit magical.",
      caption: "The start of \"us\". I still get butterflies.",
      image: realMemory1Img,
      song: "Our Beginning",
    },
  },
  {
    id: 2,
    type: "Habit Riddle",
    level: 2,
    question: "What is the food you always steal from my plate, even when you said you're 'not hungry'?",
    hint: "You always say: 'just one bite'. It’s never one bite.",
    answer: "fries",
    successMessage: "Haha, I knew you'd admit it! 🍟",
    errorMessage: "Nope! Think saltier and crispier...",
    memory: {
      title: "THE 'JUST ONE BITE' LIE",
      note: "I pretend to be annoyed, but honestly? Watching you happily munch on my fries is my favorite view. I’d order extra just to see you smile like that.",
      caption: "Caught in the act. You owe me a dinner date.",
      image: memory2Img,
      song: "Salt & Love",
    },
  },
  {
    id: 3,
    type: "Heart Question",
    level: 3,
    question: "If you had to describe what we are in one single word (the one we always use), what would it be?",
    hint: "Your favorite word for us. Not 'couple'. The cute one.",
    answer: "soulmates",
    successMessage: "Exactly. Forever and always. ✨",
    errorMessage: "It starts with S... and it means everything.",
    memory: {
      title: "MORE THAN A WORD",
      note: "Because 'boyfriend and girlfriend' never felt like enough. You are my person, my peace, and my favorite place to be.",
      caption: "Two souls, one beautiful story.",
      image: realMemory3Img,
      song: "Forever",
    },
  },
];

type Kiss = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

export default function PuzzleFlow() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [kisses, setKisses] = useState<Kiss[]>([]);
  
  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const currentPuzzle = puzzles[currentPuzzleIndex];

  useEffect(() => {
    if (showFinal && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      setIsPlaying(true);
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

  const handleReplay = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setShowFinal(false);
    setCurrentPuzzleIndex(0);
    setIsUnlocked(false);
    setStatus("idle");
    setInput("");
    setIsPlaying(false);
    setKisses([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const triggerKissExplosion = () => {
    const newKisses: Kiss[] = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      rotation: Math.random() * 60 - 30,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setKisses((prev) => [...prev, ...newKisses]);

    // Cleanup kisses after animation
    setTimeout(() => {
      setKisses((prev) => prev.filter(k => !newKisses.find(nk => nk.id === k.id)));
    }, 3000);
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

  if (showFinal) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen flex flex-col items-center p-6 md:p-12 text-center relative overflow-y-auto overflow-x-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-0 fixed" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0 fixed" />
        
        {/* Audio Element (Hidden but functional) */}
        <audio 
          ref={audioRef} 
          loop 
          src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3" 
          onTimeUpdate={(e) => setAudioProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)}
        />

        {/* Kiss Overlay */}
        <AnimatePresence>
          {kisses.map((kiss) => (
            <motion.img
              key={kiss.id}
              src={kissMarkImg}
              initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0.5, kiss.scale, kiss.scale * 1.1, kiss.scale * 1.2] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute pointer-events-none z-50 w-24 h-24 object-contain"
              style={{ 
                left: `${kiss.x}%`, 
                top: `${kiss.y}%`, 
                rotate: kiss.rotation 
              }}
            />
          ))}
        </AnimatePresence>

        {/* Animated Background Particles (Simplified) */}
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

        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-12 pb-12">
          
          {/* Top Section: Heart & Message */}
          <div className="flex flex-col items-center gap-8 w-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="relative cursor-pointer group"
              onClick={triggerKissExplosion}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full group-hover:bg-primary/50 transition-colors duration-500" />
              <img 
                src={finalHeartImg} 
                alt="Heart" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain relative drop-shadow-[0_0_30px_rgba(255,100,150,0.6)] animate-pulse-slow" 
              />
              <div className="absolute bottom-4 right-4 bg-white text-primary text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                Click Me! 💋
              </div>
            </motion.div>

            <div className="space-y-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-xs tracking-widest uppercase">
                You Unlocked My Heart
              </Badge>
              <h1 className="text-4xl md:text-6xl font-serif text-primary-foreground font-medium leading-tight">
                I Love You,<br/><span className="text-primary italic">Ruchika</span> 💖
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                You solved every little puzzle, just like you solve my bad days with your smile.
                Consider this a virtual kiss, a giant hug, and a promise: my heart is already yours.
              </p>
            </div>
          </div>

          {/* Memory Slider Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-xl space-y-6 bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-serif font-medium text-primary-foreground flex items-center gap-2">
                <Heart className="w-4 h-4 fill-primary text-primary" /> Our Memories
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
                Autoplay({ delay: 3000, stopOnInteraction: false })
              ]}
              className="w-full"
            >
              <CarouselContent>
                {sliderImages.map((img, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-4">
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
              <CarouselPrevious className="left-2 bg-black/50 border-none text-white hover:bg-primary" />
              <CarouselNext className="right-2 bg-black/50 border-none text-white hover:bg-primary" />
            </Carousel>
            
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              ♫ Playing: Our Favorite Song (Preview)
            </p>
          </motion.div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 text-sm bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 cursor-pointer hover:bg-primary hover:text-white transition-colors"
              onClick={triggerKissExplosion}
            >
              Send Virtual Kiss 💋
            </Badge>
            {["Real feelings 💗", "Next: real date? 🍽️"].map((tag, i) => (
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
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-8 max-w-6xl mx-auto overflow-hidden relative">
      {/* Audio Element for Main Game (Optional background ambient) */}
      {/* <audio ref={audioRef} loop src="..." /> */}

      {/* Kiss Overlay for Main Screen too */}
      <AnimatePresence>
        {kisses.map((kiss) => (
          <motion.img
            key={kiss.id}
            src={kissMarkImg}
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, kiss.scale, kiss.scale * 1.1, kiss.scale * 1.2] 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 w-24 h-24 object-contain"
            style={{ 
              left: `${kiss.x}%`, 
              top: `${kiss.y}%`, 
              rotate: kiss.rotation 
            }}
          />
        ))}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-widest uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Play Her Heart • Online
          </div>
          <h1 className="text-2xl font-serif italic text-foreground/90 flex items-center gap-2">
            <Music className="w-5 h-5" /> Little Love Puzzles
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Every puzzle you solve unlocks a memory, a song, and one more piece of my heart.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
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
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start flex-1">
        
        {/* Left Column: The Puzzle */}
        <motion.div
          key={`puzzle-${currentPuzzleIndex}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl shadow-primary/5 bg-white/80 dark:bg-card/50 backdrop-blur-sm overflow-hidden sticky top-8">
            <div className="h-2 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="font-mono text-xs tracking-wider uppercase">
                    {currentPuzzle.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Lvl {currentPuzzle.level}</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-serif leading-tight text-foreground">
                  “{currentPuzzle.question}”
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
                        "h-12 text-lg transition-all duration-300 border-2 focus-visible:ring-0 focus-visible:border-primary",
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
                      "h-12 px-6 transition-all duration-300",
                      isUnlocked ? "bg-green-500 hover:bg-green-600 w-12 px-0" : ""
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
        <div className="relative min-h-[400px]">
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
                      Solve the puzzle on the left, and I’ll show you a memory, a song, and a little piece of my heart that belongs only to you. 💫
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={`unlocked-${currentPuzzleIndex}`}
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 rounded-3xl" />
                <Card className="border-none shadow-2xl shadow-primary/10 overflow-hidden bg-white/90 dark:bg-card/90 backdrop-blur-md">
                  <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer">
                    <img 
                      src={currentPuzzle.memory.image} 
                      alt="Memory" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                       <p className="text-white font-medium flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-white/70" />
                        {currentPuzzle.memory.caption}
                       </p>
                    </div>
                  </div>

                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Unlocked with your answer
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-widest">{currentPuzzle.memory.title}</h3>
                      <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/90">
                        {currentPuzzle.memory.note}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <div className="bg-secondary/30 rounded-xl p-4 flex items-center gap-4 group hover:bg-secondary/50 transition-colors">
                        <div 
                          className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                          onClick={handleReplay}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-medium text-sm truncate">{currentPuzzle.memory.song}</h4>
                            <span className="text-[10px] text-muted-foreground font-mono">2:45</span>
                          </div>
                          <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary"
                              initial={{ width: "0%" }}
                              animate={{ width: isPlaying ? "100%" : "30%" }}
                              transition={{ duration: isPlaying ? 30 : 0, ease: "linear" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 text-muted-foreground hover:text-foreground"
                        onClick={handleReplay}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" /> Replay song
                      </Button>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                        onClick={handleNext}
                      >
                        Next puzzle <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Button for Random Kisses during gameplay */}
      {!showFinal && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={triggerKissExplosion}
          className="fixed bottom-8 right-8 z-50 bg-white dark:bg-card shadow-2xl rounded-full p-4 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
        >
          <Heart className="w-6 h-6 fill-current" />
          <span className="sr-only">Send Kiss</span>
        </motion.button>
      )}
    </div>
  );
}

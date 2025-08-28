'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { translateTone, type Tone, type ToneTranslatorInput, type ToneTranslatorOutput } from '@/ai/flows/tone-translator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Mic, MicOff, User, Volume2, Loader2, Play, VolumeX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ToneOption = {
  value: Tone;
  label: (lang: 'en' | 'ar') => string;
  description: (lang: 'en' | 'ar') => string;
  buttonText: (lang: 'en' | 'ar') => string;
  loadingText: (lang: 'en' | 'ar') => string;
  title: (lang: 'en' | 'ar') => string;
};

const tones: ToneOption[] = [
  { value: 'happy',
    label: lang => lang === 'en' ? 'Happy' : 'سعيد',
    title: lang => lang === 'en' ? 'Happy Translator' : 'مترجم السعادة',
    description: lang => lang === 'en' ? 'Type or speak a neutral or negative message and translate it into a positive, uplifting one!' : 'اكتب أو تحدث برسالة محايدة أو سلبية وحولها إلى رسالة إيجابية ملهمة!',
    buttonText: lang => lang === 'en' ? 'Translate Happiness' : 'ترجمة السعادة',
    loadingText: lang => lang === 'en' ? 'Spreading Joy...' : 'نشر الفرح...',
  },
  { value: 'angry',
    label: lang => lang === 'en' ? 'Angry' : 'غاضب',
    title: lang => lang === 'en' ? 'Anger Translator' : 'مترجم الغضب',
    description: lang => lang === 'en' ? 'Type or speak the polite or corporate quote here and translate it into the true message' : 'اكتب أو تحدث بالاقتباس المهذب أو الرسمي هنا وترجمه إلى الرسالة الحقيقية',
    buttonText: lang => lang === 'en' ? 'Translate Anger' : 'ترجمة الغضب',
    loadingText: lang => lang === 'en' ? 'Getting Angry...' : 'الشعور بالغضب...',
  },
  { value: 'sad',
    label: lang => lang === 'en' ? 'Sad' : 'حزين',
    title: lang => lang === 'en' ? 'Sadness Translator' : 'مترجم الحزن',
    description: lang => lang === 'en' ? 'Express your feelings in a more poetic or melancholic way.' : 'عبر عن مشاعرك بطريقة أكثر شاعرية أو حزنًا.',
    buttonText: lang => lang === 'en' ? 'Translate Sadness' : 'ترجمة الحزن',
    loadingText: lang => lang === 'en' ? 'Embracing Melancholy...' : 'احتضان الكآبة...',
  },
  { value: 'excited',
    label: lang => lang === 'en' ? 'Excited' : 'متحمس',
    title: lang => lang === 'en' ? 'Excitement Translator' : 'مترجم الحماس',
    description: lang => lang === 'en' ? 'Turn any message into an energetic and enthusiastic announcement!' : 'حوّل أي رسالة إلى إعلان مليء بالطاقة والحماس!',
    buttonText: lang => lang === 'en' ? 'Translate Excitement' : 'ترجمة الحماس',
    loadingText: lang => lang === 'en' ? 'Building Hype...' : 'بناء الضجيج...',
  },
  { value: 'motivated',
    label: lang => lang === 'en' ? 'Motivated' : 'متحفز',
    title: lang => lang === 'en' ? 'Motivation Translator' : 'مترجم التحفيز',
    description: lang => lang === 'en' ? 'Transform your ideas into powerful, inspiring calls to action.' : 'حوّل أفكارك إلى دعوات ملهمة وقوية للعمل.',
    buttonText: lang => lang === 'en' ? 'Translate Motivation' : 'ترجمة التحفيز',
    loadingText: lang => lang === 'en' ? 'Inspiring Action...' : 'إلهام العمل...',
  },
];


// Content dictionary for multilingual support
const content = {
  en: {
    selectTone: 'Select a Tone',
    switchLanguage: 'عربي',
    alertMessage: "Please enter or speak a message to translate!",
    errorMessage: "Oops! Something went wrong with the translation...",
    ttsError: "Could not generate audio with the browser's speech synthesis.",
    listening: "Listening...",
    speakButton: "Speak",
    stopListeningButton: "Stop Listening",
    historyTitle: "Conversation History",
    user: "You",
    ai: "AI",
    micPermissionDenied: "Microphone permission denied. Please enable it in your browser settings.",
    speechNotSupported: "Speech recognition is not supported by your browser.",
    placeholder: 'Type or speak your message...',
    usernamePrompt: "What should we call you?",
    usernamePlaceholder: "Enter your name...",
    saveName: "Save Name",
    nameRequired: "Please enter a name to continue.",
  },
  ar: {
    selectTone: 'اختر نبرة',
    switchLanguage: 'English',
    alertMessage: "!الرجاء إدخال أو التحدث برسالة لترجمتها",
    errorMessage: "...عفوًا! حدث خطأ ما في الترجمة",
    ttsError: "تعذر إنشاء الصوت باستخدام أداة النطق في المتصفح.",
    listening: "...يستمع",
    speakButton: "تحدث",
    stopListeningButton: "إيقاف الاستماع",
    historyTitle: "سجل المحادثة",
    user: "أنت",
    ai: "الذكاء الاصطناعي",
    micPermissionDenied: "تم رفض إذن الميكروفون. يرجى تمكينه في إعدادات المتصفح الخاص بك.",
    speechNotSupported: "خاصية التعرف على الكلام غير مدعومة من قبل متصفحك.",
    placeholder: 'اكتب أو تحدث برسالتك...',
    usernamePrompt: "ما الاسم الذي نناديك به؟",
    usernamePlaceholder: "أدخل اسمك...",
    saveName: "حفظ الاسم",
    nameRequired: "الرجاء إدخال اسم للمتابعة.",
  }
};

const MAX_CONVERSATION_TURNS = 30; // 30 turns = 60 messages (user + AI)

interface ConversationTurn {
  speaker: 'user' | 'ai';
  text: string;
  emoji?: string; // For AI responses
  timestamp: number;
}

export default function MoodSpeak() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const shapesRef = useRef<THREE.Mesh[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  
  const [message, setMessage] = useState('');
  const [translation, setTranslation] = useState<ToneTranslatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<Tone>('happy');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [isClient, setIsClient] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [emojiAnimation, setEmojiAnimation] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { toast } = useToast();

  const currentLang = content[language];
  const currentToneDetails = tones.find(t => t.value === mode) || tones[0];

  useEffect(() => {
    setIsClient(true);
    const storedUsername = localStorage.getItem('moodspeak_username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  
  const speakWithBrowser = useCallback((text: string, lang: 'en' | 'ar') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        toast({ title: "Speech Error", description: "Browser speech synthesis is not supported.", variant: "destructive"});
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA';
    
    // Attempt to find a voice for the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === utterance.lang);
    if (voice) {
        utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        setIsSpeaking(false);
        console.error("SpeechSynthesis Error:", e);
        toast({ title: "Speech Error", description: currentLang.ttsError, variant: "destructive"});
    };

    window.speechSynthesis.speak(utterance);
  }, [toast, currentLang.ttsError]);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };


  // Initialize Speech Recognition
  useEffect(() => {
    if (!isClient) return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setMessage(spokenText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        toast({ title: "Mic Permission", description: currentLang.micPermissionDenied, variant: "destructive" });
      } else {
        toast({ title: "Speech Error", description: event.error, variant: "destructive" });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    speechRecognitionRef.current = recognition;

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, [isClient, language, toast, currentLang.micPermissionDenied]);

  const toggleListening = useCallback(() => {
    if (!speechRecognitionRef.current) {
      toast({ title: "Feature Unavailable", description: currentLang.speechNotSupported, variant: "destructive" });
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      try {
        speechRecognitionRef.current.lang = language;
        speechRecognitionRef.current.start();
      } catch (e) {
         console.error("Error starting speech recognition:", e);
         setIsListening(false);
         toast({ title: "Mic Error", description: "Could not start microphone.", variant: "destructive"});
      }
    }
  }, [isListening, language, toast, currentLang.speechNotSupported]);


  const translateMessage = useCallback(async () => {
    if (!message.trim()) {
        toast({
            title: "Input Required",
            description: currentLang.alertMessage,
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    setTranslation(null);

    const userMessageTurn: ConversationTurn = { speaker: 'user', text: message, timestamp: Date.now() };
    const historyForAI = [...conversationHistory, userMessageTurn].map(turn => ({ speaker: turn.speaker, text: turn.text }));
    
    setConversationHistory(prev => [...prev, userMessageTurn].slice(-MAX_CONVERSATION_TURNS * 2));
    setMessage('');

    try {
        const input: ToneTranslatorInput = {
            message,
            tone: mode,
            username: username || undefined,
            conversationHistory: historyForAI,
        };
        const textResult = await translateTone(input);
        setTranslation(textResult);

        if (textResult.emoji) {
            setEmojiAnimation(textResult.emoji);
            setTimeout(() => setEmojiAnimation(null), 1500);
        }

        const aiMessageTurn: ConversationTurn = {
            speaker: 'ai',
            text: textResult.translatedText,
            emoji: textResult.emoji,
            timestamp: Date.now(),
        };
        setConversationHistory(prev => [...prev, aiMessageTurn].slice(-MAX_CONVERSATION_TURNS * 2));
        
        // Use browser speech synthesis
        speakWithBrowser(textResult.translatedText, 'en');

    } catch (error) {
        console.error("Error in translation:", error);
        toast({
            title: "Error",
            description: currentLang.errorMessage,
            variant: "destructive",
        });
        const errorTurn: ConversationTurn = {
            speaker: 'ai',
            text: currentLang.errorMessage,
            emoji: '😅',
            timestamp: Date.now()
        };
        setConversationHistory(prev => [...prev, errorTurn].slice(-MAX_CONVERSATION_TURNS * 2));
    } finally {
        setIsLoading(false);
    }
  }, [message, mode, toast, currentLang, conversationHistory, username, speakWithBrowser]);


  const handleModeChange = useCallback((newMode: Tone) => {
    setMode(newMode);
    setTranslation(null);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prevLang => (prevLang === 'en' ? 'ar' : 'en'));
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.lang = language === 'en' ? 'ar' : 'en';
    }
  }, [language]);
  
  const handleSaveUsername = () => {
    if (!tempUsername.trim()) {
      toast({ title: 'Name Required', description: currentLang.nameRequired, variant: 'destructive' });
      return;
    }
    localStorage.setItem('moodspeak_username', tempUsername.trim());
    setUsername(tempUsername.trim());
  };

  useEffect(() => {
    if (isClient) {
      document.body.setAttribute('data-theme', mode);
      document.body.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }
  }, [mode, language, isClient]);

  // Three.js scene setup and animation
  useEffect(() => {
    if (!isClient || !mountRef.current) return;
    
    if (!username) return;

    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    if (rendererRef.current) {
       if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
           mountRef.current.removeChild(rendererRef.current.domElement);
       }
       rendererRef.current.dispose();
    }
    shapesRef.current.forEach(shape => {
       if (shape.geometry) shape.geometry.dispose();
       if (shape.material) (shape.material as THREE.Material).dispose();
     });
     shapesRef.current = [];

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const isMobileView = window.innerWidth < 768; // md breakpoint
    const numShapes = isMobileView ? 6 : 10;

    const shapes: THREE.Mesh[] = [];

    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColorString = computedStyle.getPropertyValue(`--primary`).trim();
    const primaryColor = new THREE.Color(primaryColorString ? `hsl(${primaryColorString})` : '#FFFFFF');

    for (let i = 0; i < numShapes; i++) {
        let geometry;
        switch(mode) {
          case 'happy':
            geometry = Math.random() > 0.5 ? new THREE.CircleGeometry(0.3 + Math.random() * 0.2, 16) : new THREE.TetrahedronGeometry(0.3 + Math.random() * 0.2);
            break;
          case 'angry':
            geometry = new THREE.OctahedronGeometry(0.3 + Math.random() * 0.2, 0); // Sharp edges
            break;
          case 'sad':
            geometry = new THREE.TorusGeometry(0.3 + Math.random() * 0.1, 0.1, 8, 20); // Ring / ripple
            break;
          case 'excited':
            geometry = new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.2, 0); // Star-like
            break;
          case 'motivated':
            geometry = new THREE.ConeGeometry(0.3 + Math.random() * 0.1, 0.8, 8); // Upward pointing cone
            break;
          default:
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        }

      const material = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3,
        side: THREE.DoubleSide,
      });
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 2);
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const moveSpeedMultiplier = mode === 'excited' ? 0.03 : 0.015;
      shape.userData.rotationSpeed = { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 };
      shape.userData.moveSpeed = { x: (Math.random() - 0.5) * moveSpeedMultiplier, y: (Math.random() - 0.5) * moveSpeedMultiplier };
      shapes.push(shape);
      scene.add(shape);
    }
    shapesRef.current = shapes;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const cam = cameraRef.current;
      if (!cam || !rendererRef.current) return;

      const vFOV = cam.fov * Math.PI / 180;
      const height = 2 * Math.tan(vFOV / 2) * cam.position.z;
      const width = height * cam.aspect;
      const cameraBounds = {
          left: -width / 2,
          right: width / 2,
          bottom: -height / 2,
          top: height / 2,
      };

      shapesRef.current.forEach(shape => {
        if(mode === 'sad') {
             shape.rotation.x += shape.userData.rotationSpeed.x * 0.1; // Slower rotation
             shape.rotation.y += shape.userData.rotationSpeed.y * 0.1;
             shape.position.y += shape.userData.moveSpeed.y * 0.2; // Drifting downwards
        } else {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            shape.position.x += shape.userData.moveSpeed.x;
            shape.position.y += shape.userData.moveSpeed.y;
        }

        const wrapMargin = 1;

        if (shape.position.x > cameraBounds.right + wrapMargin) shape.position.x = cameraBounds.left - wrapMargin;
        if (shape.position.x < cameraBounds.left - wrapMargin) shape.position.x = cameraBounds.right + wrapMargin;
        if (shape.position.y > cameraBounds.top + wrapMargin) shape.position.y = cameraBounds.bottom - wrapMargin;
        if (shape.position.y < cameraBounds.bottom - wrapMargin) shape.position.y = cameraBounds.top + wrapMargin;

        const scale = 1 + Math.sin(Date.now() * 0.001 + shape.id * 0.1) * 0.05;
        shape.scale.set(scale, scale, scale);
      });

      const currentStyle = getComputedStyle(document.documentElement);
      const newPrimaryColorString = currentStyle.getPropertyValue(`--primary`).trim();
      const targetColor = new THREE.Color(newPrimaryColorString ? `hsl(${newPrimaryColorString})` : '#FFFFFF');

      shapesRef.current.forEach(shape => {
        if (shape.material instanceof THREE.MeshBasicMaterial) {
          shape.material.color.lerp(targetColor, 0.05);
        }
      });
      rendererRef.current.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (cameraRef.current && rendererRef.current) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (rendererRef.current) {
        if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose(); rendererRef.current = null;
      }
      shapesRef.current.forEach(shape => {
          if (shape.geometry) shape.geometry.dispose();
          if (shape.material) (shape.material as THREE.Material).dispose();
      });
      shapesRef.current = [];
      if(sceneRef.current) sceneRef.current.clear();
    };
  }, [isClient, mode, username]);


  if (!isClient) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Emoji Animation */}
      {emojiAnimation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-9xl animate-ping-slow opacity-0">{emojiAnimation}</div>
        </div>
      )}

      {!username ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="card-themed w-full max-w-sm">
            <CardHeader>
              <CardTitle className={cn(
                "text-xl text-primary text-center",
                language === 'ar' ? 'font-[var(--font-ar)]' : 'font-[Georgia,serif]'
              )}>
                {currentLang.usernamePrompt}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex w-full items-center gap-2">
                <User className="text-primary" />
                <Input
                  id="username"
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder={currentLang.usernamePlaceholder}
                  className="input-themed flex-grow"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveUsername()}
                />
              </div>
              <Button onClick={handleSaveUsername} className="btn-themed w-full">
                {currentLang.saveName}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className={cn(
          "absolute inset-0 z-10 flex flex-col items-center justify-between p-4 text-center text-foreground transition-colors duration-300",
          language === 'ar' ? 'font-[var(--font-ar)]' : 'font-[var(--font-en)]'
        )}>

          <div className={cn(
            "absolute top-4 sm:top-5 flex flex-wrap sm:flex-nowrap gap-2 items-center",
            language === 'ar' ? 'left-4 sm:left-5' : 'right-4 sm:right-5'
          )}>
             <Select value={mode} onValueChange={(v) => handleModeChange(v as Tone)}>
              <SelectTrigger className="btn-themed min-w-[100px] sm:min-w-[120px] h-9">
                <SelectValue placeholder={currentLang.selectTone} />
              </SelectTrigger>
              <SelectContent>
                {tones.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label(language)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={toggleLanguage} variant="outline" size="sm" className="btn-themed min-w-[90px] sm:min-w-[100px]">
              <Languages className="mr-2 h-4 w-4" />
              {currentLang.switchLanguage}
            </Button>
          </div>

          {/* Conversation History */}
          <div className="w-full max-w-2xl mt-16 sm:mt-20 mb-4 flex flex-col flex-grow overflow-hidden">
            {conversationHistory.length > 0 && (
                <Card className="card-themed w-full h-full flex flex-col flex-grow overflow-hidden">
                    <CardHeader className="p-3 flex-shrink-0">
                        <CardTitle className={cn(
                            "text-lg sm:text-xl text-primary",
                            language === 'ar' ? 'font-[var(--font-ar)]' : 'font-[Georgia,serif]'
                        )}>{currentLang.historyTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0">
                        <ScrollArea className="h-full p-3">
                            {conversationHistory.map((turn) => (
                                <div key={turn.timestamp} className={`mb-3 p-3 rounded-md shadow-sm ${turn.speaker === 'user' ? 'bg-muted/30' : 'bg-primary/10'} ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <p className={cn(
                                      "font-semibold text-xs sm:text-sm mb-1 flex items-center",
                                      turn.speaker === 'user' ? 'text-foreground/80' : 'text-primary',
                                      language === 'ar' ? 'justify-end flex-row-reverse' : ''
                                    )}>
                                      <span className="mx-2">{turn.speaker === 'user' ? username : currentLang.ai}</span>
                                      {turn.speaker === 'ai' && turn.emoji && <span>{turn.emoji}</span>}
                                      {turn.speaker === 'ai' && (
                                        <button onClick={() => speakWithBrowser(turn.text, 'en')} className="ml-2" title="Speak this message">
                                          <Volume2 className="h-4 w-4" />
                                        </button>
                                      )}
                                    </p>
                                    <p className="text-sm sm:text-base leading-relaxed">{turn.text}</p>
                                </div>
                            ))}
                            {isLoading && (
                               <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                               </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
          </div>
          

          {/* Input and Control Area */}
          <div className="flex flex-col items-center gap-3 max-w-md w-full mt-auto pb-4">
             <h1 className={cn(
               "text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider mb-1 text-primary",
                language === 'ar' ? 'font-[var(--font-ar)]' : 'font-[Georgia,serif]'
             )}>
               {currentToneDetails.title(language)}
             </h1>
            <p className="text-xs md:text-sm text-foreground/80 mb-3 max-w-sm leading-relaxed">
              {currentToneDetails.description(language)}
            </p>

            <div className="flex w-full items-center gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isListening ? currentLang.listening : currentLang.placeholder}
                className={cn("input-themed flex-grow text-sm md:text-base", language === 'ar' ? 'text-right' : 'text-left')}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && translateMessage()}
                disabled={isLoading || isListening}
              />
              {speechRecognitionRef.current && (
                <Button
                  onClick={toggleListening}
                  variant="outline"
                  size="icon"
                  className="btn-themed"
                  disabled={isLoading}
                  title={isListening ? currentLang.stopListeningButton : currentLang.speakButton}
                >
                  {isListening ? <MicOff /> : <Mic />}
                </Button>
              )}
            </div>

            <div className="w-full flex items-center gap-2">
              <Button
                onClick={translateMessage}
                disabled={isLoading || isListening}
                className="btn-themed w-full text-sm md:text-base"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentToneDetails.loadingText(language)}
                  </>
                ) : (
                  currentToneDetails.buttonText(language)
                )}
              </Button>
              {isSpeaking && (
                <Button onClick={stopSpeaking} variant="destructive" size="icon" title="Stop Speaking">
                  <VolumeX />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

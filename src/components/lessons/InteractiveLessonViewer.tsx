'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type WordInfo = {
  word: string;
  translation: string;
  ttsAudio?: string;
  partOfSpeech?: string;
  example?: string;
  exampleTranslation?: string;
};

type InteractiveContent = {
  arabic: string;
  english: string;
  words: WordInfo[];
  ttsAudio?: string;
};

type LessonSection = {
  title: string;
  content: InteractiveContent;
  examples: InteractiveContent[];
  imageUrl?: string;
};

type LessonResponse = {
  title: string;
  description: InteractiveContent;
  sections: LessonSection[];
  vocabulary: WordInfo[];
  practice: {
    question: InteractiveContent;
    options: InteractiveContent[];
    answer: string;
  };
};

interface InteractiveTextProps {
  content: InteractiveContent;
  onWordClick?: (word: WordInfo) => void;
  className?: string;
}

const InteractiveText = ({ content, onWordClick, className = '' }: InteractiveTextProps) => {
  const [hoveredWord, setHoveredWord] = useState<WordInfo | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = (audioData?: string) => {
    if (!audioData || !audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = audioData;
    audioRef.current.play().catch(e => console.error('Error playing audio:', e));
  };

  const handleWordClick = (e: React.MouseEvent, word: WordInfo) => {
    if (onWordClick) {
      onWordClick(word);
    }
    
    if (word.ttsAudio) {
      playAudio(word.ttsAudio);
    }
    
    // Position the popup near the clicked word
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 50 // Position above the word
    });
    
    setHoveredWord(word);
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setHoveredWord(null);
    }, 3000);
  };

  // Split text into words and punctuation for proper spacing
  const renderTextWithInteractions = (text: string, words: WordInfo[]) => {
    if (!words || words.length === 0) return text;
    
    const wordMap = new Map(words.map(word => [word.word.toLowerCase(), word]));
    const wordRegex = new RegExp(`\\b(${words.map(w => w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    
    return text.split(wordRegex).map((part, index) => {
      const wordInfo = wordMap.get(part.toLowerCase());
      
      if (wordInfo) {
        return (
          <span
            key={index}
            className="text-blue-600 cursor-pointer hover:underline relative"
            onClick={(e) => handleWordClick(e, wordInfo)}
          >
            {part}
          </span>
        );
      }
      
      return part;
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="mb-2">
        <p className="text-right text-lg text-gray-800 mb-2" dir="rtl">
          {content.arabic}
        </p>
        <p className="text-gray-700">
          {renderTextWithInteractions(content.english, content.words || [])}
        </p>
      </div>
      
      {content.ttsAudio && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => playAudio(content.ttsAudio)}
          title="Listen to pronunciation"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      )}
      
      {/* Word Info Popup */}
      {hoveredWord && (
        <div
          ref={popupRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs transition-opacity duration-200"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg">{hoveredWord.word}</h4>
              {hoveredWord.partOfSpeech && (
                <span className="text-sm text-gray-500">{hoveredWord.partOfSpeech}</span>
              )}
              {hoveredWord.ttsAudio && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={() => playAudio(hoveredWord.ttsAudio)}
                >
                  <Play className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <p className="text-right text-lg" dir="rtl">
              {hoveredWord.translation}
            </p>
            
            {hoveredWord.example && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">{hoveredWord.example}</p>
                {hoveredWord.exampleTranslation && (
                  <p className="text-sm text-right text-gray-600" dir="rtl">
                    {hoveredWord.exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Audio element is created in useEffect */}
      <div className="hidden" />
    </div>
  );
};

interface InteractiveLessonViewerProps {
  lesson: LessonResponse;
}

export const InteractiveLessonViewer = ({ lesson }: InteractiveLessonViewerProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Lesson Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <InteractiveText content={lesson.description} className="text-lg text-gray-600" />
      </div>
      
      {/* Main Content */}
      <div className="space-y-8">
        {lesson.sections.map((section, index) => (
          <Card key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <InteractiveText content={section.content} />
                
                {section.imageUrl && (
                  <div className="my-4 flex justify-center">
                    <img 
                      src={section.imageUrl} 
                      alt={section.title} 
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
                
                {section.examples.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Examples</h3>
                    <div className="space-y-3">
                      {section.examples.map((example, exIndex) => (
                        <div 
                          key={exIndex} 
                          className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                        >
                          <InteractiveText content={example} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Vocabulary Section */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <Card className="border border-gray-200 rounded-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Vocabulary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lesson.vocabulary.map((word, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <InteractiveText 
                      content={{
                        arabic: word.translation,
                        english: word.word,
                        words: [word],
                      }} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Practice Section */}
        {lesson.practice && (
          <Card className="border border-blue-100 bg-blue-50">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-800">Practice</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <InteractiveText 
                  content={lesson.practice.question} 
                  className="text-lg font-medium"
                />
                
                <div className="space-y-3">
                  {lesson.practice.options.map((option, optIndex) => (
                    <div 
                      key={optIndex}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-white cursor-pointer transition-colors"
                      onClick={() => {
                        // Handle answer selection
                        const isCorrect = option.english === lesson.practice.answer;
                        alert(isCorrect ? 'Correct! 🎉' : 'Try again!');
                      }}
                    >
                      <InteractiveText content={option} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InteractiveLessonViewer;

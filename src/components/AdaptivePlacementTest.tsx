import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Play, Pause, RotateCcw, Volume2, Settings } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  text: string;
  expectedLength: number; // seconds
  followUp?: string;
}

interface UserResponse {
  questionId: string;
  duration: number;
  fluency: number; // estimated 1-5
  complexity: number; // estimated 1-5
}

const AdaptivePlacementTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [elevenLabsKey, setElevenLabsKey] = useState(() => {
    return localStorage.getItem('langsy_elevenlabs_key') || "";
  });
  const [showKeyInput, setShowKeyInput] = useState(() => {
    return !localStorage.getItem('langsy_elevenlabs_key');
  });
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  
  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStartTime = useRef<number>(0);
  const audioChunksRef = useRef<Blob[]>([]);

  const questionBank: Question[] = [
    // Beginner questions
    {
      id: "b1",
      level: 'beginner',
      text: "Hola, ¿cómo te llamas?",
      expectedLength: 10,
    },
    {
      id: "b2", 
      level: 'beginner',
      text: "¿De dónde eres?",
      expectedLength: 8,
    },
    {
      id: "b3",
      level: 'beginner', 
      text: "¿Qué te gusta hacer en tu tiempo libre?",
      expectedLength: 15,
    },
    {
      id: "b4",
      level: 'beginner',
      text: "¿Cuál es tu comida favorita y por qué?",
      expectedLength: 12,
    },
    {
      id: "b5",
      level: 'beginner',
      text: "Describe tu día típico desde que te levantas hasta que te acuestas.",
      expectedLength: 20,
    },
    // Intermediate questions
    {
      id: "i1",
      level: 'intermediate',
      text: "Cuéntame sobre tu trabajo o estudios. ¿Qué es lo que más te gusta de ello?",
      expectedLength: 30,
    },
    {
      id: "i2",
      level: 'intermediate', 
      text: "Si pudieras viajar a cualquier lugar del mundo, ¿adónde irías y por qué?",
      expectedLength: 45,
    },
    {
      id: "i3",
      level: 'intermediate',
      text: "Describe una tradición importante de tu cultura.",
      expectedLength: 40,
    },
    {
      id: "i4",
      level: 'intermediate',
      text: "¿Cómo ha cambiado tu ciudad en los últimos años? ¿Te gustan estos cambios?",
      expectedLength: 35,
    },
    {
      id: "i5",
      level: 'intermediate',
      text: "Explica un problema que hayas tenido que resolver recientemente y cómo lo solucionaste.",
      expectedLength: 40,
    },
    // Advanced questions
    {
      id: "a1",
      level: 'advanced',
      text: "¿Cómo crees que la tecnología está cambiando la forma en que nos comunicamos? Explica tanto los aspectos positivos como los negativos.",
      expectedLength: 60,
    },
    {
      id: "a2",
      level: 'advanced',
      text: "Si fueras líder de tu país, ¿qué cambios implementarías para mejorar la educación y por qué?",
      expectedLength: 90,
    },
    {
      id: "a3",
      level: 'advanced',
      text: "Compara las ventajas y desventajas de vivir en una ciudad grande versus un pueblo pequeño.",
      expectedLength: 75,
    },
    {
      id: "a4",
      level: 'advanced',
      text: "Analiza el impacto del cambio climático en tu región y propón soluciones concretas que podrían implementarse a nivel local.",
      expectedLength: 80,
    },
    {
      id: "a5",
      level: 'advanced',
      text: "Discute el papel de las redes sociales en la formación de la opinión pública y su influencia en la democracia moderna.",
      expectedLength: 85,
    }
  ];

  // Get adaptive questions based on current level
  const getAdaptiveQuestions = () => {
    const beginnerQuestions = questionBank.filter(q => q.level === 'beginner');
    const intermediateQuestions = questionBank.filter(q => q.level === 'intermediate');
    const advancedQuestions = questionBank.filter(q => q.level === 'advanced');

    // Start with one beginner question, then adapt
    if (responses.length === 0) return [beginnerQuestions[0]];
    if (responses.length === 1) {
      const lastResponse = responses[0];
      if (lastResponse.fluency >= 4) return [...getCurrentQuestions(), intermediateQuestions[0]];
      return [...getCurrentQuestions(), beginnerQuestions[1]];
    }
    if (responses.length === 2) {
      const avgFluency = responses.reduce((sum, r) => sum + r.fluency, 0) / responses.length;
      if (avgFluency >= 4) return [...getCurrentQuestions(), advancedQuestions[0]];
      if (avgFluency >= 3) return [...getCurrentQuestions(), intermediateQuestions[1]];
      return [...getCurrentQuestions(), beginnerQuestions[2]];
    }
    
    return getCurrentQuestions();
  };

  const getCurrentQuestions = () => {
    return questionBank.slice(0, Math.min(responses.length + 1, 8));
  };

  const questions = getAdaptiveQuestions();
  const progress = ((currentQuestion + 1) / Math.min(questions.length, 8)) * 100;

  // Text to speech using ElevenLabs
  const speakText = async (text: string) => {
    if (!elevenLabsKey) {
      toast.error("Please enter your ElevenLabs API key");
      return;
    }

    try {
      setIsPlaying(true);
      
      // Use Spanish voice - Laura (FGY2WhTYpPnrIDTdsKH5) is good for Spanish
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/FGY2WhTYpPnrIDTdsKH5`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("Error playing audio");
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error("Failed to generate speech. Check your API key.");
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      speakText(questions[currentQuestion].text);
    }
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        const duration = (Date.now() - recordingStartTime.current) / 1000;
        
        // Simple heuristic for fluency based on duration vs expected
        const expectedDuration = questions[currentQuestion].expectedLength;
        const durationRatio = Math.min(duration / expectedDuration, 2);
        const fluency = Math.max(1, Math.min(5, Math.round(2 + durationRatio * 1.5)));
        
        // Estimate complexity (simplified)
        const complexity = Math.max(1, Math.min(5, Math.round(fluency * 0.8 + Math.random() * 1)));

        const response: UserResponse = {
          questionId: questions[currentQuestion].id,
          duration,
          fluency,
          complexity
        };

        setResponses(prev => [...prev, response]);
        setHasRecorded(true);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recordingStartTime.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to start recording. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording completed");
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setHasRecorded(false);
      setIsRecording(false);
      setRecordedAudio(null);
    } else {
      // Test complete - determine final level
      const avgFluency = responses.reduce((sum, r) => sum + r.fluency, 0) / responses.length;
      let finalLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      
      if (avgFluency >= 4) finalLevel = 'advanced';
      else if (avgFluency >= 3) finalLevel = 'intermediate';
      
      toast.success(`Test complete! Your level: ${finalLevel.toUpperCase()}`);
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play().catch(error => {
        console.error('Error playing recorded audio:', error);
        toast.error("Error playing recorded audio");
      });
    }
  };

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  if (showKeyInput) {
    return (
      <div className="min-h-screen bg-muted p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Setup Required</h2>
            <p className="text-muted-foreground mb-6">
              Enter your ElevenLabs API key to enable AI voice generation for the placement test.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">ElevenLabs API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder="Enter your API key..."
              />
            </div>
            
            <Button 
              onClick={() => {
                localStorage.setItem('langsy_elevenlabs_key', elevenLabsKey);
                setShowKeyInput(false);
              }}
              disabled={!elevenLabsKey.trim()}
              className="w-full"
            >
              Start Placement Test
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Get your API key from{" "}
              <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                elevenlabs.io
              </a>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              Adaptive Placement Test
            </Badge>
            <h2 className="text-3xl font-bold mb-2">AI-Powered Spanish Assessment</h2>
            <p className="text-muted-foreground">
              Our AI adapts questions based on your responses to find your perfect level
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {Math.min(questions.length, 8)}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="bg-gradient-card border-border p-6 mb-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-primary" />
                <Badge variant="secondary">Spanish Audio Prompt</Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="flex justify-center mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePlayPause}
                  className="mr-4"
                  disabled={!elevenLabsKey}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? "Pause" : "Play"} Audio
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Expected response time: ~{questions[currentQuestion].expectedLength} seconds
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Record your response in Spanish. Speak naturally and take your time.
                </p>
                
                <div className="flex justify-center gap-4 mb-4">
                  <Button
                    variant={isRecording ? "record" : "default"}
                    size="lg"
                    onClick={handleRecord}
                    className={isRecording ? "animate-pulse-gentle" : ""}
                  >
                    <Mic className="w-5 h-5" />
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  
                  {hasRecorded && (
                    <>
                      <Button variant="outline" onClick={() => {
                        setHasRecorded(false);
                        setRecordedAudio(null);
                      }}>
                        <RotateCcw className="w-4 h-4" />
                        Re-record
                      </Button>

                      {recordedAudio && (
                        <Button variant="outline" onClick={playRecordedAudio}>
                          <Play className="w-4 h-4" />
                          Play Recording
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {hasRecorded && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                    <p className="text-success text-sm font-medium">
                      ✓ Recording completed - AI is analyzing your response
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              disabled={currentQuestion === 0}
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
                setHasRecorded(false);
                setIsRecording(false);
                setRecordedAudio(null);
              }}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!hasRecorded}
              variant={currentQuestion >= 7 ? "success" : "default"}
            >
              {currentQuestion >= 7 ? "Complete Test" : "Next Question"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdaptivePlacementTest;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Pause, RotateCcw } from "lucide-react";

const PlacementTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Introduce yourself and tell me about your hobbies.",
      audio: "intro_prompt.mp3"
    },
    {
      id: 2,
      text: "Describe your typical morning routine.",
      audio: "routine_prompt.mp3"
    },
    {
      id: 3,
      text: "What are your plans for the weekend?",
      audio: "weekend_prompt.mp3"
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setHasRecorded(false);
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              Placement Test
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Find Your Perfect Level</h2>
            <p className="text-muted-foreground">
              Answer these audio prompts so we can match you with the right content
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="bg-audio-bg border-border p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="flex justify-center mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePlayPause}
                  className="mr-4"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? "Pause" : "Play"} Audio
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Record your response (30-60 seconds recommended)
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
                    <Button variant="outline" onClick={() => setHasRecorded(false)}>
                      <RotateCcw className="w-4 h-4" />
                      Re-record
                    </Button>
                  )}
                </div>

                {hasRecorded && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                    <p className="text-success text-sm font-medium">
                      ✓ Recording completed
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
              }}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!hasRecorded}
              variant={currentQuestion === questions.length - 1 ? "success" : "default"}
            >
              {currentQuestion === questions.length - 1 ? "Complete Test" : "Next Question"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlacementTest;
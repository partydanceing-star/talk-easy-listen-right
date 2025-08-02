import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Play, Pause, SkipForward, Volume2 } from "lucide-react";

const ConversationPractice = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const conversation = [
    {
      type: "prompt",
      text: "Hello! How was your weekend?",
      audio: "weekend_greeting.mp3"
    },
    {
      type: "user_turn",
      prompt: "Respond naturally about your weekend activities"
    },
    {
      type: "model_answer",
      text: "It was great, thanks! I went hiking with some friends on Saturday and spent Sunday reading a good book. How about you?",
      audio: "model_weekend_response.mp3"
    },
    {
      type: "prompt",
      text: "That sounds wonderful! What book were you reading?",
      audio: "book_question.mp3"
    },
    {
      type: "user_turn",
      prompt: "Tell me about a book you're reading or have read recently"
    }
  ];

  const progress = ((currentStep + 1) / conversation.length) * 100;
  const currentItem = conversation[currentStep];

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
    }
  };

  const handleNext = () => {
    if (currentItem.type === "user_turn" && hasRecorded) {
      setShowModelAnswer(true);
      setCurrentStep(currentStep + 1);
    } else if (currentItem.type === "prompt" || currentItem.type === "model_answer") {
      setCurrentStep(currentStep + 1);
      setHasRecorded(false);
      setShowModelAnswer(false);
    }
  };

  const handleSkip = () => {
    setCurrentStep(currentStep + 1);
    setHasRecorded(false);
    setShowModelAnswer(false);
  };

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Badge variant="outline" className="mb-2">
              <span className="w-2 h-2 bg-tier-intermediate rounded-full mr-2"></span>
              Intermediate Level
            </Badge>
            <h1 className="text-2xl font-bold">Weekend Conversations</h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Session Progress</div>
            <Progress value={progress} className="w-32 h-2 mt-1" />
          </div>
        </div>

        {/* Conversation Area */}
        <div className="space-y-6">
          {currentItem.type === "prompt" && (
            <Card className="p-6 bg-gradient-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">Audio Prompt</Badge>
                  <p className="text-lg mb-4">{currentItem.text}</p>
                  <Button variant="outline" onClick={handlePlayAudio}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play"} Audio
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentItem.type === "user_turn" && (
            <Card className="p-6 bg-audio-bg border-2 border-primary/20">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">Your Turn</Badge>
                <h3 className="text-lg font-semibold mb-2">{currentItem.prompt}</h3>
                <p className="text-muted-foreground mb-6">
                  Record your response naturally. Take your time to think before speaking.
                </p>

                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    variant={isRecording ? "record" : "default"}
                    size="lg"
                    onClick={handleRecord}
                    className={isRecording ? "animate-pulse-gentle" : ""}
                  >
                    <Mic className="w-5 h-5" />
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                </div>

                {hasRecorded && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                    <p className="text-success font-medium mb-2">✓ Recording Complete!</p>
                    <p className="text-sm text-muted-foreground">
                      Click "Continue" to hear a model response, or re-record if you'd like to try again.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {currentItem.type === "model_answer" && (
            <Card className="p-6 bg-success/5 border border-success/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 border-success text-success">
                    Model Response
                  </Badge>
                  <p className="text-lg mb-4">{currentItem.text}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Listen to this example response and compare it with your own.
                  </p>
                  <Button variant="outline" onClick={handlePlayAudio}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play"} Model Response
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" disabled={currentStep === 0}>
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              <SkipForward className="w-4 h-4" />
              Skip
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={currentItem.type === "user_turn" && !hasRecorded}
              variant={currentStep === conversation.length - 1 ? "success" : "default"}
            >
              {currentStep === conversation.length - 1 ? "Complete Session" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPractice;
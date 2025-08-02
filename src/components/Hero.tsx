import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MessageSquare, TrendingUp, Zap } from "lucide-react";

interface HeroProps {
  onStartPlacementTest?: () => void;
}

const Hero = ({ onStartPlacementTest }: HeroProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center text-white">
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
          Audio-First Language Learning
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Master Languages Through
          <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Real Conversations
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed">
          Langsy uses level-matched audio conversations to improve your speaking and listening skills. 
          Practice naturally, build confidence, and progress faster.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            variant="hero" 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={onStartPlacementTest}
          >
            <Mic className="w-5 h-5" />
            Start Your Placement Test
          </Button>
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
            Learn More
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-6 text-center">
            <MessageSquare className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real Conversations</h3>
            <p className="text-white/80 text-sm">Practice with authentic dialogue scenarios matched to your level</p>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-6 text-center">
            <TrendingUp className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Progression</h3>
            <p className="text-white/80 text-sm">AI-powered placement ensures you're always practicing at the right level</p>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-6 text-center">
            <Zap className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quick Sessions</h3>
            <p className="text-white/80 text-sm">Just 5-10 minutes per session - fit language learning into any schedule</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;
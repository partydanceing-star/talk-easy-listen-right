import { useState } from "react";
import Hero from "@/components/Hero";
import AdaptivePlacementTest from "@/components/AdaptivePlacementTest";
import ConversationPractice from "@/components/ConversationPractice";
import ProgressDashboard from "@/components/ProgressDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState("hero");

  const renderView = () => {
    switch (currentView) {
      case "placement":
        return <AdaptivePlacementTest />;
      case "practice":
        return <ConversationPractice />;
      case "dashboard":
        return <ProgressDashboard />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderView()}
      
      {/* Navigation for demo purposes */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg">
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentView("hero")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === "hero" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView("placement")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === "placement" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Test
          </button>
          <button 
            onClick={() => setCurrentView("practice")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === "practice" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Practice
          </button>
          <button 
            onClick={() => setCurrentView("dashboard")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === "dashboard" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;

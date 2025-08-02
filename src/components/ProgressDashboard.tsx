import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Calendar, Trophy, Clock, TrendingUp, Star } from "lucide-react";

const ProgressDashboard = () => {
  const stats = {
    currentStreak: 7,
    totalSessions: 42,
    weeklyGoal: 5,
    sessionsThisWeek: 3,
    currentTier: "Intermediate",
    nextMilestone: 50
  };

  const recentSessions = [
    { date: "Today", topic: "Weekend Conversations", duration: "8 min", completed: true },
    { date: "Yesterday", topic: "Travel Planning", duration: "12 min", completed: true },
    { date: "2 days ago", topic: "Food & Dining", duration: "7 min", completed: true },
    { date: "3 days ago", topic: "Daily Routines", duration: "9 min", completed: true }
  ];

  const achievements = [
    { name: "First Week", icon: Calendar, earned: true },
    { name: "10 Sessions", icon: Trophy, earned: true },
    { name: "5-Day Streak", icon: Flame, earned: true },
    { name: "50 Sessions", icon: Star, earned: false }
  ];

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
            <p className="text-muted-foreground">Keep up the great work! You're making excellent progress.</p>
          </div>
          <Badge variant="tier" className="text-tier-intermediate border-tier-intermediate">
            <span className="w-2 h-2 bg-tier-intermediate rounded-full mr-2"></span>
            {stats.currentTier} Level
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center bg-gradient-card">
            <Flame className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>

          <Card className="p-6 text-center bg-gradient-card">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </Card>

          <Card className="p-6 text-center bg-gradient-card">
            <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.sessionsThisWeek}/{stats.weeklyGoal}</div>
            <div className="text-sm text-muted-foreground">Weekly Goal</div>
          </Card>

          <Card className="p-6 text-center bg-gradient-card">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.nextMilestone - stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">To Next Milestone</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Progress */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{stats.sessionsThisWeek} of {stats.weeklyGoal} sessions completed</span>
                <span>{Math.round((stats.sessionsThisWeek / stats.weeklyGoal) * 100)}%</span>
              </div>
              <Progress value={(stats.sessionsThisWeek / stats.weeklyGoal) * 100} className="h-3 bg-gradient-progress" />
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.weeklyGoal - stats.sessionsThisWeek} more sessions to reach your weekly goal!
            </p>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Continue Learning</h3>
            <div className="space-y-3">
              <Button variant="hero" className="w-full">
                Start Today's Session
              </Button>
              <Button variant="outline" className="w-full">
                Review Vocabulary
              </Button>
              <Button variant="ghost" className="w-full">
                Change Settings
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Sessions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <div className="font-medium">{session.topic}</div>
                    <div className="text-sm text-muted-foreground">{session.date}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {session.duration}
                    </Badge>
                    <div className="w-3 h-3 bg-success rounded-full ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`text-center p-4 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-muted border-border opacity-50'
                  }`}
                >
                  <achievement.icon className={`w-6 h-6 mx-auto mb-2 ${
                    achievement.earned ? 'text-success' : 'text-muted-foreground'
                  }`} />
                  <div className="text-sm font-medium">{achievement.name}</div>
                  {achievement.earned && (
                    <div className="text-xs text-success mt-1">Earned!</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
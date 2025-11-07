import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Play, 
  Pause, 
  RotateCcw,
  Brain,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Award,
  Users,
  BookOpen,
  Lightbulb,
  Camera,
  Settings
} from 'lucide-react';

const AIMockInterview = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState('prepare');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const interviewTypes = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Technical questions on programming, algorithms, and system design',
      duration: '45-60 minutes',
      questions: 15
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Questions on statistics, machine learning, and data analysis',
      duration: '40-50 minutes',
      questions: 12
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Product strategy, market analysis, and leadership questions',
      duration: '30-45 minutes',
      questions: 10
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      description: 'Business processes, analytics, and problem-solving questions',
      duration: '35-45 minutes',
      questions: 12
    }
  ];

  const difficultyLevels = [
    { id: 'beginner', label: 'Beginner', description: 'Entry-level questions' },
    { id: 'intermediate', label: 'Intermediate', description: 'Mid-level professional questions' },
    { id: 'advanced', label: 'Advanced', description: 'Senior-level complex questions' }
  ];

  const mockQuestions = [
    {
      id: 1,
      question: "Tell me about yourself and your background in software development.",
      type: "behavioral",
      timeLimit: 3,
      tips: "Keep it concise, focus on relevant experience, and connect to the role"
    },
    {
      id: 2,
      question: "Explain the difference between arrays and linked lists. When would you use each?",
      type: "technical",
      timeLimit: 5,
      tips: "Compare time complexity, memory usage, and use cases"
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      type: "behavioral",
      timeLimit: 4,
      tips: "Use the STAR method: Situation, Task, Action, Result"
    },
    {
      id: 4,
      question: "How would you design a URL shortening service like bit.ly?",
      type: "system-design",
      timeLimit: 15,
      tips: "Start with requirements, discuss architecture, scalability, and database design"
    }
  ];

  const [pastInterviews] = useState([
    {
      id: 1,
      role: 'Software Engineer',
      date: '2024-11-01',
      duration: '45 minutes',
      score: 78,
      strengths: ['Technical Knowledge', 'Problem Solving'],
      improvements: ['Communication', 'Confidence'],
      status: 'completed'
    },
    {
      id: 2,
      role: 'Data Scientist',
      date: '2024-10-28',
      duration: '40 minutes',
      score: 85,
      strengths: ['Analytical Thinking', 'Domain Knowledge'],
      improvements: ['Code Optimization'],
      status: 'completed'
    },
    {
      id: 3,
      role: 'Product Manager',
      date: '2024-10-25',
      duration: '35 minutes',
      score: 72,
      strengths: ['Strategic Thinking', 'Leadership'],
      improvements: ['Market Analysis', 'Data Interpretation'],
      status: 'completed'
    }
  ]);

  const handleStartInterview = () => {
    if (!selectedRole || !selectedDifficulty) {
      toast({
        title: "Missing Information",
        description: "Please select both role and difficulty level to start the interview.",
        variant: "destructive"
      });
      return;
    }

    setIsInterviewActive(true);
    setCurrentSection('interview');
    setCurrentQuestion(0);
    toast({
      title: "Interview Started",
      description: "Good luck! Take your time and speak clearly.",
    });
  };

  const handleAnswerComplete = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Interview completed
      setIsInterviewActive(false);
      setCurrentSection('results');
      toast({
        title: "Interview Completed",
        description: "Great job! Your performance is being analyzed.",
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Your answer has been saved." : "Speak clearly into the microphone.",
    });
  };

  const handleRetakeQuestion = () => {
    toast({
      title: "Question Reset",
      description: "You can now answer this question again.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground">Practice interviews with AI-powered feedback and analysis</p>
        </div>
        {currentSection === 'prepare' && (
          <Button onClick={handleStartInterview} size="lg">
            <Play className="h-5 w-5 mr-2" />
            Start Interview
          </Button>
        )}
      </div>

      <Tabs value={currentSection} onValueChange={setCurrentSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prepare">Prepare</TabsTrigger>
          <TabsTrigger value="interview" disabled={!isInterviewActive}>Interview</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Preparation Tab */}
        <TabsContent value="prepare" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interview Setup */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Interview Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a role to practice for" />
                      </SelectTrigger>
                      <SelectContent>
                        {interviewTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.label} - {level.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRole && (
                    <div className="p-4 bg-muted rounded-lg">
                      {(() => {
                        const selectedType = interviewTypes.find(t => t.id === selectedRole);
                        return selectedType ? (
                          <div>
                            <h3 className="font-semibold mb-2">{selectedType.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{selectedType.description}</p>
                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {selectedType.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {selectedType.questions} questions
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Check */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Check
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        <span>Camera</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Working</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mic className="h-5 w-5" />
                        <span>Microphone</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Working</span>
                      </div>
                    </div>
                  </div>
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Camera Preview</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips & Guidelines */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Interview Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Maintain eye contact with the camera</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Speak clearly and at a moderate pace</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Use the STAR method for behavioral questions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Take time to think before answering</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Ask clarifying questions when needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Interviews Completed</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Score</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best Performance</span>
                      <span className="font-semibold">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Interview Tab */}
        <TabsContent value="interview" className="space-y-6">
          {isInterviewActive && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Feed */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center relative">
                      <div className="text-white text-center">
                        <Camera className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p>Your Camera Feed</p>
                      </div>
                      {isRecording && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          REC
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        variant={audioEnabled ? "default" : "secondary"}
                        size="lg"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                      >
                        {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant={videoEnabled ? "default" : "secondary"}
                        size="lg"
                        onClick={() => setVideoEnabled(!videoEnabled)}
                      >
                        {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        onClick={toggleRecording}
                      >
                        {isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        {isRecording ? "Stop Answer" : "Start Answer"}
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleRetakeQuestion}>
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Question {currentQuestion + 1} of {mockQuestions.length}</CardTitle>
                      <Badge variant="outline">
                        {mockQuestions[currentQuestion]?.type}
                      </Badge>
                    </div>
                    <Progress 
                      value={(currentQuestion + 1) / mockQuestions.length * 100} 
                      className="w-full" 
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-medium">{mockQuestions[currentQuestion]?.question}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Time limit: {mockQuestions[currentQuestion]?.timeLimit} minutes
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Tip:</p>
                            <p className="text-sm text-blue-700">{mockQuestions[currentQuestion]?.tips}</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleAnswerComplete} 
                        className="w-full"
                        disabled={!isRecording}
                      >
                        Next Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Interview Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">82%</div>
                    <p className="text-muted-foreground">Overall Score</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">75%</div>
                      <p className="text-sm text-muted-foreground">Technical</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">88%</div>
                      <p className="text-sm text-muted-foreground">Communication</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">79%</div>
                      <p className="text-sm text-muted-foreground">Problem Solving</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Clear and confident communication</li>
                        <li>Good understanding of technical concepts</li>
                        <li>Structured approach to problem-solving</li>
                        <li>Maintained good eye contact</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Consider edge cases in technical solutions</li>
                        <li>Provide more specific examples in behavioral answers</li>
                        <li>Take more time to think before answering</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question-by-Question Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockQuestions.map((question, index) => (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">Question {index + 1}</p>
                          <Badge variant={index % 2 === 0 ? "default" : "secondary"}>
                            {index % 2 === 0 ? "85%" : "79%"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{question.question}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Practice System Design</p>
                      <p className="text-xs text-blue-600">Focus on scalability concepts</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">STAR Method</p>
                      <p className="text-xs text-green-600">Structure behavioral answers better</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">Code Practice</p>
                      <p className="text-xs text-purple-600">Work on algorithm optimization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Interview
                    </Button>
                    <Button className="w-full" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Practice Questions
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Join Study Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Interview History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastInterviews.map((interview) => (
                  <div key={interview.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{interview.role}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(interview.date).toLocaleDateString()} • {interview.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-green-600 mb-1">Strengths:</p>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {interview.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-orange-600 mb-1">Improvements:</p>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {interview.improvements.map((improvement, index) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Download Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIMockInterview;
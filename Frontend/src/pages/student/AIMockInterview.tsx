import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, Play, Pause, Brain, MessageSquare, Send, Loader2 } from 'lucide-react';
import { GeminiAIService, EmotionDetectionService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const AIMockInterview = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questions] = useState([
    "Tell me about yourself and your technical background.",
    "What programming languages are you most comfortable with?", 
    "Describe a challenging project you have worked on.",
    "How do you handle debugging and problem-solving?",
    "What are your career goals and aspirations?"
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [responses, setResponses] = useState<Array<{question: string, response: string, feedback?: any}>>([]);
  const [emotion, setEmotion] = useState('neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionInterval, setEmotionInterval] = useState<NodeJS.Timeout | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    setCurrentQuestion(questions[0]);
    // Load emotion detection model and test Gemini API when component mounts
    loadEmotionModel();
    testGeminiConnection();
  }, []);

  const loadEmotionModel = async () => {
    setModelLoading(true);
    try {
      const loaded = await EmotionDetectionService.loadModel();
      setModelLoaded(loaded);
      toast({
        title: loaded ? "YOLO Model Loaded" : "Model Load Warning",
        description: loaded 
          ? "Emotion detection is now active" 
          : "Using simulated emotion detection",
        variant: loaded ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error loading model:', error);
      setModelLoaded(false);
    } finally {
      setModelLoading(false);
    }
  };

  const testGeminiConnection = async () => {
    try {
      const connected = await GeminiAIService.testConnection();
      setGeminiConnected(connected);
      if (connected) {
        toast({
          title: "Gemini AI Connected",
          description: "AI feedback is ready",
        });
      } else {
        toast({
          title: "Gemini AI Error",
          description: "Check your API key in environment variables",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      setGeminiConnected(false);
    }
  };

  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
      
      // Start with first question
      setCurrentQuestion(questions[0]);
      setCurrentQuestionIndex(0);
      
      // Start emotion detection interval
      const interval = setInterval(async () => {
        if (videoRef.current) {
          const detectedEmotion = await EmotionDetectionService.detectEmotion(videoRef.current);
          setEmotion(detectedEmotion);
        }
      }, 3000); // Check emotion every 3 seconds
      
      setEmotionInterval(interval);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const submitResponse = async () => {
    if (!currentResponse.trim()) {
      toast({
        title: "Empty Response",
        description: "Please provide an answer before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Get AI feedback using Gemini
      const feedback = await GeminiAIService.analyzeResponse(currentQuestion, currentResponse);
      
      // Store response with feedback
      const newResponse = {
        question: currentQuestion,
        response: currentResponse,
        feedback: feedback
      };
      
      setResponses(prev => [...prev, newResponse]);
      setCurrentResponse('');
      
      toast({
        title: "Response Submitted",
        description: "AI feedback generated successfully",
      });
      
    } catch (error) {
      console.error('Error analyzing response:', error);
      toast({
        title: "Analysis Error", 
        description: "Could not analyze response. Response saved.",
        variant: "destructive"
      });
      
      // Store response without feedback
      const newResponse = {
        question: currentQuestion,
        response: currentResponse,
        feedback: null
      };
      
      setResponses(prev => [...prev, newResponse]);
      setCurrentResponse('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1]);
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    setIsRecording(false);
    
    if (emotionInterval) {
      clearInterval(emotionInterval);
      setEmotionInterval(null);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setCurrentQuestion('Interview completed! Thank you for participating.');
    
    toast({
      title: "Interview Completed",
      description: "Check your results below for AI feedback",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Mock Interview Coach
        </h1>
        <p className="text-muted-foreground">Practice interviews with AI-powered feedback and emotion detection</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Interview Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <Button onClick={startInterview} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Interview
                </Button>
              ) : (
                <>
                  <Button onClick={nextQuestion} variant="outline">
                    Next Question
                  </Button>
                  <Button onClick={endInterview} variant="destructive">
                    End Interview
                  </Button>
                </>
              )}
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Emotion Detection:</p>
                {modelLoading ? (
                  <Badge variant="outline">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading Model...
                  </Badge>
                ) : (
                  <Badge variant={modelLoaded ? "default" : "secondary"}>
                    {modelLoaded ? "YOLO Active" : "Simulated"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{EmotionDetectionService.getEmotionEmoji(emotion)}</span>
                <Badge variant={emotion === 'happy' ? 'default' : 'secondary'} className={EmotionDetectionService.getEmotionColor(emotion)}>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions and Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Current Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="font-medium text-lg">{currentQuestion}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>

              {isRecording && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Response:</label>
                    <Textarea
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[120px]"
                      disabled={isAnalyzing}
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={submitResponse}
                        disabled={isAnalyzing || !currentResponse.trim()}
                        className="flex-1"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Response
                          </>
                        )}
                      </Button>
                      
                      <Button onClick={nextQuestion} variant="outline" disabled={isAnalyzing}>
                        Next Question
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Interview Tips:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Speak clearly and maintain eye contact with camera</li>
                      <li>• Take your time to think before answering</li>
                      <li>• Use specific examples from your experience</li>
                      <li>• Stay confident and relaxed</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Show previous responses and feedback */}
              {responses.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Previous Responses:</h3>
                  {responses.map((resp, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">Q{index + 1}: {resp.question}</p>
                        <p className="text-sm">{resp.response}</p>
                        
                        {resp.feedback && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4" />
                              <span className="text-sm font-medium">AI Feedback</span>
                              {resp.feedback.rating && (
                                <Badge variant="outline">{resp.feedback.rating}/10</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{resp.feedback.overall}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Integration Status */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className={`h-8 w-8 mx-auto mb-2 ${modelLoaded ? 'text-green-500' : 'text-orange-500'}`} />
            <h3 className="font-semibold mb-1">Emotion Analysis</h3>
            <p className="text-sm text-muted-foreground">YOLO-based emotion detection</p>
            <Badge variant={modelLoaded ? "default" : "secondary"} className="mt-2">
              {modelLoading ? "Loading..." : modelLoaded ? "Active" : "Simulated"}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className={`h-8 w-8 mx-auto mb-2 ${geminiConnected ? 'text-blue-500' : 'text-red-500'}`} />
            <h3 className="font-semibold mb-1">Gemini AI Feedback</h3>
            <p className="text-sm text-muted-foreground">AI-powered response analysis</p>
            <Badge variant={geminiConnected ? "default" : "destructive"} className="mt-2">
              {geminiConnected ? "Connected" : "Check API Key"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Video className={`h-8 w-8 mx-auto mb-2 ${isRecording ? 'text-green-500' : 'text-gray-500'}`} />
            <h3 className="font-semibold mb-1">Interview Recording</h3>
            <p className="text-sm text-muted-foreground">Video and audio capture</p>
            <Badge variant={isRecording ? "default" : "secondary"} className="mt-2">
              {isRecording ? "Recording" : "Ready"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIMockInterview;

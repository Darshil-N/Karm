import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Wand2, 
  Eye, 
  Edit, 
  Save,
  Plus,
  X,
  Lightbulb,
  Brain,
  Target,
  Zap,
  Check,
  Sparkles
} from 'lucide-react';

const AIResumeBuilder = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(false);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: 'John Smith',
      email: 'john.smith@college.edu',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      linkedIn: 'linkedin.com/in/johnsmith',
      github: 'github.com/johnsmith',
      portfolio: 'johnsmith.dev'
    },
    objective: 'Passionate software developer seeking opportunities to apply my technical skills and contribute to innovative projects in a dynamic technology company.',
    education: [
      {
        degree: 'B.Tech Computer Science Engineering',
        institution: 'ABC Engineering College',
        duration: '2021-2025',
        cgpa: '8.75'
      }
    ],
    experience: [
      {
        title: 'Software Development Intern',
        company: 'TechCorp Solutions',
        duration: 'Jun 2024 - Aug 2024',
        description: 'Developed web applications using React and Node.js, collaborated with cross-functional teams, and improved application performance by 30%.'
      }
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        duration: 'Jun 2024 - Aug 2024',
        description: 'Built a full-stack e-commerce application with user authentication, payment integration, and admin dashboard using MERN stack.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express']
      }
    ],
    skills: {
      technical: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB'],
      soft: ['Communication', 'Problem Solving', 'Team Leadership', 'Time Management']
    },
    certifications: [
      {
        name: 'AWS Certified Developer Associate',
        issuer: 'Amazon Web Services',
        date: 'December 2023'
      }
    ]
  });

  const [templates] = useState([
    {
      id: 1,
      name: 'Professional',
      description: 'Clean and modern design perfect for tech roles',
      preview: '/resume-templates/professional.png',
      category: 'Modern'
    },
    {
      id: 2,
      name: 'Creative',
      description: 'Eye-catching design for creative positions',
      preview: '/resume-templates/creative.png',
      category: 'Creative'
    },
    {
      id: 3,
      name: 'Minimalist',
      description: 'Simple and elegant layout',
      preview: '/resume-templates/minimalist.png',
      category: 'Classic'
    },
    {
      id: 4,
      name: 'Executive',
      description: 'Sophisticated design for senior roles',
      preview: '/resume-templates/executive.png',
      category: 'Professional'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const resumeSteps = [
    { id: 0, title: 'Template', description: 'Choose a template' },
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Experience', description: 'Work experience' },
    { id: 3, title: 'Education', description: 'Educational background' },
    { id: 4, title: 'Skills', description: 'Technical & soft skills' },
    { id: 5, title: 'Projects', description: 'Personal projects' },
    { id: 6, title: 'Review', description: 'Final review' }
  ];

  const handleGenerateWithAI = () => {
    setGeneratingResume(true);
    toast({
      title: "AI Resume Generation Started",
      description: "Our AI is analyzing your profile and generating an optimized resume...",
    });
    
    setTimeout(() => {
      setGeneratingResume(false);
      toast({
        title: "Resume Generated Successfully",
        description: "Your AI-optimized resume is ready for review!",
      });
    }, 3000);
  };

  const handleGetAISuggestions = () => {
    setAiSuggestions(true);
    toast({
      title: "AI Suggestions Loading",
      description: "Getting AI-powered suggestions to improve your resume...",
    });
    
    setTimeout(() => {
      setAiSuggestions(false);
      toast({
        title: "AI Suggestions Ready",
        description: "Check the suggestions panel for improvements!",
      });
    }, 2000);
  };

  const handleDownload = (format: string) => {
    toast({
      title: "Download Started",
      description: `Downloading resume in ${format.toUpperCase()} format...`,
    });
  };

  const aiSuggestionsData = [
    {
      section: 'Objective',
      suggestion: 'Consider making your objective more specific to the role you\'re targeting',
      type: 'improvement'
    },
    {
      section: 'Experience',
      suggestion: 'Add quantifiable achievements to your work experience',
      type: 'enhancement'
    },
    {
      section: 'Skills',
      suggestion: 'Include more industry-relevant technologies like Docker, Kubernetes',
      type: 'addition'
    },
    {
      section: 'Projects',
      suggestion: 'Highlight the impact and results of your projects',
      type: 'improvement'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Resume Builder
          </h1>
          <p className="text-muted-foreground">Create professional resumes with AI-powered suggestions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGetAISuggestions} disabled={aiSuggestions}>
            {aiSuggestions ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Getting Suggestions...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                Get AI Suggestions
              </>
            )}
          </Button>
          <Button onClick={handleGenerateWithAI} disabled={generatingResume}>
            {generatingResume ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Steps */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Builder Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resumeSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        activeStep === step.id
                          ? 'bg-primary-foreground text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.id + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className={`text-xs ${
                          activeStep === step.id
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Panel */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiSuggestionsData.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-xs text-primary">{suggestion.section}</p>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeStep.toString()} className="space-y-6">
            {/* Template Selection */}
            <TabsContent value="0" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Resume Template</CardTitle>
                  <p className="text-muted-foreground">Select a template that best fits your career goals</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {template.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Information */}
            <TabsContent value="1" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-muted-foreground">Enter your basic contact details</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedIn}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedIn: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={resumeData.personalInfo.github}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="objective">Career Objective</Label>
                    <Textarea
                      id="objective"
                      rows={3}
                      value={resumeData.objective}
                      onChange={(e) => setResumeData({ ...resumeData, objective: e.target.value })}
                      placeholder="Write a compelling career objective..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Section */}
            <TabsContent value="4" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <p className="text-muted-foreground">List your technical and soft skills</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Technical Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {resumeData.skills.technical.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a technical skill..." />
                      <Button variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Soft Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {resumeData.skills.soft.map((skill, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a soft skill..." />
                      <Button variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Final Review */}
            <TabsContent value="6" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Preview & Download</CardTitle>
                  <p className="text-muted-foreground">Review your resume and download in your preferred format</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Preview Area */}
                    <div className="border rounded-lg p-6 bg-white min-h-[600px]">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">{resumeData.personalInfo.name}</h2>
                        <p className="text-muted-foreground">{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                        <p className="text-muted-foreground">{resumeData.personalInfo.location}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b">Objective</h3>
                          <p className="text-sm">{resumeData.objective}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b">Technical Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.technical.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download Options */}
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => handleDownload('pdf')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" onClick={() => handleDownload('docx')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download DOCX
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setActiveStep(Math.min(resumeSteps.length - 1, activeStep + 1))}
              disabled={activeStep === resumeSteps.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResumeBuilder;
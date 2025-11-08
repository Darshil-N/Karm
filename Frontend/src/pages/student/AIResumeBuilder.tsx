import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService } from '@/services/firebaseService';
import { 
  Download, 
  Eye, 
  Plus, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Award,
  Code,
  Building2,
  Calendar,
  Edit,
  Save,
  FileText,
  Palette
} from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  cgpa?: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  certifications: string[];
  achievements: string[];
}

const resumeTemplates = {
  modern: {
    name: 'Modern Professional',
    description: 'Clean, modern design with accent colors',
    color: 'blue'
  },
  classic: {
    name: 'Classic Formal',
    description: 'Traditional professional layout',
    color: 'gray'
  },
  creative: {
    name: 'Creative Tech',
    description: 'Bold design for tech professionals',
    color: 'purple'
  },
  minimal: {
    name: 'Minimal Clean',
    description: 'Minimalist approach with focus on content',
    color: 'green'
  }
};

const AIResumeBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: []
  });

  // Load student data and populate resume
  useEffect(() => {
    const loadStudentData = async () => {
      if (!user?.studentId) return;
      
      try {
        setLoading(true);
        const data = await StudentService.getStudentByStudentId(user.studentId);
        setStudentData(data);
        
        if (data) {
          // Pre-populate resume with student data
          setResumeData({
            personalInfo: {
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              linkedin: data.linkedin || '',
              github: data.githubProfile?.username ? `https://github.com/${data.githubProfile.username}` : '',
              portfolio: data.portfolio || ''
            },
            summary: data.about || '',
            education: data.education || [{
              id: '1',
              institution: data.college || '',
              degree: data.degree || 'Bachelor of Technology',
              fieldOfStudy: data.branch || '',
              startYear: '',
              endYear: '',
              cgpa: data.cgpa?.toString() || ''
            }],
            experience: data.experience || [],
            projects: data.projects || (data.githubProfile?.repos ? 
              data.githubProfile.repos.slice(0, 3).map((repo: any, index: number) => ({
                id: (index + 1).toString(),
                title: repo.name,
                description: repo.description || 'Project description',
                technologies: repo.language ? [repo.language] : [],
                link: repo.html_url
              })) : []
            ),
            skills: data.skillSet || [],
            certifications: data.certifications || [],
            achievements: data.achievements || []
          });
        }
      } catch (error) {
        console.error('Error loading student data:', error);
        toast({
          title: "Error",
          description: "Failed to load student data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [user, toast]);

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: ''
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExp]
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: []
    };
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      cgpa: ''
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEdu]
    });
  };

  const removeItem = (type: string, id: string) => {
    setResumeData({
      ...resumeData,
      [type]: resumeData[type as keyof ResumeData].filter((item: any) => item.id !== id)
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skill.trim()]
      });
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(s => s !== skill)
    });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Save current resume data to student profile
      await StudentService.updateStudent(user?.studentId || '', {
        resumeData: resumeData,
        lastResumeUpdate: new Date()
      });

      // Generate PDF (this would typically use a PDF library like jsPDF or Puppeteer)
      const resumeHTML = generateResumeHTML();
      const blob = new Blob([resumeHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume Generated",
        description: "Your resume has been downloaded successfully!"
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate resume",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateResumeHTML = () => {
    const templateColors = {
      modern: '#3B82F6',
      classic: '#374151',
      creative: '#8B5CF6',
      minimal: '#10B981'
    };

    const primaryColor = templateColors[selectedTemplate as keyof typeof templateColors];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personalInfo.name} - Resume</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .resume {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      background: ${primaryColor};
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 2.5em;
    }
    .contact-info {
      margin: 10px 0;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .section {
      padding: 20px 30px;
      border-bottom: 1px solid #eee;
    }
    .section h2 {
      color: ${primaryColor};
      margin-bottom: 15px;
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 5px;
    }
    .experience-item, .project-item, .education-item {
      margin-bottom: 20px;
    }
    .experience-item h3, .project-item h3, .education-item h3 {
      margin: 0 0 5px 0;
      color: #333;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-tag {
      background: ${primaryColor};
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.9em;
    }
    .date {
      color: #666;
      font-style: italic;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="resume">
    <div class="header">
      <h1>${resumeData.personalInfo.name}</h1>
      <div class="contact-info">
        <span>${resumeData.personalInfo.email}</span>
        <span>${resumeData.personalInfo.phone}</span>
        ${resumeData.personalInfo.address ? `<span>${resumeData.personalInfo.address}</span>` : ''}
        ${resumeData.personalInfo.linkedin ? `<span>${resumeData.personalInfo.linkedin}</span>` : ''}
        ${resumeData.personalInfo.github ? `<span>${resumeData.personalInfo.github}</span>` : ''}
      </div>
    </div>

    ${resumeData.summary ? `
    <div class="section">
      <h2>Professional Summary</h2>
      <p>${resumeData.summary}</p>
    </div>
    ` : ''}

    <div class="section">
      <h2>Education</h2>
      ${resumeData.education.map(edu => `
        <div class="education-item">
          <h3>${edu.degree} in ${edu.fieldOfStudy}</h3>
          <p><strong>${edu.institution}</strong></p>
          <p class="date">${edu.startYear} - ${edu.endYear}</p>
          ${edu.cgpa ? `<p>CGPA: ${edu.cgpa}</p>` : ''}
        </div>
      `).join('')}
    </div>

    ${resumeData.experience.length > 0 ? `
    <div class="section">
      <h2>Experience</h2>
      ${resumeData.experience.map(exp => `
        <div class="experience-item">
          <h3>${exp.position}</h3>
          <p><strong>${exp.company}</strong> <span class="date">${exp.duration}</span></p>
          <p>${exp.description}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${resumeData.projects.length > 0 ? `
    <div class="section">
      <h2>Projects</h2>
      ${resumeData.projects.map(project => `
        <div class="project-item">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          ${project.technologies.length > 0 ? `
            <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
          ` : ''}
          ${project.link ? `<p><strong>Link:</strong> <a href="${project.link}">${project.link}</a></p>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${resumeData.skills.length > 0 ? `
    <div class="section">
      <h2>Skills</h2>
      <div class="skills">
        ${resumeData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    ${resumeData.achievements.length > 0 ? `
    <div class="section">
      <h2>Achievements</h2>
      <ul>
        ${resumeData.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    ${resumeData.certifications.length > 0 ? `
    <div class="section">
      <h2>Certifications</h2>
      <ul>
        ${resumeData.certifications.map(cert => `<li>${cert}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  </div>
</body>
</html>
    `;
  };

  const ResumePreview = () => (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" ref={resumeRef}>
      <div 
        className="text-white p-8 text-center"
        style={{ backgroundColor: selectedTemplate === 'modern' ? '#3B82F6' : 
                 selectedTemplate === 'classic' ? '#374151' : 
                 selectedTemplate === 'creative' ? '#8B5CF6' : '#10B981' }}
      >
        <h1 className="text-3xl font-bold">{resumeData.personalInfo.name}</h1>
        <div className="mt-4 flex justify-center flex-wrap gap-4 text-sm">
          <span>{resumeData.personalInfo.email}</span>
          <span>{resumeData.personalInfo.phone}</span>
          {resumeData.personalInfo.address && <span>{resumeData.personalInfo.address}</span>}
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        {resumeData.summary && (
          <section>
            <h2 className="text-xl font-bold mb-3 border-b-2 border-primary pb-1">Professional Summary</h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-3 border-b-2 border-primary pb-1">Education</h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <h3 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear}</p>
              {edu.cgpa && <p className="text-sm">CGPA: {edu.cgpa}</p>}
            </div>
          ))}
        </section>

        {resumeData.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 border-b-2 border-primary pb-1">Experience</h2>
            {resumeData.experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                <p className="text-sm text-gray-700">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {resumeData.projects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 border-b-2 border-primary pb-1">Projects</h2>
            {resumeData.projects.map(project => (
              <div key={project.id} className="mb-4">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-700">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-sm">Technologies: </strong>
                    <span className="text-sm">{project.technologies.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {resumeData.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 border-b-2 border-primary pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
          <p className="text-muted-foreground">Create professional resumes with AI-powered templates</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Builder Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="extras">Extras</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={resumeData.personalInfo.address}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, address: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub</Label>
                      <Input
                        value={resumeData.personalInfo.github}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Summary</Label>
                    <Textarea
                      placeholder="Write a brief professional summary about yourself..."
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </div>
                    <Button size="sm" onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Education Entry</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('education', edu.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.fieldOfStudy}
                            onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CGPA/Grade</Label>
                          <Input
                            value={edu.cgpa}
                            onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Year</Label>
                          <Input
                            value={edu.startYear}
                            onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Year</Label>
                          <Input
                            value={edu.endYear}
                            onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Work Experience
                    </div>
                    <Button size="sm" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Experience Entry</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('experience', exp.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g., Jan 2023 - Dec 2023"
                            value={exp.duration}
                            onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements..."
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4" />
                      <p>No work experience added yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Projects
                    </div>
                    <Button size="sm" onClick={addProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Project Entry</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('projects', project.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Project Title</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe your project and its key features..."
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Technologies Used</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer">
                                {tech}
                                <X 
                                  className="h-3 w-3 ml-1" 
                                  onClick={() => {
                                    const newTechs = project.technologies.filter((_, i) => i !== index);
                                    updateProject(project.id, 'technologies', newTechs);
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Add technology and press Enter"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const tech = e.currentTarget.value.trim();
                                if (tech && !project.technologies.includes(tech)) {
                                  updateProject(project.id, 'technologies', [...project.technologies, tech]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Project Link (Optional)</Label>
                          <Input
                            placeholder="https://github.com/username/project"
                            value={project.link || ''}
                            onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Skills</Label>
                    <Input
                      placeholder="Type a skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer">
                        {skill}
                        <X className="h-3 w-3 ml-1" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extras" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <Textarea
                      placeholder="List your certifications (one per line)"
                      value={resumeData.certifications.join('\n')}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        certifications: e.target.value.split('\n').filter(cert => cert.trim())
                      })}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Achievements & Awards</Label>
                    <Textarea
                      placeholder="List your achievements and awards (one per line)"
                      value={resumeData.achievements.join('\n')}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        achievements: e.target.value.split('\n').filter(achievement => achievement.trim())
                      })}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Template Selection and Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Resume Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(resumeTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4 space-y-2">
                {Object.entries(resumeTemplates).map(([key, template]) => (
                  <div
                    key={key}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedTemplate === key ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedTemplate(key)}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => setIsPreviewOpen(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Resume
              </Button>
              <Button 
                className="w-full" 
                onClick={generatePDF}
                disabled={isGenerating}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Download Resume'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
            <DialogDescription>
              Preview your resume before downloading
            </DialogDescription>
          </DialogHeader>
          <ResumePreview />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={generatePDF} disabled={isGenerating}>
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIResumeBuilder;
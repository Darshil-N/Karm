import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Award,
  Upload,
  Edit,
  Save,
  X,
  Plus,
  FileText,
  Download
} from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Smith',
    email: 'john.smith@college.edu',
    phone: '+91 98765 43210',
    rollNumber: 'CSE21001',
    branch: 'Computer Science Engineering',
    batch: '2021-2025',
    cgpa: '8.75',
    currentSemester: '8',
    location: 'Mumbai, Maharashtra',
    about: 'Passionate software developer with strong problem-solving skills and experience in full-stack web development.',
    linkedIn: 'https://linkedin.com/in/johnsmith',
    github: 'https://github.com/johnsmith',
    skills: ['React', 'Node.js', 'Python', 'Java', 'MongoDB', 'AWS'],
    languages: ['English', 'Hindi', 'Marathi']
  });

  const [academics] = useState([
    {
      id: 1,
      degree: 'B.Tech Computer Science Engineering',
      institution: 'ABC Engineering College',
      duration: '2021-2025',
      cgpa: '8.75',
      status: 'Pursuing'
    },
    {
      id: 2,
      degree: 'Higher Secondary (12th)',
      institution: 'XYZ Higher Secondary School',
      duration: '2019-2021',
      percentage: '92.5%',
      status: 'Completed'
    },
    {
      id: 3,
      degree: 'Secondary (10th)',
      institution: 'XYZ Secondary School',
      duration: '2017-2019',
      percentage: '95.2%',
      status: 'Completed'
    }
  ]);

  const [projects] = useState([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce application built with MERN stack featuring user authentication, payment integration, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
      duration: 'Jun 2024 - Aug 2024',
      githubLink: 'https://github.com/johnsmith/ecommerce',
      liveLink: 'https://ecommerce-demo.com'
    },
    {
      id: 2,
      title: 'Task Management System',
      description: 'A collaborative task management application with real-time updates, file sharing, and team collaboration features.',
      technologies: ['Vue.js', 'Firebase', 'Socket.io', 'Tailwind CSS'],
      duration: 'Mar 2024 - May 2024',
      githubLink: 'https://github.com/johnsmith/taskmanager',
      liveLink: 'https://taskmanager-demo.com'
    }
  ]);

  const [certifications] = useState([
    {
      id: 1,
      name: 'AWS Certified Developer Associate',
      issuer: 'Amazon Web Services',
      issueDate: 'December 2023',
      expiryDate: 'December 2026',
      credentialId: 'AWS-CDA-2023-123456'
    },
    {
      id: 2,
      name: 'React Developer Certification',
      issuer: 'Meta',
      issueDate: 'October 2023',
      credentialId: 'META-REACT-2023-789012'
    }
  ]);

  const handleSaveProfile = () => {
    setEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleUploadResume = () => {
    toast({
      title: "Resume Upload",
      description: "Resume upload functionality will be implemented.",
    });
  };

  const handleDownloadResume = () => {
    toast({
      title: "Download Resume",
      description: "Downloading your latest resume...",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and academic details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUploadResume}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resume
          </Button>
          <Button variant="outline" onClick={handleDownloadResume}>
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </Button>
          {editing ? (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Details</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      disabled={!editing}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      value={profileData.rollNumber}
                      disabled={!editing}
                      onChange={(e) => setProfileData({...profileData, rollNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={!editing}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      disabled={!editing}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={profileData.branch}
                      disabled={!editing}
                      onChange={(e) => setProfileData({...profileData, branch: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="batch">Batch</Label>
                    <Input
                      id="batch"
                      value={profileData.batch}
                      disabled={!editing}
                      onChange={(e) => setProfileData({...profileData, batch: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div>
                <Label htmlFor="about">About Me</Label>
                <Textarea
                  id="about"
                  rows={4}
                  value={profileData.about}
                  disabled={!editing}
                  onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills */}
              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {editing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Skill
                    </Button>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                  {editing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Language
                    </Button>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={profileData.linkedIn}
                    disabled={!editing}
                    onChange={(e) => setProfileData({...profileData, linkedIn: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    value={profileData.github}
                    disabled={!editing}
                    onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academics.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{record.degree}</h3>
                        <p className="text-sm text-muted-foreground">{record.institution}</p>
                      </div>
                      <Badge variant={record.status === 'Completed' ? 'default' : 'secondary'}>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{record.duration}</span>
                      <span className="font-medium">
                        {record.cgpa ? `CGPA: ${record.cgpa}` : `Percentage: ${record.percentage}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Projects
                </CardTitle>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          GitHub
                        </Button>
                        <Button variant="outline" size="sm">
                          Live Demo
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications & Achievements
                </CardTitle>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        View Certificate
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Issued: {cert.issueDate}</span>
                      {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                    </div>
                    {cert.credentialId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
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

export default Profile;
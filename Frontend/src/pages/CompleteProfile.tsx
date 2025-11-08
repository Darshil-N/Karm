import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService } from '@/services/firebaseService';
import { CheckCircle, User, GraduationCap, Award, Code } from 'lucide-react';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [student, setStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Academic Information
    branch: '',
    year: '',
    cgpa: '',
    marks10th: '',
    marks12th: '',
    
    // Additional Information
    location: '',
    linkedinProfile: '',
    skillSet: '',
    achievements: '',
    guardianContact: '',
    
    // Experience & Projects
    internships: '',
    projects: '',
    certifications: ''
  });

  useEffect(() => {
    if (!studentId) {
      toast({
        title: "Invalid Access",
        description: "Student ID is required to complete profile",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Fetch student basic info
    const fetchStudent = async () => {
      try {
        const studentData = await StudentService.getStudentByStudentId(studentId);
        if (!studentData) {
          toast({
            title: "Student Not Found",
            description: "Unable to find student with this ID",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        setStudent(studentData);
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({
          title: "Error",
          description: "Failed to load student information",
          variant: "destructive",
        });
      }
    };

    fetchStudent();
  }, [studentId, navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.branch || !formData.year || !formData.cgpa) {
      toast({
        title: "Missing Required Information",
        description: "Please fill in branch, year, and CGPA",
        variant: "destructive",
      });
      return;
    }

    // Validate CGPA
    const cgpaValue = parseFloat(formData.cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      toast({
        title: "Invalid CGPA",
        description: "Please enter a valid CGPA between 0 and 10",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare complete profile data
      const profileData = {
        branch: formData.branch,
        year: formData.year,
        cgpa: cgpaValue,
        marks10th: formData.marks10th ? parseFloat(formData.marks10th) : null,
        marks12th: formData.marks12th ? parseFloat(formData.marks12th) : null,
        location: formData.location,
        linkedinProfile: formData.linkedinProfile,
        skillSet: formData.skillSet ? formData.skillSet.split(',').map(skill => skill.trim()) : [],
        achievements: formData.achievements ? formData.achievements.split('\n').filter(a => a.trim()) : [],
        guardianContact: formData.guardianContact,
        projects: formData.projects ? formData.projects.split('\n').map(project => ({
          title: project.trim(),
          description: '',
          technologies: []
        })) : [],
        internships: formData.internships,
        certifications: formData.certifications ? formData.certifications.split('\n').filter(c => c.trim()) : [],
      };

      await StudentService.completeStudentProfile(studentId!, profileData);
      
      // Update the user data in auth context to reflect profile completion
      if (user) {
        const updatedUser = {
          ...user,
          profileCompleted: true,
          branch: profileData.branch,
          year: profileData.year,
          cgpa: profileData.cgpa
        };
        login(updatedUser);
      }
      
      toast({
        title: "Profile Completed Successfully!",
        description: "Welcome to the student portal. You can now access all features.",
      });
      navigate('/student/dashboard');
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast({
        title: "Failed to Complete Profile",
        description: error.message || "An error occurred while completing your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    // Validate required fields for current step
    if (currentStep === 1) {
      if (!formData.branch || !formData.year || !formData.cgpa) {
        toast({
          title: "Missing Information",
          description: "Please fill in all academic information fields",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderAcademicInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Academic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="branch">Branch/Department *</Label>
          <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
              <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
              <SelectItem value="Biotechnology">Biotechnology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Current Year *</Label>
          <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select current year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
              <SelectItem value="4th Year">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cgpa">Current CGPA *</Label>
          <Input
            id="cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            required
            value={formData.cgpa}
            onChange={(e) => handleInputChange('cgpa', e.target.value)}
            placeholder="9.50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marks10th">10th Grade Percentage</Label>
          <Input
            id="marks10th"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.marks10th}
            onChange={(e) => handleInputChange('marks10th', e.target.value)}
            placeholder="95.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marks12th">12th Grade Percentage</Label>
          <Input
            id="marks12th"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.marks12th}
            onChange={(e) => handleInputChange('marks12th', e.target.value)}
            placeholder="92.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianContact">Guardian Contact</Label>
          <Input
            id="guardianContact"
            value={formData.guardianContact}
            onChange={(e) => handleInputChange('guardianContact', e.target.value)}
            placeholder="Guardian's phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Code className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Additional Information</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
            <Input
              id="linkedinProfile"
              type="url"
              value={formData.linkedinProfile}
              onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skillSet">Technical Skills</Label>
          <Input
            id="skillSet"
            value={formData.skillSet}
            onChange={(e) => handleInputChange('skillSet', e.target.value)}
            placeholder="Java, Python, React, Node.js, MySQL (comma separated)"
          />
          <p className="text-sm text-muted-foreground">Enter skills separated by commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projects">Projects</Label>
          <Textarea
            id="projects"
            value={formData.projects}
            onChange={(e) => handleInputChange('projects', e.target.value)}
            placeholder="List your projects (one per line)"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achievements">Achievements & Awards</Label>
          <Textarea
            id="achievements"
            value={formData.achievements}
            onChange={(e) => handleInputChange('achievements', e.target.value)}
            placeholder="List your achievements and awards (one per line)"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="internships">Internship Experience</Label>
          <Textarea
            id="internships"
            value={formData.internships}
            onChange={(e) => handleInputChange('internships', e.target.value)}
            placeholder="Describe your internship experience"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications</Label>
          <Textarea
            id="certifications"
            value={formData.certifications}
            onChange={(e) => handleInputChange('certifications', e.target.value)}
            placeholder="List your certifications (one per line)"
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">Complete Your Profile</CardTitle>
          
          {/* Student Info */}
          <div className="bg-muted rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{student.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{studentId}</Badge>
                  <span className="text-sm text-muted-foreground">{student.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-4">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 2: {
                currentStep === 1 ? 'Academic Information' : 'Additional Information'
              }
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            <div className="mb-8">
              {currentStep === 1 && renderAcademicInfo()}
              {currentStep === 2 && renderAdditionalInfo()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 2 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Completing Profile...' : 'Complete Profile & Access Portal'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
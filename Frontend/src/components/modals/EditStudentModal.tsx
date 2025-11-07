import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Star, 
  Calendar,
  Briefcase,
  Award,
  Plus,
  X
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  cgpa: number;
  placementStatus: string;
  company?: string;
  package?: string;
  skillSet: string[];
  location: string;
  resumeScore: number;
  applications: number;
  offers: number;
  profileDetails: {
    rollNumber: string;
    dateOfBirth: string;
    address: string;
    fatherName: string;
    motherName: string;
    emergencyContact: string;
  };
  academicDetails: {
    tenthPercentage: number;
    twelfthPercentage: number;
    diplomaPercentage?: number;
    backlogs: number;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      duration: string;
    }>;
    internships: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  };
  placementHistory: Array<{
    company: string;
    role: string;
    applicationDate: string;
    status: string;
    currentRound: string;
  }>;
}

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onUpdateStudent: (updatedStudent: Student) => void;
}

const EditStudentModal = ({ open, onOpenChange, student, onUpdateStudent }: EditStudentModalProps) => {
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<any>({});
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: [],
    duration: ''
  });
  const [newInternship, setNewInternship] = useState({
    company: '',
    role: '',
    duration: '',
    description: ''
  });
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: ''
  });

  // Initialize form data when student changes
  useEffect(() => {
    if (student) {
      setFormData({ ...student });
    }
  }, [student]);

  const handleInputChange = (field: string, value: any, section?: string) => {
    if (section) {
      setFormData((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        skillSet: [...(prev.skillSet || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      skillSet: prev.skillSet.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        academicDetails: {
          ...prev.academicDetails,
          projects: [...(prev.academicDetails?.projects || []), newProject]
        }
      }));
      setNewProject({ title: '', description: '', technologies: [], duration: '' });
    }
  };

  const handleAddInternship = () => {
    if (newInternship.company.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        academicDetails: {
          ...prev.academicDetails,
          internships: [...(prev.academicDetails?.internships || []), newInternship]
        }
      }));
      setNewInternship({ company: '', role: '', duration: '', description: '' });
    }
  };

  const handleAddCertification = () => {
    if (newCertification.name.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        academicDetails: {
          ...prev.academicDetails,
          certifications: [...(prev.academicDetails?.certifications || []), newCertification]
        }
      }));
      setNewCertification({ name: '', issuer: '', date: '' });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive"
      });
      return;
    }

    onUpdateStudent(formData);
    onOpenChange(false);
  };

  if (!student || !formData.id) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Student: {student.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="placement">Placement</TabsTrigger>
            <TabsTrigger value="skills">Skills & Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      value={formData.profileDetails?.rollNumber || ''}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value, 'profileDetails')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.profileDetails?.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value, 'profileDetails')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.profileDetails?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value, 'profileDetails')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      value={formData.profileDetails?.fatherName || ''}
                      onChange={(e) => handleInputChange('fatherName', e.target.value, 'profileDetails')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      value={formData.profileDetails?.motherName || ''}
                      onChange={(e) => handleInputChange('motherName', e.target.value, 'profileDetails')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.profileDetails?.emergencyContact || ''}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value, 'profileDetails')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select
                      value={formData.branch || ''}
                      onValueChange={(value) => handleInputChange('branch', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.year || ''}
                      onValueChange={(value) => handleInputChange('year', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
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
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa || ''}
                      onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenthPercentage">10th Percentage</Label>
                    <Input
                      id="tenthPercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.academicDetails?.tenthPercentage || ''}
                      onChange={(e) => handleInputChange('tenthPercentage', parseFloat(e.target.value), 'academicDetails')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twelfthPercentage">12th Percentage</Label>
                    <Input
                      id="twelfthPercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.academicDetails?.twelfthPercentage || ''}
                      onChange={(e) => handleInputChange('twelfthPercentage', parseFloat(e.target.value), 'academicDetails')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backlogs">Backlogs</Label>
                    <Input
                      id="backlogs"
                      type="number"
                      min="0"
                      value={formData.academicDetails?.backlogs || ''}
                      onChange={(e) => handleInputChange('backlogs', parseInt(e.target.value), 'academicDetails')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Placement Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placementStatus">Placement Status</Label>
                    <Select
                      value={formData.placementStatus || ''}
                      onValueChange={(value) => handleInputChange('placementStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Placed">Placed</SelectItem>
                        <SelectItem value="In Process">In Process</SelectItem>
                        <SelectItem value="Applying">Applying</SelectItem>
                        <SelectItem value="Not Placed">Not Placed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resumeScore">Resume Score (%)</Label>
                    <Input
                      id="resumeScore"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.resumeScore || ''}
                      onChange={(e) => handleInputChange('resumeScore', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {formData.placementStatus === 'Placed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company || ''}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="package">Package</Label>
                      <Input
                        id="package"
                        value={formData.package || ''}
                        onChange={(e) => handleInputChange('package', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applications">Total Applications</Label>
                    <Input
                      id="applications"
                      type="number"
                      min="0"
                      value={formData.applications || ''}
                      onChange={(e) => handleInputChange('applications', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offers">Total Offers</Label>
                    <Input
                      id="offers"
                      type="number"
                      min="0"
                      value={formData.offers || ''}
                      onChange={(e) => handleInputChange('offers', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillSet?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveSkill(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <Input
                    placeholder="Duration"
                    value={newProject.duration}
                    onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddProject} size="sm" disabled={!newProject.title.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;
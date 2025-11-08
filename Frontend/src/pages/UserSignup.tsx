import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { StudentService } from '@/services/firebaseService';
import { GraduationCap } from 'lucide-react';

const UserSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [colleges, setColleges] = useState<Array<{
    id: string;
    name: string;
    hodEmail: string;
    hodUid: string;
    website?: string;
  }>>([]);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    email: '',
    phone: '',
    password: ''
  });

  // Load approved colleges on component mount
  useEffect(() => {
    const loadColleges = async () => {
      try {
        const approvedColleges = await StudentService.getApprovedColleges();
        setColleges(approvedColleges);
      } catch (error) {
        console.error('Error loading colleges:', error);
        toast({
          title: "Error Loading Universities",
          description: "Failed to load approved universities. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadColleges();
  }, [toast]);

  const handleInputChange = (field: string, value: string) => {
    // Convert email to lowercase for Firebase compatibility
    if (field === 'email') {
      value = value.toLowerCase().trim();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUniversitySelect = (collegeId: string) => {
    const selected = colleges.find(college => college.id === collegeId);
    if (selected) {
      setSelectedCollege(selected);
      setFormData(prev => ({ ...prev, university: selected.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.university || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCollege) {
      toast({
        title: "University Required",
        description: "Please select a university from the dropdown",
        variant: "destructive",
      });
      return;
    }

    // Validate email format with Firebase-compatible validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address (e.g., john@example.com)",
        variant: "destructive",
      });
      return;
    }

    // Additional Firebase email validation
    const emailParts = formData.email.split('@');
    if (emailParts.length !== 2 || emailParts[1].length < 3) {
      toast({
        title: "Invalid Email Domain",
        description: "Email domain must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    const domain = emailParts[1];
    if (!domain.includes('.') || domain.split('.').pop()!.length < 2) {
      toast({
        title: "Invalid Email Format",
        description: "Email must have a valid domain extension (like .com, .org, .edu)",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Submit basic student data with HOD routing information
      await StudentService.createPendingStudent({
        name: formData.name,
        university: formData.university,
        universityId: selectedCollege.id,
        hodEmail: selectedCollege.hodEmail,
        hodUid: selectedCollege.hodUid,
        email: formData.email,
        phone: formData.phone,
        password: formData.password // Include password for auth account creation
      });
      
      toast({
        title: "Registration Submitted Successfully!",
        description: `Your application has been sent to ${selectedCollege.name} HOD (${selectedCollege.hodEmail}) for approval. You'll receive your student ID once approved.`,
      });
      navigate('/pending-approval');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">Student Registration</CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Apply for student portal access
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University/College *</Label>
              <Select onValueChange={handleUniversitySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.length === 0 ? (
                    <SelectItem value="loading" disabled>Loading universities...</SelectItem>
                  ) : (
                    colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedCollege && (
                <p className="text-xs text-muted-foreground">
                  🌐 {selectedCollege.website || 'No website available'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">University Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@university.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a secure password"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Submitting Application...' : 'Apply for Access'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your application will be sent to HOD for review</li>
              <li>• You'll receive a unique student ID upon approval</li>
              <li>• Access the portal with your ID for placements & results</li>
            </ul>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSignup;

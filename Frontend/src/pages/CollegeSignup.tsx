import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';

const CollegeSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '',
    website: '',
    licenseNumber: '',
    tpoEmail: '',
    tpoPassword: '',
    hodEmail: '',
    hodPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Application Submitted",
        description: "Your college registration is pending verification.",
      });
      navigate('/pending-verification');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">Register Your College</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                required
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">College Website</Label>
              <Input
                id="website"
                type="url"
                required
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">College License Number (AICTE/UGC)</Label>
              <Input
                id="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tpoEmail">TPO Email</Label>
              <Input
                id="tpoEmail"
                type="email"
                required
                value={formData.tpoEmail}
                onChange={(e) => setFormData({ ...formData, tpoEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tpoPassword">TPO Password</Label>
              <Input
                id="tpoPassword"
                type="password"
                required
                value={formData.tpoPassword}
                onChange={(e) => setFormData({ ...formData, tpoPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hodEmail">HOD Email</Label>
              <Input
                id="hodEmail"
                type="email"
                required
                value={formData.hodEmail}
                onChange={(e) => setFormData({ ...formData, hodEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hodPassword">HOD Password</Label>
              <Input
                id="hodPassword"
                type="password"
                required
                value={formData.hodPassword}
                onChange={(e) => setFormData({ ...formData, hodPassword: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already registered?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeSignup;

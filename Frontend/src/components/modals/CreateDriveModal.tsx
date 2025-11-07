import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface DriveFormData {
  companyName: string;
  roleName: string;
  jobDescription: string;
  salary: string;
  location: string;
  workMode: string;
  experience: string;
  skills: string[];
  eligibilityCriteria: {
    minCGPA: string;
    allowedBranches: string[];
    passingYear: string;
    backlogsAllowed: boolean;
  };
  applicationDeadline: Date | undefined;
  driveDate: Date | undefined;
  rounds: string[];
  benefits: string;
  bondPeriod: string;
  contactEmail: string;
  contactPhone: string;
}

interface CreateDriveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDriveModal = ({ open, onOpenChange }: CreateDriveModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentRound, setCurrentRound] = useState('');

  const [formData, setFormData] = useState<DriveFormData>({
    companyName: '',
    roleName: '',
    jobDescription: '',
    salary: '',
    location: '',
    workMode: '',
    experience: '',
    skills: [],
    eligibilityCriteria: {
      minCGPA: '',
      allowedBranches: [],
      passingYear: '',
      backlogsAllowed: false,
    },
    applicationDeadline: undefined,
    driveDate: undefined,
    rounds: [],
    benefits: '',
    bondPeriod: '',
    contactEmail: '',
    contactPhone: '',
  });

  const branches = [
    'Computer Science', 'Information Technology', 'Electronics', 
    'Mechanical', 'Civil', 'Electrical', 'Chemical'
  ];

  const workModes = ['On-site', 'Remote', 'Hybrid'];
  const experienceLevels = ['Fresher', '0-1 years', '1-3 years', '3-5 years'];

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addRound = () => {
    if (currentRound.trim() && !formData.rounds.includes(currentRound.trim())) {
      setFormData(prev => ({
        ...prev,
        rounds: [...prev.rounds, currentRound.trim()]
      }));
      setCurrentRound('');
    }
  };

  const removeRound = (round: string) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter(r => r !== round)
    }));
  };

  const handleBranchToggle = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        allowedBranches: prev.eligibilityCriteria.allowedBranches.includes(branch)
          ? prev.eligibilityCriteria.allowedBranches.filter(b => b !== branch)
          : [...prev.eligibilityCriteria.allowedBranches, branch]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call - replace with Firebase integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Firebase
      // const driveRef = await addDoc(collection(db, 'drives'), {
      //   ...formData,
      //   createdAt: new Date(),
      //   createdBy: currentUser.uid,
      //   status: 'draft'
      // });

      toast({
        title: "Drive Created Successfully",
        description: `${formData.companyName} - ${formData.roleName} drive has been created.`,
      });

      onOpenChange(false);
      // Reset form
      setFormData({
        companyName: '',
        roleName: '',
        jobDescription: '',
        salary: '',
        location: '',
        workMode: '',
        experience: '',
        skills: [],
        eligibilityCriteria: {
          minCGPA: '',
          allowedBranches: [],
          passingYear: '',
          backlogsAllowed: false,
        },
        applicationDeadline: undefined,
        driveDate: undefined,
        rounds: [],
        benefits: '',
        bondPeriod: '',
        contactEmail: '',
        contactPhone: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create drive. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Placement Drive</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g., Google Inc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                value={formData.roleName}
                onChange={(e) => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description *</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              placeholder="Detailed job description, responsibilities, and requirements..."
              rows={4}
              required
            />
          </div>

          {/* Compensation & Location */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Package *</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="e.g., ₹12 LPA"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Bangalore, Mumbai"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Work Mode *</Label>
              <Select value={formData.workMode} onValueChange={(value) => setFormData(prev => ({ ...prev, workMode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  {workModes.map(mode => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minCGPA">Minimum CGPA</Label>
                <Input
                  id="minCGPA"
                  value={formData.eligibilityCriteria.minCGPA}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    eligibilityCriteria: { ...prev.eligibilityCriteria, minCGPA: e.target.value }
                  }))}
                  placeholder="e.g., 7.0"
                  type="number"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingYear">Passing Year</Label>
                <Input
                  id="passingYear"
                  value={formData.eligibilityCriteria.passingYear}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    eligibilityCriteria: { ...prev.eligibilityCriteria, passingYear: e.target.value }
                  }))}
                  placeholder="e.g., 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Backlogs Allowed</Label>
                <Select 
                  value={formData.eligibilityCriteria.backlogsAllowed.toString()} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    eligibilityCriteria: { ...prev.eligibilityCriteria, backlogsAllowed: value === 'true' }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Allowed Branches</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {branches.map(branch => (
                  <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.eligibilityCriteria.allowedBranches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                      className="rounded"
                    />
                    <span className="text-sm">{branch}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.applicationDeadline ? format(formData.applicationDeadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.applicationDeadline}
                    onSelect={(date) => setFormData(prev => ({ ...prev, applicationDeadline: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Drive Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.driveDate ? format(formData.driveDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.driveDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, driveDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-2">
            <Label>Selection Rounds</Label>
            <div className="flex gap-2">
              <Input
                value={currentRound}
                onChange={(e) => setCurrentRound(e.target.value)}
                placeholder="e.g., Technical Round, HR Round"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRound())}
              />
              <Button type="button" onClick={addRound} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.rounds.map(round => (
                <span key={round} className="bg-secondary/10 text-secondary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {round}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRound(round)} />
                </span>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits & Perks</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                placeholder="Health insurance, flexible hours, etc."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bondPeriod">Bond Period</Label>
              <Input
                id="bondPeriod"
                value={formData.bondPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, bondPeriod: e.target.value }))}
                placeholder="e.g., 2 years"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="hr@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Drive"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDriveModal;
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus } from 'lucide-react';

interface CompanyFormData {
  name: string;
  industry: string;
  tier: string;
  description: string;
  website: string;
  headquarters: string;
  foundedYear: string;
  employeeCount: string;
  contactInfo: {
    hrName: string;
    hrEmail: string;
    hrPhone: string;
    recruitmentEmail: string;
    address: string;
  };
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  companyDetails: {
    specializations: string[];
    technologies: string[];
    benefits: string;
    workCulture: string;
    averagePackage: string;
  };
  logo: File | null;
}

interface AddCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCompanyModal = ({ open, onOpenChange }: AddCompanyModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSpecialization, setCurrentSpecialization] = useState('');
  const [currentTechnology, setCurrentTechnology] = useState('');

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    tier: '',
    description: '',
    website: '',
    headquarters: '',
    foundedYear: '',
    employeeCount: '',
    contactInfo: {
      hrName: '',
      hrEmail: '',
      hrPhone: '',
      recruitmentEmail: '',
      address: '',
    },
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: '',
    },
    companyDetails: {
      specializations: [],
      technologies: [],
      benefits: '',
      workCulture: '',
      averagePackage: '',
    },
    logo: null,
  });

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Automotive', 'Energy', 'Media', 'Real Estate'
  ];

  const tiers = ['Tier 1', 'Tier 2', 'Tier 3'];
  
  const employeeRanges = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', 
    '1001-5000', '5001-10000', '10000+'
  ];

  const addSpecialization = () => {
    if (currentSpecialization.trim() && !formData.companyDetails.specializations.includes(currentSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          specializations: [...prev.companyDetails.specializations, currentSpecialization.trim()]
        }
      }));
      setCurrentSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        specializations: prev.companyDetails.specializations.filter(s => s !== spec)
      }
    }));
  };

  const addTechnology = () => {
    if (currentTechnology.trim() && !formData.companyDetails.technologies.includes(currentTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          technologies: [...prev.companyDetails.technologies, currentTechnology.trim()]
        }
      }));
      setCurrentTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        technologies: prev.companyDetails.technologies.filter(t => t !== tech)
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call - replace with Firebase integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Firebase
      // if (formData.logo) {
      //   const logoRef = ref(storage, `company-logos/${formData.name}-${Date.now()}`);
      //   await uploadBytes(logoRef, formData.logo);
      //   const logoURL = await getDownloadURL(logoRef);
      //   formData.logoURL = logoURL;
      // }
      
      // const companyRef = await addDoc(collection(db, 'companies'), {
      //   ...formData,
      //   createdAt: new Date(),
      //   createdBy: currentUser.uid,
      //   status: 'active'
      // });

      toast({
        title: "Company Added Successfully",
        description: `${formData.name} has been added to the company database.`,
      });

      onOpenChange(false);
      // Reset form
      setFormData({
        name: '',
        industry: '',
        tier: '',
        description: '',
        website: '',
        headquarters: '',
        foundedYear: '',
        employeeCount: '',
        contactInfo: {
          hrName: '',
          hrEmail: '',
          hrPhone: '',
          recruitmentEmail: '',
          address: '',
        },
        socialMedia: {
          linkedin: '',
          twitter: '',
          facebook: '',
        },
        companyDetails: {
          specializations: [],
          technologies: [],
          benefits: '',
          workCulture: '',
          averagePackage: '',
        },
        logo: null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add company. Please try again.",
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
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Google Inc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website *</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://www.company.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company Tier *</Label>
                <Select value={formData.tier} onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map(tier => (
                      <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Employee Count</Label>
                <Select value={formData.employeeCount} onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headquarters">Headquarters</Label>
                <Input
                  id="headquarters"
                  value={formData.headquarters}
                  onChange={(e) => setFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                  placeholder="e.g., Mountain View, California"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
                  placeholder="e.g., 1998"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the company, its mission, and values..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                {formData.logo && (
                  <span className="text-sm text-green-600">Logo uploaded: {formData.logo.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hrName">HR Contact Name</Label>
                <Input
                  id="hrName"
                  value={formData.contactInfo.hrName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, hrName: e.target.value }
                  }))}
                  placeholder="HR Manager Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hrEmail">HR Email *</Label>
                <Input
                  id="hrEmail"
                  type="email"
                  value={formData.contactInfo.hrEmail}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, hrEmail: e.target.value }
                  }))}
                  placeholder="hr@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hrPhone">HR Phone</Label>
                <Input
                  id="hrPhone"
                  value={formData.contactInfo.hrPhone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, hrPhone: e.target.value }
                  }))}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruitmentEmail">Recruitment Email</Label>
                <Input
                  id="recruitmentEmail"
                  type="email"
                  value={formData.contactInfo.recruitmentEmail}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, recruitmentEmail: e.target.value }
                  }))}
                  placeholder="recruitment@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Office Address</Label>
              <Textarea
                id="address"
                value={formData.contactInfo.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, address: e.target.value }
                }))}
                placeholder="Complete office address"
                rows={3}
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                  }))}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                  }))}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentSpecialization}
                    onChange={(e) => setCurrentSpecialization(e.target.value)}
                    placeholder="Add specialization"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                  />
                  <Button type="button" onClick={addSpecialization} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.companyDetails.specializations.map(spec => (
                    <span key={spec} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      {spec}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialization(spec)} />
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentTechnology}
                    onChange={(e) => setCurrentTechnology(e.target.value)}
                    placeholder="Add technology"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.companyDetails.technologies.map(tech => (
                    <span key={tech} className="bg-secondary/10 text-secondary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      {tech}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnology(tech)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="averagePackage">Average Package Range</Label>
              <Input
                id="averagePackage"
                value={formData.companyDetails.averagePackage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: { ...prev.companyDetails, averagePackage: e.target.value }
                }))}
                placeholder="e.g., ₹8-15 LPA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits & Perks</Label>
              <Textarea
                id="benefits"
                value={formData.companyDetails.benefits}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: { ...prev.companyDetails, benefits: e.target.value }
                }))}
                placeholder="Health insurance, flexible hours, work from home, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workCulture">Work Culture</Label>
              <Textarea
                id="workCulture"
                value={formData.companyDetails.workCulture}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: { ...prev.companyDetails, workCulture: e.target.value }
                }))}
                placeholder="Description of company culture, values, and work environment..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding Company..." : "Add Company"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyModal;
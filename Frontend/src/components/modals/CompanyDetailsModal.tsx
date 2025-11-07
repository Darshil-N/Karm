import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Briefcase,
  Star,
  DollarSign,
  Clock,
  Award
} from 'lucide-react';

interface Company {
  id: number;
  name: string;
  logo: string;
  industry: string;
  location: string;
  tier: string;
  rating: number;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  stats: {
    totalDrives: number;
    totalHires: number;
    avgSalary: string;
    lastVisit: string;
  };
  description: string;
}

interface CompanyDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
}

const CompanyDetailsModal = ({ open, onOpenChange, company }: CompanyDetailsModalProps) => {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{company.logo}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{company.name}</h2>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            </div>
            <div className="ml-auto">
              <Badge variant={company.tier === 'Tier 1' ? 'default' : 'secondary'}>
                {company.tier}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Industry</p>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{company.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-sm text-muted-foreground">{company.rating} / 5.0</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tier</p>
                  <p className="text-sm text-muted-foreground">{company.tier}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{company.contact.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{company.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{company.contact.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Placement Statistics */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Placement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mx-auto mb-2">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">{company.stats.totalDrives}</p>
                  <p className="text-xs text-muted-foreground">Total Drives</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mx-auto mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">{company.stats.totalHires}</p>
                  <p className="text-xs text-muted-foreground">Total Hires</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 mx-auto mb-2">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold">{company.stats.avgSalary}</p>
                  <p className="text-xs text-muted-foreground">Avg Package</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mx-auto mb-2">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">{new Date(company.stats.lastVisit).getFullYear()}</p>
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Description */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">About Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDetailsModal;
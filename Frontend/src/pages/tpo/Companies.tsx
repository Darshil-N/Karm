import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Briefcase,
  Edit,
  Eye,
  Star
} from 'lucide-react';
import AddCompanyModal from '@/components/modals/AddCompanyModal';

const Companies = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);

  const handleAddNewCompany = () => {
    setAddCompanyOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Search Updated",
      description: `Searching for: ${value}`,
    });
  };

  const handleFilter = (filterType: string) => {
    toast({
      title: "Filter Applied",
      description: `Filtering by: ${filterType}`,
    });
  };

  const handleViewCompany = (companyId: number, companyName: string) => {
    toast({
      title: "View Company",
      description: `Opening ${companyName} profile...`,
    });
  };

  const handleEditCompany = (companyId: number, companyName: string) => {
    toast({
      title: "Edit Company",
      description: `Opening ${companyName} editor...`,
    });
  };

  const handleCreateDrive = (companyId: number, companyName: string) => {
    toast({
      title: "Create Drive",
      description: `Creating new drive for ${companyName}...`,
    });
  };

  const companies = [
    {
      id: 1,
      name: 'Google',
      logo: 'G',
      industry: 'Technology',
      location: 'Mountain View, CA',
      tier: 'Tier 1',
      rating: 4.8,
      contact: {
        email: 'hr@google.com',
        phone: '+1-650-253-0000',
        website: 'www.google.com'
      },
      stats: {
        totalDrives: 8,
        totalHires: 45,
        avgSalary: '₹24 LPA',
        lastVisit: '2024-10-15'
      },
      description: 'Leading technology company focused on internet-related services and products.'
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: 'M',
      industry: 'Technology',
      location: 'Redmond, WA',
      tier: 'Tier 1',
      rating: 4.7,
      contact: {
        email: 'careers@microsoft.com',
        phone: '+1-425-882-8080',
        website: 'www.microsoft.com'
      },
      stats: {
        totalDrives: 6,
        totalHires: 38,
        avgSalary: '₹28 LPA',
        lastVisit: '2024-09-20'
      },
      description: 'Multinational technology company developing computer software, consumer electronics, and services.'
    },
    {
      id: 3,
      name: 'Amazon',
      logo: 'A',
      industry: 'E-commerce',
      location: 'Seattle, WA',
      tier: 'Tier 1',
      rating: 4.5,
      contact: {
        email: 'university@amazon.com',
        phone: '+1-206-266-1000',
        website: 'www.amazon.com'
      },
      stats: {
        totalDrives: 10,
        totalHires: 52,
        avgSalary: '₹22 LPA',
        lastVisit: '2024-11-01'
      },
      description: 'American multinational technology company focusing on e-commerce and cloud computing.'
    },
    {
      id: 4,
      name: 'TCS',
      logo: 'T',
      industry: 'IT Services',
      location: 'Mumbai, India',
      tier: 'Tier 2',
      rating: 4.1,
      contact: {
        email: 'recruitment@tcs.com',
        phone: '+91-22-6778-9595',
        website: 'www.tcs.com'
      },
      stats: {
        totalDrives: 15,
        totalHires: 89,
        avgSalary: '₹3.5 LPA',
        lastVisit: '2024-10-30'
      },
      description: 'Indian multinational information technology services and consulting company.'
    },
    {
      id: 5,
      name: 'Infosys',
      logo: 'I',
      industry: 'IT Services',
      location: 'Bangalore, India',
      tier: 'Tier 2',
      rating: 4.2,
      contact: {
        email: 'campushiring@infosys.com',
        phone: '+91-80-2852-0261',
        website: 'www.infosys.com'
      },
      stats: {
        totalDrives: 12,
        totalHires: 76,
        avgSalary: '₹4.2 LPA',
        lastVisit: '2024-11-05'
      },
      description: 'Indian multinational corporation providing business consulting and IT services.'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-primary text-primary-foreground';
      case 'Tier 2': return 'bg-secondary text-secondary-foreground';
      case 'Tier 3': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Companies</h1>
          <p className="text-muted-foreground">Manage company partnerships and recruitment relationships</p>
        </div>
        <Button className="gap-2" onClick={handleAddNewCompany}>
          <Plus className="h-4 w-4" />
          Add New Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-3xl font-bold">45</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-3xl font-bold">38</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tier 1 Companies</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search companies by name, industry, or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Industry')}>
                <Filter className="h-4 w-4" />
                Industry
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Tier')}>
                <Star className="h-4 w-4" />
                Tier
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Location')}>
                <MapPin className="h-4 w-4" />
                Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              {/* Company Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-2xl">
                  {company.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{company.name}</h3>
                    <Badge className={getTierColor(company.tier)}>
                      {company.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{company.rating}</span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {company.contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  {company.contact.website}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Drives</p>
                  <p className="font-bold">{company.stats.totalDrives}</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Hires</p>
                  <p className="font-bold">{company.stats.totalHires}</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Avg Salary</p>
                  <p className="font-bold text-primary">{company.stats.avgSalary}</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="font-bold text-xs">{new Date(company.stats.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                {company.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleViewCompany(company.id, company.name)}>
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleEditCompany(company.id, company.name)}>
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button size="sm" className="flex-1 gap-1" onClick={() => handleCreateDrive(company.id, company.name)}>
                  <Briefcase className="h-3 w-3" />
                  Create Drive
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <AddCompanyModal 
        open={addCompanyOpen} 
        onOpenChange={setAddCompanyOpen} 
      />
    </div>
  );
};

export default Companies;
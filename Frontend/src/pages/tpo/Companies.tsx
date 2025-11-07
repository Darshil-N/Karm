import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { CompanyService, Company } from '@/services/firebaseService';
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
  Star,
  X
} from 'lucide-react';
import AddCompanyModal from '@/components/modals/AddCompanyModal';
import CompanyDetailsModal from '@/components/modals/CompanyDetailsModal';
import EditCompanyModal from '@/components/modals/EditCompanyModal';
import CreateDriveModal from '@/components/modals/CreateDriveModal';

const Companies = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [createDriveOpen, setCreateDriveOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Load companies from Firebase on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const companiesData = await CompanyService.getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast({
          title: "Error Loading Companies",
          description: "Failed to load companies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();

    // Subscribe to real-time updates
    const unsubscribe = CompanyService.subscribeToCompanies((companiesData) => {
      setCompanies(companiesData);
    });

    return () => unsubscribe();
  }, [toast]);

  // Get unique values for filter dropdowns
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(companies.map(c => c.industry).filter(Boolean))];
    return ['all', ...uniqueIndustries];
  }, [companies]);

  const tiers = useMemo(() => {
    const uniqueTiers = [...new Set(companies.map(c => c.tier).filter(Boolean))];
    return ['all', ...uniqueTiers];
  }, [companies]);

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(companies.map(c => c.location?.split(',')[0]?.trim()).filter(Boolean))]; // Get city part
    return ['all', ...uniqueLocations];
  }, [companies]);

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Industry filter
      const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;

      // Tier filter
      const matchesTier = selectedTier === 'all' || company.tier === selectedTier;

      // Location filter (match city part)
      const matchesLocation = selectedLocation === 'all' || 
        company.location.split(',')[0].trim() === selectedLocation;

      return matchesSearch && matchesIndustry && matchesTier && matchesLocation;
    });
  }, [companies, searchTerm, selectedIndustry, selectedTier, selectedLocation]);

  const handleAddNewCompany = () => {
    setAddCompanyOpen(true);
  };

  const handleCompanyAdded = (newCompany: any) => {
    setCompanies(prevCompanies => [...prevCompanies, newCompany]);
    toast({
      title: "Company Added",
      description: `${newCompany.name} has been successfully added to your companies list.`,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Search Updated",
      description: `Searching for: ${value}`,
    });
  };

  const handleViewCompany = (companyId: string, companyName: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setCompanyDetailsOpen(true);
    }
  };

  const handleEditCompany = (companyId: string, companyName: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setEditCompanyOpen(true);
    }
  };

  const handleCreateDrive = (companyId: string, companyName: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setCreateDriveOpen(true);
    }
  };

  const handleCompanyUpdated = (updatedCompanyData: any) => {
    if (selectedCompany) {
      // Update the company in the companies array
      setCompanies(prev => prev.map(company => 
        company.id === selectedCompany.id 
          ? {
              ...company,
              name: updatedCompanyData.name,
              industry: updatedCompanyData.industry,
              tier: updatedCompanyData.tier,
              description: updatedCompanyData.description,
              location: updatedCompanyData.location,
              contact: {
                ...company.contact,
                email: updatedCompanyData.contactEmail,
                phone: updatedCompanyData.contactPhone,
                website: updatedCompanyData.website,
              },
              stats: {
                ...company.stats,
                avgSalary: updatedCompanyData.avgSalary,
              }
            }
          : company
      ));

      // Update selectedCompany to reflect changes in other modals
      setSelectedCompany(prev => ({
        ...prev,
        name: updatedCompanyData.name,
        industry: updatedCompanyData.industry,
        tier: updatedCompanyData.tier,
        description: updatedCompanyData.description,
        location: updatedCompanyData.location,
        contact: {
          ...prev.contact,
          email: updatedCompanyData.contactEmail,
          phone: updatedCompanyData.contactPhone,
          website: updatedCompanyData.website,
        },
        stats: {
          ...prev.stats,
          avgSalary: updatedCompanyData.avgSalary,
        }
      }));

      toast({
        title: "Company Updated",
        description: `${updatedCompanyData.name} has been updated successfully.`,
      });
    }
  };

  const handleDriveCreated = () => {
    toast({
      title: "Drive Created",
      description: "New placement drive has been created successfully.",
    });
    setCreateDriveOpen(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-primary text-primary-foreground';
      case 'Tier 2': return 'bg-secondary text-secondary-foreground';
      case 'Tier 3': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry === 'all' ? 'All Industries' : industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map(tier => (
                      <SelectItem key={tier} value={tier}>
                        {tier === 'all' ? 'All Tiers' : tier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedIndustry('all');
                  setSelectedLocation('all');
                  setSelectedTier('all');
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
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

      {/* Modals */}
      <AddCompanyModal
        open={addCompanyOpen}
        onOpenChange={setAddCompanyOpen}
        onCompanyAdded={handleCompanyAdded}
        existingCompanies={companies}
      />      <CompanyDetailsModal
        open={companyDetailsOpen}
        onOpenChange={setCompanyDetailsOpen}
        company={selectedCompany}
      />
      
      <EditCompanyModal
        open={editCompanyOpen}
        onOpenChange={setEditCompanyOpen}
        company={selectedCompany}
        onCompanyUpdated={handleCompanyUpdated}
      />
      
      <CreateDriveModal
        open={createDriveOpen}
        onOpenChange={setCreateDriveOpen}
        onDriveCreated={handleDriveCreated}
        selectedCompany={selectedCompany}
      />
    </div>
  );
};

export default Companies;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  DollarSign,
  BarChart3,
  PieChart,
  FileText,
  Share
} from 'lucide-react';
import ReportModal from '@/components/modals/ReportModal';

const Reports = () => {
  const { toast } = useToast();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('');

  const handleFilters = () => {
    toast({
      title: "Filters",
      description: "Opening report filters panel...",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Report",
      description: "Opening sharing options...",
    });
  };

  const handleGenerateReport = (type: string) => {
    setReportType(type);
    setReportModalOpen(true);
  };

  const handleExportReport = () => {
    handleGenerateReport('comprehensive');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'detailed-report':
        handleGenerateReport('detailed');
        break;
      case 'analytics-dashboard':
        handleGenerateReport('analytics');
        break;
      case 'schedule-report':
        handleGenerateReport('scheduled');
        break;
      default:
        break;
    }
  };

  const placementData = {
    totalStudents: 420,
    placed: 287,
    inProcess: 89,
    applying: 44,
    placementRate: 68.3,
    avgPackage: 8.2,
    highestPackage: 45,
    medianPackage: 6.5
  };

  const companyWiseData = [
    { company: 'Google', hires: 12, avgPackage: 24, tier: 'Tier 1' },
    { company: 'Microsoft', hires: 8, avgPackage: 28, tier: 'Tier 1' },
    { company: 'Amazon', hires: 15, avgPackage: 22, tier: 'Tier 1' },
    { company: 'TCS', hires: 45, avgPackage: 3.5, tier: 'Tier 2' },
    { company: 'Infosys', hires: 38, avgPackage: 4.2, tier: 'Tier 2' },
    { company: 'Wipro', hires: 32, avgPackage: 3.8, tier: 'Tier 2' },
    { company: 'Accenture', hires: 28, avgPackage: 5.5, tier: 'Tier 2' },
    { company: 'Cognizant', hires: 25, avgPackage: 4.8, tier: 'Tier 2' }
  ];

  const branchWiseData = [
    { branch: 'Computer Science', total: 120, placed: 95, rate: 79.2, avgPackage: 12.5 },
    { branch: 'Information Technology', total: 80, placed: 68, rate: 85.0, avgPackage: 11.8 },
    { branch: 'Electronics', total: 90, placed: 58, rate: 64.4, avgPackage: 7.2 },
    { branch: 'Mechanical', total: 70, placed: 35, rate: 50.0, avgPackage: 5.8 },
    { branch: 'Civil', total: 60, placed: 31, rate: 51.7, avgPackage: 4.9 }
  ];

  const monthlyTrends = [
    { month: 'Aug 2024', placements: 45, drives: 8 },
    { month: 'Sep 2024', placements: 68, drives: 12 },
    { month: 'Oct 2024', placements: 89, drives: 15 },
    { month: 'Nov 2024', placements: 85, drives: 14 }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive placement statistics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleFilters}>
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Placement Rate</p>
                <p className="text-3xl font-bold">{placementData.placementRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <p className="text-xs text-secondary mt-2">+5.2% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Package</p>
                <p className="text-3xl font-bold">₹{placementData.avgPackage}L</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-primary mt-2">+12% increase</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Package</p>
                <p className="text-3xl font-bold">₹{placementData.highestPackage}L</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-accent mt-2">Google offer</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drives</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Placement Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Placement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((month, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{month.month}</p>
                    <p className="text-sm text-muted-foreground">{month.drives} drives conducted</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{month.placements}</p>
                    <p className="text-xs text-muted-foreground">placements</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Placement Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Placement Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-secondary"></div>
                  <span>Placed Students</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{placementData.placed}</p>
                  <p className="text-xs text-muted-foreground">{placementData.placementRate}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span>In Process</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{placementData.inProcess}</p>
                  <p className="text-xs text-muted-foreground">{((placementData.inProcess / placementData.totalStudents) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span>Applying</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{placementData.applying}</p>
                  <p className="text-xs text-muted-foreground">{((placementData.applying / placementData.totalStudents) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Branch-wise Placement Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {branchWiseData.map((branch, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                    {branch.branch.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{branch.branch}</h3>
                    <p className="text-sm text-muted-foreground">
                      {branch.placed} placed out of {branch.total} students
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-2xl font-bold text-secondary">{branch.rate}%</p>
                    <p className="text-xs text-muted-foreground">Placement Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{branch.avgPackage}L</p>
                    <p className="text-xs text-muted-foreground">Avg Package</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company-wise Hiring */}
      <Card>
        <CardHeader>
          <CardTitle>Top Hiring Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {companyWiseData.map((company, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                    {company.company[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{company.company}</h3>
                      <Badge variant={company.tier === 'Tier 1' ? 'default' : 'secondary'}>
                        {company.tier}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{company.hires} hires</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{company.avgPackage}L</p>
                  <p className="text-xs text-muted-foreground">Avg Package</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Report Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('detailed-report')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Generate Detailed Report</h3>
            <p className="text-sm text-muted-foreground">Create comprehensive placement report</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('analytics-dashboard')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-bold mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">View interactive charts and graphs</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('schedule-report')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold mb-2">Schedule Report</h3>
            <p className="text-sm text-muted-foreground">Automate report generation</p>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <ReportModal 
        open={reportModalOpen} 
        onOpenChange={setReportModalOpen}
        type="generate"
      />
    </div>
  );
};

export default Reports;
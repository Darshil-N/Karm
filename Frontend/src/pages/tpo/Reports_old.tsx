import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
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
  Share,
  RefreshCw
} from 'lucide-react';
import ReportModal from '@/components/modals/ReportModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const { toast } = useToast();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current-year');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefreshData = () => {
    setLastUpdated(new Date());
    toast({
      title: "Data Refreshed",
      description: "Report data has been updated with latest information.",
    });
  };

  const handleExportComprehensiveReport = () => {
    toast({
      title: "Generating Comprehensive Report",
      description: "Creating detailed PDF report with all analytics...",
    });

    try {
      const doc = new jsPDF();
      
      // Title Page
      doc.setFontSize(28);
      doc.setTextColor(40);
      doc.text('Placement Analytics Report', 20, 30);
      
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text(`Academic Year: ${selectedTimeframe.replace('-', ' ')}`, 20, 45);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 52);
      doc.text(`Report Scope: ${selectedBranch === 'all' ? 'All Branches' : selectedBranch}`, 20, 59);

      // Executive Summary
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('Executive Summary', 20, 80);
      
      const summaryData = [
        ['Total Students', filteredPlacementData.totalStudents.toString()],
        ['Students Placed', filteredPlacementData.placed.toString()],
        ['Placement Rate', `${filteredPlacementData.placementRate}%`],
        ['Average Package', `₹${filteredPlacementData.avgPackage}L`],
        ['Highest Package', `₹${filteredPlacementData.highestPackage}L`],
        ['Median Package', `₹${filteredPlacementData.medianPackage}L`]
      ];

      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: 90,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Company-wise data
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('Company-wise Hiring Analysis', 20, 30);

      const companyTableData = filteredCompanyData.map(company => [
        company.company,
        company.tier,
        company.hires.toString(),
        `₹${company.avgPackage}L`
      ]);

      autoTable(doc, {
        head: [['Company', 'Tier', 'Hires', 'Avg Package']],
        body: companyTableData,
        startY: 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Branch-wise data
      const branchTableData = filteredBranchData.map(branch => [
        branch.branch,
        branch.total.toString(),
        branch.placed.toString(),
        `${branch.rate}%`,
        `₹${branch.avgPackage}L`
      ]);

      autoTable(doc, {
        head: [['Branch', 'Total Students', 'Placed', 'Rate', 'Avg Package']],
        body: branchTableData,
        startY: (doc as any).lastAutoTable.finalY + 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`placement_analytics_${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: "Report Downloaded",
        description: "Comprehensive placement report has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Generating Report",
        description: "There was an error creating the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Showing data for ${selectedTimeframe}, ${selectedBranch === 'all' ? 'All Branches' : selectedBranch}`,
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
    handleExportComprehensiveReport();
  };

  // Base data - in real app, this would come from API
  const basePlacementData = {
    totalStudents: 420,
    placed: 287,
    inProcess: 89,
    applying: 44,
    placementRate: 68.3,
    avgPackage: 8.2,
    highestPackage: 45,
    medianPackage: 6.5
  };

  const baseCompanyData = [
    { company: 'Google', hires: 12, avgPackage: 24, tier: 'Tier 1' },
    { company: 'Microsoft', hires: 8, avgPackage: 28, tier: 'Tier 1' },
    { company: 'Amazon', hires: 15, avgPackage: 22, tier: 'Tier 1' },
    { company: 'TCS', hires: 45, avgPackage: 3.5, tier: 'Tier 2' },
    { company: 'Infosys', hires: 38, avgPackage: 4.2, tier: 'Tier 2' },
    { company: 'Wipro', hires: 32, avgPackage: 3.8, tier: 'Tier 2' },
    { company: 'Accenture', hires: 28, avgPackage: 5.5, tier: 'Tier 2' },
    { company: 'Cognizant', hires: 25, avgPackage: 4.8, tier: 'Tier 2' }
  ];

  const baseBranchData = [
    { branch: 'Computer Science', total: 120, placed: 95, rate: 79.2, avgPackage: 12.5 },
    { branch: 'Information Technology', total: 80, placed: 68, rate: 85.0, avgPackage: 11.8 },
    { branch: 'Electronics', total: 90, placed: 58, rate: 64.4, avgPackage: 7.2 },
    { branch: 'Mechanical', total: 70, placed: 35, rate: 50.0, avgPackage: 5.8 },
    { branch: 'Civil', total: 60, placed: 31, rate: 51.7, avgPackage: 4.9 }
  ];

  const baseMonthlyTrends = [
    { month: 'Aug 2024', placements: 45, drives: 8 },
    { month: 'Sep 2024', placements: 68, drives: 12 },
    { month: 'Oct 2024', placements: 89, drives: 15 },
    { month: 'Nov 2024', placements: 85, drives: 14 }
  ];

  // Filtered data based on selections
  const filteredPlacementData = useMemo(() => {
    // Apply timeframe filter logic here
    let data = { ...basePlacementData };
    
    if (selectedTimeframe === 'last-year') {
      data = {
        ...data,
        totalStudents: 380,
        placed: 245,
        placementRate: 64.5,
        avgPackage: 7.8
      };
    }
    
    return data;
  }, [selectedTimeframe]);

  const filteredCompanyData = useMemo(() => {
    return baseCompanyData.filter(company => {
      if (selectedTier !== 'all' && company.tier !== selectedTier) return false;
      return true;
    });
  }, [selectedTier]);

  const filteredBranchData = useMemo(() => {
    return baseBranchData.filter(branch => {
      if (selectedBranch !== 'all' && branch.branch !== selectedBranch) return false;
      return true;
    });
  }, [selectedBranch]);

  const filteredMonthlyTrends = useMemo(() => {
    return baseMonthlyTrends; // Add timeframe filtering logic as needed
  }, [selectedTimeframe]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive placement statistics and insights 
            <span className="text-xs ml-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2 mr-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="last-semester">Last Semester</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Technology">IT</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="gap-2" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleFilters}>
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2" onClick={handleExportReport}>
            <FileText className="h-4 w-4" />
            Export PDF
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
                <p className="text-3xl font-bold">{filteredPlacementData.placementRate}%</p>
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
                <p className="text-3xl font-bold">₹{filteredPlacementData.avgPackage}L</p>
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
                <p className="text-3xl font-bold">₹{filteredPlacementData.highestPackage}L</p>
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
              {filteredMonthlyTrends.map((month, idx) => (
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
                  <p className="font-bold">{filteredPlacementData.placed}</p>
                  <p className="text-xs text-muted-foreground">{filteredPlacementData.placementRate}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span>In Process</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{filteredPlacementData.inProcess}</p>
                  <p className="text-xs text-muted-foreground">{((filteredPlacementData.inProcess / filteredPlacementData.totalStudents) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span>Applying</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{filteredPlacementData.applying}</p>
                  <p className="text-xs text-muted-foreground">{((filteredPlacementData.applying / filteredPlacementData.totalStudents) * 100).toFixed(1)}%</p>
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
            {filteredBranchData.map((branch, idx) => (
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
            {filteredCompanyData.map((company, idx) => (
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
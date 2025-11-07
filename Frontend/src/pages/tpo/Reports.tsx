import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { AnalyticsService, StudentService, DriveService } from '@/services/firebaseService';
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
  RefreshCw,
  Activity,
  GraduationCap
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

interface PlacementAnalytics {
  totalStudents: number;
  placed: number;
  inProcess: number;
  applying: number;
  placementRate: number;
  avgPackage: number;
  highestPackage: number;
  medianPackage: number;
}

interface CompanyAnalytics {
  company: string;
  hires: number;
  avgPackage: number;
  tier: string;
}

interface BranchAnalytics {
  branch: string;
  total: number;
  placed: number;
  rate: number;
  avgPackage: number;
}

interface MonthlyTrends {
  month: string;
  placements: number;
  drives: number;
}

const Reports = () => {
  const { toast } = useToast();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current-year');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Firebase data states
  const [placementData, setPlacementData] = useState<PlacementAnalytics>({
    totalStudents: 0,
    placed: 0,
    inProcess: 0,
    applying: 0,
    placementRate: 0,
    avgPackage: 0,
    highestPackage: 0,
    medianPackage: 0
  });
  const [companyData, setCompanyData] = useState<CompanyAnalytics[]>([]);
  const [branchData, setBranchData] = useState<BranchAnalytics[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrends[]>([]);

  // Load analytics data from Firebase
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        
        // Load placement analytics
        const analytics = await AnalyticsService.getPlacementAnalytics();
        setPlacementData(analytics);

        // Load company wise analytics
        const companies = await AnalyticsService.getCompanyWiseAnalytics();
        setCompanyData(companies);

        // Load branch wise analytics
        const branches = await AnalyticsService.getBranchWiseAnalytics();
        setBranchData(branches);

        // Load monthly trends
        const trends = await AnalyticsService.getMonthlyTrends();
        setMonthlyTrends(trends);

        setLastUpdated(new Date());
        
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast({
          title: "Error Loading Analytics",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [toast]);

  const handleRefreshData = async () => {
    try {
      // Force refresh analytics data
      const analytics = await AnalyticsService.getPlacementAnalytics();
      setPlacementData(analytics);

      const companies = await AnalyticsService.getCompanyWiseAnalytics();
      setCompanyData(companies);

      const branches = await AnalyticsService.getBranchWiseAnalytics();
      setBranchData(branches);

      const trends = await AnalyticsService.getMonthlyTrends();
      setMonthlyTrends(trends);

      setLastUpdated(new Date());
      
      toast({
        title: "Data Refreshed",
        description: "Report data has been updated with latest information.",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Error Refreshing Data",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive",
      });
    }
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
        ['Placement Rate', `${filteredPlacementData.placementRate.toFixed(1)}%`],
        ['Average Package', `₹${filteredPlacementData.avgPackage.toFixed(1)}L`],
        ['Highest Package', `₹${filteredPlacementData.highestPackage.toFixed(1)}L`],
        ['Median Package', `₹${filteredPlacementData.medianPackage.toFixed(1)}L`]
      ];

      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: 90,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 40 },
        },
      });

      // Company wise placement data
      let finalY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(16);
      doc.text('Company Wise Placements', 20, finalY);
      
      const companyTableData = filteredCompanyData.map(company => [
        company.company,
        company.hires.toString(),
        `₹${company.avgPackage}L`,
        company.tier
      ]);

      autoTable(doc, {
        head: [['Company', 'Hires', 'Avg Package', 'Tier']],
        body: companyTableData,
        startY: finalY + 10,
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      // Branch wise placement data
      finalY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(16);
      doc.text('Branch Wise Placements', 20, finalY);
      
      const branchTableData = filteredBranchData.map(branch => [
        branch.branch,
        branch.total.toString(),
        branch.placed.toString(),
        `${branch.rate.toFixed(1)}%`,
        `₹${branch.avgPackage.toFixed(1)}L`
      ]);

      autoTable(doc, {
        head: [['Branch', 'Total', 'Placed', 'Rate', 'Avg Package']],
        body: branchTableData,
        startY: finalY + 10,
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      // Save the PDF
      const fileName = `placement_analytics_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Generated Successfully",
        description: `Analytics report has been downloaded as ${fileName}`,
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error Generating PDF",
        description: "There was an error creating the PDF report. Please try again.",
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

  // Filtered data based on selections
  const filteredPlacementData = useMemo(() => {
    // Apply timeframe filter logic here
    // For now, return the current data
    return placementData;
  }, [placementData, selectedTimeframe]);

  const filteredCompanyData = useMemo(() => {
    return companyData.filter(company => {
      if (selectedTier !== 'all' && company.tier !== selectedTier) return false;
      return true;
    });
  }, [companyData, selectedTier]);

  const filteredBranchData = useMemo(() => {
    return branchData.filter(branch => {
      if (selectedBranch !== 'all' && branch.branch !== selectedBranch) return false;
      return true;
    });
  }, [branchData, selectedBranch]);

  const filteredMonthlyTrends = useMemo(() => {
    return monthlyTrends; // Add timeframe filtering logic as needed
  }, [monthlyTrends, selectedTimeframe]);

  // Chart data
  const branchChartData = {
    labels: filteredBranchData.map(item => item.branch),
    datasets: [
      {
        label: 'Placement Rate %',
        data: filteredBranchData.map(item => item.rate),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const companyPieData = {
    labels: filteredCompanyData.slice(0, 6).map(item => item.company),
    datasets: [
      {
        data: filteredCompanyData.slice(0, 6).map(item => item.hires),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const trendLineData = {
    labels: filteredMonthlyTrends.map(item => item.month),
    datasets: [
      {
        label: 'Placements',
        data: filteredMonthlyTrends.map(item => item.placements),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Drives',
        data: filteredMonthlyTrends.map(item => item.drives),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
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
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive placement statistics and insights from Firebase
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
                <p className="text-3xl font-bold">{filteredPlacementData.placementRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">Real-time from Firebase</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Package</p>
                <p className="text-3xl font-bold">₹{filteredPlacementData.avgPackage.toFixed(1)}L</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">Live analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Placed</p>
                <p className="text-3xl font-bold">{filteredPlacementData.placed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">Out of {filteredPlacementData.totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Package</p>
                <p className="text-3xl font-bold">₹{filteredPlacementData.highestPackage.toFixed(1)}L</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2">Median: ₹{filteredPlacementData.medianPackage.toFixed(1)}L</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Branch Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Branch Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              <Bar data={branchChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Company Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Hiring Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              <Pie data={companyPieData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placement Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monthly Placement Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '300px' }}>
            <Line data={trendLineData} options={{
              ...chartOptions,
              maintainAspectRatio: false,
            }} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Rankings
              <Badge variant="secondary" className="ml-auto">
                {filteredCompanyData.length} companies
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCompanyData.slice(0, 8).map((company, index) => (
                <div key={company.company} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{company.company}</div>
                      <div className="text-xs text-muted-foreground">
                        <Badge variant={company.tier === 'Tier 1' ? 'default' : 'secondary'} className="text-xs">
                          {company.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{company.avgPackage}L</div>
                    <div className="text-xs text-muted-foreground">{company.hires} hires</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Branch Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Branch Performance
              <Badge variant="secondary" className="ml-auto">
                {filteredBranchData.length} branches
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredBranchData.map((branch) => (
                <div key={branch.branch} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{branch.branch}</div>
                    <div className="text-xs text-muted-foreground">
                      {branch.placed}/{branch.total} students placed
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{branch.rate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">₹{branch.avgPackage.toFixed(1)}L avg</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="gap-2" onClick={() => handleGenerateReport('placement')}>
              <FileText className="h-4 w-4" />
              Placement Report
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleGenerateReport('company')}>
              <Building2 className="h-4 w-4" />
              Company Analysis
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleGenerateReport('branch')}>
              <BarChart3 className="h-4 w-4" />
              Branch Statistics
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleGenerateReport('trends')}>
              <TrendingUp className="h-4 w-4" />
              Trend Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Modal */}
      <ReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        type="generate"
      />
    </div>
  );
};

export default Reports;
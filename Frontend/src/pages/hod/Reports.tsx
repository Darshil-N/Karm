import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Users, 
  Briefcase,
  Award,
  Calendar,
  Building,
  DollarSign,
  FileText,
  Filter,
  Eye
} from 'lucide-react';

// Mock data for reports
const placementData = [
  { month: 'Jan', placed: 12, applications: 45 },
  { month: 'Feb', placed: 18, applications: 52 },
  { month: 'Mar', placed: 25, applications: 68 },
  { month: 'Apr', placed: 32, applications: 72 },
  { month: 'May', placed: 28, applications: 65 },
  { month: 'Jun', placed: 35, applications: 78 },
  { month: 'Jul', placed: 42, applications: 85 },
  { month: 'Aug', placed: 38, applications: 80 },
  { month: 'Sep', placed: 30, applications: 70 },
  { month: 'Oct', placed: 25, applications: 60 },
  { month: 'Nov', placed: 20, applications: 55 }
];

const companyWiseData = [
  { name: 'Google', students: 12, avgPackage: 24 },
  { name: 'Microsoft', students: 10, avgPackage: 28 },
  { name: 'Amazon', students: 8, avgPackage: 22 },
  { name: 'Infosys', students: 45, avgPackage: 9 },
  { name: 'TCS', students: 38, avgPackage: 8 },
  { name: 'Wipro', students: 25, avgPackage: 7 },
  { name: 'Accenture', students: 22, avgPackage: 8.5 },
  { name: 'Cognizant', students: 18, avgPackage: 7.5 }
];

const cgpaWiseData = [
  { range: '9.0-10.0', placed: 45, total: 50, percentage: 90 },
  { range: '8.0-8.9', placed: 85, total: 120, percentage: 71 },
  { range: '7.0-7.9', placed: 95, total: 150, percentage: 63 },
  { range: '6.0-6.9', placed: 40, total: 80, percentage: 50 },
  { range: 'Below 6.0', placed: 10, total: 20, percentage: 50 }
];

const branchWiseData = [
  { name: 'Computer Science', value: 287, color: '#8884d8' },
  { name: 'Information Technology', value: 156, color: '#82ca9d' },
  { name: 'Electronics', value: 89, color: '#ffc658' },
  { name: 'Mechanical', value: 67, color: '#ff7c7c' },
  { name: 'Civil', value: 45, color: '#8dd1e1' }
];

const packageDistribution = [
  { range: '0-5 LPA', count: 89 },
  { range: '5-10 LPA', count: 156 },
  { range: '10-15 LPA', count: 67 },
  { range: '15-20 LPA', count: 34 },
  { range: '20-25 LPA', count: 18 },
  { range: '25+ LPA', count: 12 }
];

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const generateReport = (type: string) => {
    // Mock report generation
    console.log(`Generating ${type} report for year ${selectedYear}, branch ${selectedBranch}`);
    
    const reportData = {
      placement: `placement_report_${selectedYear}.pdf`,
      academic: `academic_report_${selectedYear}.pdf`,
      company: `company_analysis_${selectedYear}.pdf`,
      student: `student_performance_${selectedYear}.pdf`
    };

    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = reportData[type as keyof typeof reportData];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportData = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    // Mock export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportData('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportData('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">Academic Year 2024</SelectItem>
                <SelectItem value="2023">Academic Year 2023</SelectItem>
                <SelectItem value="2022">Academic Year 2022</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Branches</SelectItem>
                <SelectItem value="CS">Computer Science</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="ECE">Electronics</SelectItem>
                <SelectItem value="ME">Mechanical</SelectItem>
                <SelectItem value="CE">Civil Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Placement Rate</p>
                <p className="text-3xl font-bold text-green-600">68.3%</p>
                <p className="text-xs text-green-600 mt-1">+5.2% from last year</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Package</p>
                <p className="text-3xl font-bold">₹12.5L</p>
                <p className="text-xs text-blue-600 mt-1">+15% from last year</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-3xl font-bold">84</p>
                <p className="text-xs text-purple-600 mt-1">+12 new this year</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Package</p>
                <p className="text-3xl font-bold">₹45L</p>
                <p className="text-xs text-orange-600 mt-1">Google - SDE Role</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="placement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="placement">Placement Analytics</TabsTrigger>
          <TabsTrigger value="academic">Academic Performance</TabsTrigger>
          <TabsTrigger value="company">Company Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="placement" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Placement Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Placement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="placed" stroke="#8884d8" name="Students Placed" />
                    <Line type="monotone" dataKey="applications" stroke="#82ca9d" name="Applications" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Branch-wise Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Branch-wise Placement Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={branchWiseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {branchWiseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* CGPA-wise Placement Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>CGPA-wise Placement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cgpaWiseData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CGPA {item.range}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.placed}/{item.total} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Package Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Package Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={packageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average CGPA</span>
                    <span className="font-bold">7.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Students with CGPA {'>'}= 8.0</span>
                    <span className="font-bold">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Students with CGPA {'>'}= 9.0</span>
                    <span className="font-bold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Students below 6.0 CGPA</span>
                    <span className="font-bold text-red-600">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Semester Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { sem: 'Semester 8', avg: 8.2, pass: 98 },
                    { sem: 'Semester 7', avg: 8.0, pass: 97 },
                    { sem: 'Semester 6', avg: 7.8, pass: 96 },
                    { sem: 'Semester 5', avg: 7.6, pass: 95 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.sem}</p>
                        <p className="text-sm text-muted-foreground">Avg CGPA: {item.avg}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.pass}% Pass Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="cyber-card circuit-pattern hover-glow-intense animate-fade-in stagger-delay-3 group">
            <CardHeader>
              <CardTitle className="text-mist-white group-hover:text-cyber-lime transition-colors duration-300">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Priya Patel', rollNo: 'CS21B002', cgpa: 9.8, achievements: 'Dean\'s List, Research Paper Published' },
                  { rank: 2, name: 'Sneha Reddy', rollNo: 'CS21B004', cgpa: 9.6, achievements: 'Academic Excellence Award' },
                  { rank: 3, name: 'Rahul Sharma', rollNo: 'CS21B001', cgpa: 9.4, achievements: 'Best Project Award' }
                ].map((student, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 bg-gradient-to-r from-electric-purple/10 to-cyber-lime/10 border cyber-card-border rounded-lg hover:from-electric-purple/20 hover:to-cyber-lime/20 hover:border-cyber-lime/50 transition-all duration-300 hover-scale-sm animate-slide-in-left stagger-delay-${idx + 1} group`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-deep-space group-hover:animate-bounce-gentle ${
                        student.rank === 1 ? 'bg-gradient-cyber animate-glow-cycle' : 
                        student.rank === 2 ? 'bg-electric-purple' : 
                        'bg-cyber-lime'
                      }`}>
                        {student.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-mist-white group-hover:text-cyber-lime transition-colors duration-300">{student.name}</p>
                        <p className="text-sm text-electric-purple">{student.rollNo}</p>
                        <p className="text-xs text-mist-white/70 group-hover:text-mist-white transition-colors duration-300">{student.achievements}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyber-lime group-hover:animate-pulse-slow">{student.cgpa}</p>
                      <p className="text-xs text-mist-white/60">CGPA</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company-wise Recruitment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={companyWiseData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#8884d8" name="Students Hired" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Recruiting Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companyWiseData.slice(0, 5).map((company, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">{company.students} students hired</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{company.avgPackage}L</p>
                        <p className="text-xs text-muted-foreground">Avg Package</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Product Companies', count: 15, percentage: 18 },
                    { category: 'Service Companies', count: 45, percentage: 54 },
                    { category: 'Startups', count: 12, percentage: 14 },
                    { category: 'Government/PSU', count: 8, percentage: 10 },
                    { category: 'Consultancy', count: 4, percentage: 4 }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">{item.count} companies</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Placement Rate', current: '68.3%', previous: '63.1%', change: '+5.2%', trend: 'up' },
                    { metric: 'Average Package', current: '₹12.5L', previous: '₹10.9L', change: '+14.7%', trend: 'up' },
                    { metric: 'Companies Visited', current: '84', previous: '72', change: '+16.7%', trend: 'up' },
                    { metric: 'Students Registered', current: '420', previous: '398', change: '+5.5%', trend: 'up' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.metric}</p>
                        <p className="text-sm text-muted-foreground">vs. Previous Year</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.current}</p>
                        <p className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Technology Sector Dominance</h4>
                    <p className="text-sm text-blue-700">75% of placements in IT/Software companies</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">High CGPA Advantage</h4>
                    <p className="text-sm text-green-700">Students with CGPA {'>'}8.5 have 85% placement rate</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Skills Impact</h4>
                    <p className="text-sm text-purple-700">Students with cloud certifications get 40% higher packages</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Regional Preference</h4>
                    <p className="text-sm text-orange-700">60% placements in metro cities (Bangalore, Pune, Hyderabad)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => generateReport('placement')}
            >
              <FileText className="h-6 w-6" />
              <span>Placement Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => generateReport('academic')}
            >
              <Award className="h-6 w-6" />
              <span>Academic Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => generateReport('company')}
            >
              <Building className="h-6 w-6" />
              <span>Company Analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => generateReport('student')}
            >
              <Users className="h-6 w-6" />
              <span>Student Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
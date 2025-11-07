import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  writeBatch,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Company interfaces
export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  tier: string;
  rating: number;
  description: string;
  website: string;
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
  foundedYear: string;
  employeeCount: string;
  hrDetails: {
    name: string;
    email: string;
    phone: string;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Student interfaces
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  cgpa: number;
  placementStatus: 'Placed' | 'In Process' | 'Applying' | 'Not Placed';
  company?: string;
  package?: string;
  skillSet: string[];
  location: string;
  resumeScore: number;
  applications: number;
  offers: number;
  profileDetails: {
    rollNumber: string;
    dateOfBirth: string;
    address: string;
    fatherName: string;
    motherName: string;
    emergencyContact: string;
  };
  academicDetails: {
    tenthPercentage: number;
    twelfthPercentage: number;
    diplomaPercentage?: number;
    backlogs: number;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      duration: string;
    }>;
    internships: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  };
  placementHistory: Array<{
    company: string;
    role: string;
    applicationDate: string;
    status: string;
    currentRound: string;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Drive interfaces
export interface Drive {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  package: string;
  eligibility: {
    minCGPA: number;
    branches: string[];
    year: string;
  };
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  applicants: string[]; // Array of student IDs
  selectedStudents: string[]; // Array of student IDs
  startDate: Timestamp;
  endDate: Timestamp;
  rounds: Array<{
    name: string;
    date: Timestamp;
    type: 'written' | 'technical' | 'hr' | 'group-discussion';
    qualified: string[];
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Company Service Functions
export class CompanyService {
  private static collection = 'companies';

  static async getAllCompanies(): Promise<Company[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.collection), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Company));
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
  }

  static async getCompanyById(id: string): Promise<Company | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collection, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Company;
      }
      return null;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw new Error('Failed to fetch company');
    }
  }

  static async addCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...companyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding company:', error);
      throw new Error('Failed to add company');
    }
  }

  static async updateCompany(id: string, updates: Partial<Omit<Company, 'id' | 'createdAt'>>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating company:', error);
      throw new Error('Failed to update company');
    }
  }

  static async deleteCompany(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, id));
    } catch (error) {
      console.error('Error deleting company:', error);
      throw new Error('Failed to delete company');
    }
  }

  static subscribeToCompanies(callback: (companies: Company[]) => void): () => void {
    const unsubscribe = onSnapshot(
      query(collection(db, this.collection), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const companies = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Company));
        callback(companies);
      },
      (error) => {
        console.error('Error in companies subscription:', error);
      }
    );
    return unsubscribe;
  }
}

// Student Service Functions
export class StudentService {
  private static collection = 'students';

  static async getAllStudents(): Promise<Student[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.collection), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  static async getStudentById(id: string): Promise<Student | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collection, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Student;
      }
      return null;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw new Error('Failed to fetch student');
    }
  }

  static async updateStudent(id: string, updates: Partial<Omit<Student, 'id' | 'createdAt'>>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw new Error('Failed to update student');
    }
  }

  static async getStudentsByBranch(branch: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('branch', '==', branch)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
    } catch (error) {
      console.error('Error fetching students by branch:', error);
      throw new Error('Failed to fetch students by branch');
    }
  }

  static async getStudentsByPlacementStatus(status: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('placementStatus', '==', status)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
    } catch (error) {
      console.error('Error fetching students by status:', error);
      throw new Error('Failed to fetch students by status');
    }
  }

  static async bulkUpdateStudents(updates: Array<{ id: string; data: Partial<Student> }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, data }) => {
        const studentRef = doc(db, this.collection, id);
        batch.update(studentRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error bulk updating students:', error);
      throw new Error('Failed to bulk update students');
    }
  }

  static subscribeToStudents(callback: (students: Student[]) => void): () => void {
    const unsubscribe = onSnapshot(
      query(collection(db, this.collection), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const students = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Student));
        callback(students);
      },
      (error) => {
        console.error('Error in students subscription:', error);
      }
    );
    return unsubscribe;
  }
}

// Drive Service Functions
export class DriveService {
  private static collection = 'drives';

  static async getAllDrives(): Promise<Drive[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.collection), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Drive));
    } catch (error) {
      console.error('Error fetching drives:', error);
      throw new Error('Failed to fetch drives');
    }
  }

  static async getDriveById(id: string): Promise<Drive | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collection, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Drive;
      }
      return null;
    } catch (error) {
      console.error('Error fetching drive:', error);
      throw new Error('Failed to fetch drive');
    }
  }

  static async addDrive(driveData: Omit<Drive, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...driveData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding drive:', error);
      throw new Error('Failed to add drive');
    }
  }

  static async updateDrive(id: string, updates: Partial<Omit<Drive, 'id' | 'createdAt'>>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating drive:', error);
      throw new Error('Failed to update drive');
    }
  }

  static async addStudentToDrive(driveId: string, studentId: string): Promise<void> {
    try {
      const driveRef = doc(db, this.collection, driveId);
      const driveSnap = await getDoc(driveRef);
      
      if (driveSnap.exists()) {
        const currentApplicants = driveSnap.data().applicants || [];
        if (!currentApplicants.includes(studentId)) {
          await updateDoc(driveRef, {
            applicants: [...currentApplicants, studentId],
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('Error adding student to drive:', error);
      throw new Error('Failed to add student to drive');
    }
  }

  static subscribeToDrives(callback: (drives: Drive[]) => void): () => void {
    const unsubscribe = onSnapshot(
      query(collection(db, this.collection), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const drives = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Drive));
        callback(drives);
      },
      (error) => {
        console.error('Error in drives subscription:', error);
      }
    );
    return unsubscribe;
  }
}

// Analytics Service for Reports
export class AnalyticsService {
  static async getPlacementStatistics(): Promise<{
    totalStudents: number;
    placedStudents: number;
    placementRate: number;
    averagePackage: number;
    highestPackage: number;
    medianPackage: number;
    branchWiseStats: Array<{
      branch: string;
      total: number;
      placed: number;
      rate: number;
      avgPackage: number;
    }>;
    companyWiseStats: Array<{
      company: string;
      tier: string;
      hires: number;
      avgPackage: number;
    }>;
    packageDistribution: Array<{
      range: string;
      count: number;
    }>;
    monthlyPlacementTrends: Array<{
      month: string;
      placements: number;
    }>;
  }> {
    try {
      const [students, companies, drives] = await Promise.all([
        StudentService.getAllStudents(),
        CompanyService.getAllCompanies(),
        DriveService.getAllDrives()
      ]);

      const totalStudents = students.length;
      const placedStudents = students.filter(s => s.placementStatus === 'Placed').length;
      const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

      // Calculate package statistics
      const placedStudentsWithPackage = students
        .filter(s => s.placementStatus === 'Placed' && s.package)
        .map(s => parseFloat(s.package!.replace(/[₹,LPA\s]/g, '')))
        .filter(p => !isNaN(p));

      const averagePackage = placedStudentsWithPackage.length > 0 
        ? placedStudentsWithPackage.reduce((sum, p) => sum + p, 0) / placedStudentsWithPackage.length 
        : 0;
      
      const highestPackage = placedStudentsWithPackage.length > 0 
        ? Math.max(...placedStudentsWithPackage) 
        : 0;
      
      const sortedPackages = placedStudentsWithPackage.sort((a, b) => a - b);
      const medianPackage = sortedPackages.length > 0 
        ? sortedPackages[Math.floor(sortedPackages.length / 2)]
        : 0;

      // Branch-wise statistics
      const branchMap = new Map<string, { total: number; placed: number; packages: number[] }>();
      students.forEach(student => {
        if (!branchMap.has(student.branch)) {
          branchMap.set(student.branch, { total: 0, placed: 0, packages: [] });
        }
        const branchData = branchMap.get(student.branch)!;
        branchData.total++;
        if (student.placementStatus === 'Placed') {
          branchData.placed++;
          if (student.package) {
            const packageValue = parseFloat(student.package.replace(/[₹,LPA\s]/g, ''));
            if (!isNaN(packageValue)) {
              branchData.packages.push(packageValue);
            }
          }
        }
      });

      const branchWiseStats = Array.from(branchMap.entries()).map(([branch, data]) => ({
        branch,
        total: data.total,
        placed: data.placed,
        rate: data.total > 0 ? (data.placed / data.total) * 100 : 0,
        avgPackage: data.packages.length > 0 
          ? data.packages.reduce((sum, p) => sum + p, 0) / data.packages.length 
          : 0
      }));

      // Company-wise statistics
      const companyMap = new Map<string, { tier: string; hires: number; packages: number[] }>();
      students.filter(s => s.placementStatus === 'Placed' && s.company).forEach(student => {
        const company = companies.find(c => c.name === student.company);
        const tier = company?.tier || 'Unknown';
        
        if (!companyMap.has(student.company!)) {
          companyMap.set(student.company!, { tier, hires: 0, packages: [] });
        }
        const companyData = companyMap.get(student.company!)!;
        companyData.hires++;
        if (student.package) {
          const packageValue = parseFloat(student.package.replace(/[₹,LPA\s]/g, ''));
          if (!isNaN(packageValue)) {
            companyData.packages.push(packageValue);
          }
        }
      });

      const companyWiseStats = Array.from(companyMap.entries()).map(([company, data]) => ({
        company,
        tier: data.tier,
        hires: data.hires,
        avgPackage: data.packages.length > 0 
          ? data.packages.reduce((sum, p) => sum + p, 0) / data.packages.length 
          : 0
      }));

      // Package distribution
      const packageRanges = [
        { min: 0, max: 3, range: '0-3 LPA' },
        { min: 3, max: 6, range: '3-6 LPA' },
        { min: 6, max: 10, range: '6-10 LPA' },
        { min: 10, max: 15, range: '10-15 LPA' },
        { min: 15, max: 25, range: '15-25 LPA' },
        { min: 25, max: Infinity, range: '25+ LPA' }
      ];

      const packageDistribution = packageRanges.map(range => ({
        range: range.range,
        count: placedStudentsWithPackage.filter(p => p >= range.min && p < range.max).length
      }));

      // Monthly placement trends (mock data for now)
      const monthlyPlacementTrends = [
        { month: 'Jan', placements: Math.floor(Math.random() * 20) + 10 },
        { month: 'Feb', placements: Math.floor(Math.random() * 25) + 15 },
        { month: 'Mar', placements: Math.floor(Math.random() * 30) + 20 },
        { month: 'Apr', placements: Math.floor(Math.random() * 35) + 25 },
        { month: 'May', placements: Math.floor(Math.random() * 20) + 10 },
        { month: 'Jun', placements: Math.floor(Math.random() * 15) + 5 },
      ];

      return {
        totalStudents,
        placedStudents,
        placementRate,
        averagePackage,
        highestPackage,
        medianPackage,
        branchWiseStats,
        companyWiseStats,
        packageDistribution,
        monthlyPlacementTrends
      };
    } catch (error) {
      console.error('Error calculating analytics:', error);
      throw new Error('Failed to calculate analytics');
    }
  }

  // Additional methods for specific analytics
  static async getPlacementAnalytics() {
    try {
      const stats = await this.getPlacementStatistics();
      return {
        totalStudents: stats.totalStudents,
        placed: stats.placedStudents,
        inProcess: 0, // You might need to implement this logic
        applying: 0,  // You might need to implement this logic
        placementRate: stats.placementRate,
        avgPackage: stats.averagePackage,
        highestPackage: stats.highestPackage,
        medianPackage: stats.medianPackage
      };
    } catch (error) {
      console.error('Error getting placement analytics:', error);
      throw error;
    }
  }

  static async getCompanyWiseAnalytics() {
    try {
      const stats = await this.getPlacementStatistics();
      return stats.companyWiseStats.map(company => ({
        company: company.company,
        hires: company.hires,
        avgPackage: company.avgPackage,
        tier: company.tier
      }));
    } catch (error) {
      console.error('Error getting company wise analytics:', error);
      throw error;
    }
  }

  static async getBranchWiseAnalytics() {
    try {
      const stats = await this.getPlacementStatistics();
      return stats.branchWiseStats;
    } catch (error) {
      console.error('Error getting branch wise analytics:', error);
      throw error;
    }
  }

  static async getMonthlyTrends() {
    try {
      const stats = await this.getPlacementStatistics();
      return stats.monthlyPlacementTrends.map(trend => ({
        month: trend.month,
        placements: trend.placements,
        drives: Math.floor(Math.random() * 5) + 2 // Mock drives data
      }));
    } catch (error) {
      console.error('Error getting monthly trends:', error);
      throw error;
    }
  }
}
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
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';

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
  studentId?: string; // Unique student ID like KM1234
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  cgpa: number;
  placementStatus: 'Placed' | 'In Process' | 'Applying' | 'Not Placed' | 'Unplaced';
  company?: string;
  package?: string;
  skillSet: string[];
  location: string;
  resumeScore: number;
  applications: number;
  offers: number;
  interviews?: number; // Number of interviews attended
  marks10th?: number; // 10th standard marks
  marks12th?: number; // 12th standard marks
  guardianContact?: string; // Guardian contact information
  linkedinProfile?: string; // LinkedIn profile URL
  dateOfBirth?: string; // Date of birth
  status?: 'pending_approval' | 'approved' | 'rejected'; // Approval status
  isApproved?: boolean; // Whether approved by HOD
  appliedAt?: any; // Timestamp when student applied
  approvedAt?: any; // Timestamp when approved
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  achievements?: string[]; // List of achievements
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
      githubLink?: string;
      liveLink?: string;
      gitConnected?: boolean;
      repositoryName?: string;
      lastCommit?: string;
      readme?: string;
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
  // Additional fields for enhanced profile
  about?: string;
  githubProfile?: string;
  personalWebsite?: string;
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
  collegeId: string;
  companyName: string;
  roleName: string;
  salary: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobDescription: string;
  experience: string;
  skills: string[];
  rounds: string[];
  eligibilityCriteria: {
    allowedBranches: string[];
    minCGPA: string;
    passingYear: string;
    backlogsAllowed: boolean;
  };
  contactEmail: string;
  contactPhone: string;
  benefits: string;
  bondPeriod: string;
  applicants: number; // Counter for number of applicants
  status: 'active' | 'upcoming' | 'completed';
  driveDate: Timestamp;
  applicationDeadline: Timestamp;
  tpoUid: string;
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

  // Generate unique student ID
  static generateStudentId(): string {
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    return `KM${randomNum}`;
  }

  // Create a pending student registration
  static async createPendingStudent(studentData: any): Promise<string> {
    try {
      // Enhanced email validation to match Firebase requirements
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(studentData.email)) {
        throw new Error('Invalid email format. Please use a valid email address.');
      }

      // Check email domain length (Firebase requirement)
      const emailParts = studentData.email.split('@');
      if (emailParts.length !== 2 || emailParts[1].length < 3) {
        throw new Error('Email domain must be at least 3 characters long.');
      }

      // Check for proper TLD (Top Level Domain)
      const domain = emailParts[1];
      if (!domain.includes('.') || domain.split('.').pop()!.length < 2) {
        throw new Error('Email must have a valid domain extension (like .com, .org, .edu).');
      }

      if (!studentData.password || studentData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Creating Firebase Auth account for student signup:', studentData.email);
      
      // Create Firebase Authentication account immediately
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        studentData.email.trim().toLowerCase(), // Ensure lowercase
        studentData.password
      );
      
      console.log('Auth account created, UID:', userCredential.user.uid);
      
      const uniqueId = this.generateStudentId();
      
      // Use normalized email for all operations
      const normalizedEmail = studentData.email.toLowerCase().trim();
      
      // Create user record in users collection with approved: false
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: normalizedEmail,
        name: studentData.name,
        role: 'student',
        approved: false, // Key field - student cannot login until HOD approves
        studentId: uniqueId,
        university: studentData.university || '',
        universityId: studentData.universityId || '',
        hodEmail: studentData.hodEmail || '',
        createdAt: serverTimestamp()
      });
      
      // Also create pending student record for HOD review
      const cleanData: any = {
        uid: userCredential.user.uid, // Link to auth account
        name: studentData.name,
        email: normalizedEmail,
        phone: studentData.phone,
        university: studentData.university || '',
        universityId: studentData.universityId || '',
        hodEmail: studentData.hodEmail || '',
        hodUid: studentData.hodUid || '',
        studentId: uniqueId,
        status: 'pending_approval',
        appliedAt: serverTimestamp(),
        isApproved: false,
        createdAt: serverTimestamp()
      };

      // Only add optional fields if they have values
      if (studentData.branch) cleanData.branch = studentData.branch;
      if (studentData.year) cleanData.year = studentData.year;
      if (studentData.cgpa !== undefined) cleanData.cgpa = studentData.cgpa;
      if (studentData.location) cleanData.location = studentData.location;

      const docRef = await addDoc(collection(db, 'pending_students'), cleanData);
      
      console.log('Student registration complete - Auth account created, approval pending');
      return docRef.id;
    } catch (error: any) {
      console.error('Error creating student account:', error);
      throw new Error(`Failed to create student account: ${error.message}`);
    }
  }

  // Get all pending students for HOD approval (filtered by HOD)
  static async getPendingStudents(hodEmail?: string): Promise<any[]> {
    try {
      let q;
      
      console.log('Getting pending students for HOD:', hodEmail);
      
      if (hodEmail) {
        // Filter by HOD email for specific HOD dashboard
        q = query(
          collection(db, 'pending_students'),
          where('status', '==', 'pending_approval'),
          where('hodEmail', '==', hodEmail)
        );
      } else {
        // Get all pending students (for admin view)
        q = query(
          collection(db, 'pending_students'),
          where('status', '==', 'pending_approval')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const students = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as any
      }));
      
      console.log(`Found ${students.length} pending students:`, students);
      
      // If no students found for this HOD, let's check if any pending students exist at all
      if (students.length === 0 && hodEmail) {
        console.log('No students found for HOD, checking all pending students...');
        const allPendingQuery = query(
          collection(db, 'pending_students'),
          where('status', '==', 'pending_approval')
        );
        const allSnapshot = await getDocs(allPendingQuery);
        const allStudents = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Total pending students in database:`, allStudents.length, allStudents);
      }
      
      return students;
    } catch (error) {
      console.error('Error fetching pending students:', error);
      throw new Error('Failed to fetch pending students');
    }
  }

  // Subscribe to pending students for real-time updates (filtered by HOD)
  static subscribeToPendingStudents(callback: (students: any[]) => void, hodEmail?: string): () => void {
    try {
      let q;
      
      console.log('Setting up real-time subscription for HOD:', hodEmail);
      
      if (hodEmail) {
        // Filter by HOD email for specific HOD dashboard
        q = query(
          collection(db, 'pending_students'),
          where('status', '==', 'pending_approval'),
          where('hodEmail', '==', hodEmail)
        );
      } else {
        // Get all pending students (for admin view)
        q = query(
          collection(db, 'pending_students'),
          where('status', '==', 'pending_approval')
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const students = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`Real-time update: Found ${students.length} pending students for HOD ${hodEmail}:`, students);
        callback(students);
      }, (error) => {
        console.error('Error in pending students subscription:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up pending students subscription:', error);
      throw error;
    }
  }

  // Approve student - update approved status in users collection
  static async approveStudent(pendingStudentId: string): Promise<void> {
    try {
      // Get pending student data
      const pendingDoc = await getDoc(doc(db, 'pending_students', pendingStudentId));
      if (!pendingDoc.exists()) {
        throw new Error('Pending student not found');
      }

      const pendingData = pendingDoc.data();
      console.log('Approving student:', pendingData);

      // Update the user record to set approved: true
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('uid', '==', pendingData.uid));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        throw new Error('User account not found');
      }
      
      // Update approved status
      const userDoc = userSnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        approved: true,
        approvedAt: serverTimestamp()
      });

      // Create approved student record in students collection
      const approvedStudent: any = {
        uid: pendingData.uid,
        name: pendingData.name,
        email: pendingData.email,
        phone: pendingData.phone,
        university: pendingData.university || '',
        universityId: pendingData.universityId || '',
        hodEmail: pendingData.hodEmail || '',
        hodUid: pendingData.hodUid || '',
        studentId: pendingData.studentId,
        status: 'approved',
        isApproved: true,
        approvedAt: serverTimestamp(),
        createdAt: pendingData.createdAt || serverTimestamp(),
        
        // Default values - to be updated later by HOD or student
        branch: '',
        year: '',
        cgpa: 0,
        placementStatus: 'Unplaced',
        applications: 0,
        offers: 0,
        interviews: 0,
        
        // Profile completion status
        profileCompleted: false,
        profileCompletedAt: null
      };

      // Add to students collection
      await addDoc(collection(db, 'students'), approvedStudent);
      
      // Update pending student status
      await updateDoc(doc(db, 'pending_students', pendingStudentId), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });

      console.log('Student approved successfully');

    } catch (error) {
      console.error('Error approving student:', error);
      throw new Error('Failed to approve student');
    }
  }

  // Reject student
  static async rejectStudent(pendingStudentId: string, reason?: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'pending_students', pendingStudentId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectionReason: reason || 'No reason provided'
      });
    } catch (error) {
      console.error('Error rejecting student:', error);
      throw new Error('Failed to reject student');
    }
  }

  // Get HOD analytics for dashboard
  static async getHODAnalytics(hodEmail?: string) {
    try {
      // Build queries with HOD filtering if provided
      let approvedStudentsQuery, pendingStudentsQuery;

      if (hodEmail) {
        approvedStudentsQuery = query(
          collection(db, 'students'),
          where('hodEmail', '==', hodEmail)
        );
        pendingStudentsQuery = query(
          collection(db, 'pending_students'),
          where('status', '==', 'pending_approval'),
          where('hodEmail', '==', hodEmail)
        );
      } else {
        approvedStudentsQuery = collection(db, 'students');
        pendingStudentsQuery = query(
          collection(db, 'pending_students'), 
          where('status', '==', 'pending_approval')
        );
      }

      const [approvedStudents, pendingStudents] = await Promise.all([
        getDocs(approvedStudentsQuery),
        getDocs(pendingStudentsQuery)
      ]);

      const students = approvedStudents.docs.map(doc => doc.data());
      const totalStudents = students.length;
      const placedStudents = students.filter((s: any) => s.placementStatus === 'Placed').length;
      const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

      // Calculate average package
      const placedWithPackage = students
        .filter((s: any) => s.placementStatus === 'Placed' && s.package)
        .map((s: any) => {
          // Handle different package formats: "₹12L", "12 LPA", "1200000"
          const packageStr = s.package.toString();
          let value = packageStr.replace(/[₹,LPA\s]/g, '');
          
          // If it contains 'L', multiply by 100000 to get actual value
          if (packageStr.includes('L') && !packageStr.includes('LPA')) {
            value = parseFloat(value) * 100000;
          } else if (packageStr.includes('LPA')) {
            value = parseFloat(value) * 100000;
          } else {
            value = parseFloat(value);
          }
          return value;
        })
        .filter((p: number) => !isNaN(p));
      
      const avgPackage = placedWithPackage.length > 0 
        ? placedWithPackage.reduce((sum: number, p: number) => sum + p, 0) / placedWithPackage.length 
        : 0;

      // Get top recruiters
      const companyMap = new Map();
      students.filter((s: any) => s.placementStatus === 'Placed' && s.company).forEach((s: any) => {
        companyMap.set(s.company, (companyMap.get(s.company) || 0) + 1);
      });

      const topRecruiters = Array.from(companyMap.entries())
        .map(([company, offers]) => ({ company, offers }))
        .sort((a, b) => b.offers - a.offers)
        .slice(0, 5);

      // Get university/department info if filtering by HOD
      let departmentName = 'Computer Science & Engineering'; // Default
      let universityName = '';
      
      if (hodEmail && students.length > 0) {
        const firstStudent = students[0] as any;
        universityName = firstStudent.university || '';
        departmentName = firstStudent.branch || 'Computer Science & Engineering';
      }

      return {
        totalStudents,
        placedStudents,
        placementRate: Math.round(placementRate),
        avgPackage: Math.round(avgPackage / 100000), // Convert to lakhs
        pendingApprovals: pendingStudents.size,
        departmentName,
        universityName,
        topRecruiters,
        placementStatusBreakdown: {
          placed: students.filter((s: any) => s.placementStatus === 'Placed').length,
          inProcess: students.filter((s: any) => s.placementStatus === 'In Process' || s.placementStatus === 'Applying').length,
          unplaced: students.filter((s: any) => s.placementStatus === 'Unplaced' || s.placementStatus === 'Not Placed' || !s.placementStatus).length
        }
      };
    } catch (error) {
      console.error('Error getting HOD analytics:', error);
      throw error;
    }
  }

  static async getAllStudents(hodEmail?: string): Promise<Student[]> {
    try {
      let q;
      
      if (hodEmail) {
        // Filter students by HOD email (university)
        q = query(
          collection(db, this.collection),
          where('hodEmail', '==', hodEmail),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Get all students (for admin/system view)
        q = query(
          collection(db, this.collection),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Student, 'id'>)
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

  // Student Results methods
  static async getStudentResults(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'student_results'), orderBy('uploadedAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting student results:', error);
      throw error;
    }
  }

  static subscribeToStudentResults(callback: (results: any[]) => void): () => void {
    return onSnapshot(
      query(collection(db, 'student_results'), orderBy('uploadedAt', 'desc')),
      (snapshot) => {
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(results);
      },
      (error) => {
        console.error('Error in student results subscription:', error);
      }
    );
  }

  static async addStudentResult(resultData: any): Promise<string> {
    try {
      // Get student details from student ID
      const studentsQuery = query(
        collection(db, 'students'),
        where('studentId', '==', resultData.studentId)
      );
      const studentSnapshot = await getDocs(studentsQuery);
      
      if (studentSnapshot.empty) {
        throw new Error('Student not found');
      }

      const studentData = studentSnapshot.docs[0].data();
      
      const completeResultData = {
        ...resultData,
        studentName: studentData.name,
        email: studentData.email,
        branch: studentData.branch,
        year: studentData.year,
        uploadedAt: serverTimestamp(),
        verified: false,
        id: doc(collection(db, 'student_results')).id
      };

      const docRef = await addDoc(collection(db, 'student_results'), completeResultData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding student result:', error);
      throw error;
    }
  }

  static async updateStudentResult(id: string, updateData: any): Promise<void> {
    try {
      const docRef = doc(db, 'student_results', id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating student result:', error);
      throw error;
    }
  }

  static async deleteStudentResult(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'student_results', id));
    } catch (error) {
      console.error('Error deleting student result:', error);
      throw error;
    }
  }

  // Complete student profile after approval
  static async completeStudentProfile(studentId: string, profileData: any): Promise<void> {
    try {
      // Find student by studentId
      const q = query(
        collection(db, 'students'),
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Student not found');
      }

      const studentDoc = querySnapshot.docs[0];
      const studentData = studentDoc.data();
      
      // Update student profile in students collection
      await updateDoc(studentDoc.ref, {
        branch: profileData.branch,
        year: profileData.year,
        cgpa: profileData.cgpa,
        marks10th: profileData.marks10th || null,
        marks12th: profileData.marks12th || null,
        location: profileData.location || '',
        linkedinProfile: profileData.linkedinProfile || '',
        skillSet: profileData.skillSet || [],
        achievements: profileData.achievements || [],
        guardianContact: profileData.guardianContact || '',
        projects: profileData.projects || [],
        internships: profileData.internships || '',
        certifications: profileData.certifications || [],
        profileCompleted: true,
        profileCompletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Also update the user record in users collection
      if (studentData.uid) {
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('uid', '==', studentData.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            profileCompleted: true,
            profileCompletedAt: serverTimestamp(),
            branch: profileData.branch,
            year: profileData.year,
            cgpa: profileData.cgpa,
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error completing student profile:', error);
      throw error;
    }
  }

  // Get student by student ID
  static async getStudentByStudentId(studentId: string): Promise<Student | null> {
    try {
      const q = query(
        collection(db, 'students'),
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Student;
    } catch (error) {
      console.error('Error fetching student by studentId:', error);
      throw error;
    }
  }

  // Check student status by email (for login/status checking)
  static async checkStudentStatusByEmail(email: string): Promise<{
    status: 'not_found' | 'pending' | 'approved' | 'rejected';
    studentId?: string;
    profileCompleted?: boolean;
    data?: any;
  }> {
    try {
      // Check pending students first
      const pendingRef = collection(db, 'pending_students');
      const pendingQuery = query(pendingRef, where('email', '==', email));
      const pendingSnapshot = await getDocs(pendingQuery);
      
      if (!pendingSnapshot.empty) {
        const pendingData = pendingSnapshot.docs[0].data();
        return {
          status: pendingData.status || 'pending',
          studentId: pendingData.studentId,
          data: pendingData
        };
      }
      
      // Check approved students
      const studentsRef = collection(db, 'students');
      const studentsQuery = query(studentsRef, where('email', '==', email));
      const studentsSnapshot = await getDocs(studentsQuery);
      
      if (!studentsSnapshot.empty) {
        const studentData = studentsSnapshot.docs[0].data();
        return {
          status: 'approved',
          studentId: studentData.studentId,
          profileCompleted: studentData.profileCompleted || false,
          data: studentData
        };
      }
      
      return { status: 'not_found' };
    } catch (error) {
      console.error('Error checking student status:', error);
      throw new Error('Failed to check student status');
    }
  }

  // Student login with Firebase Auth
  static async loginStudent(email: string, password: string): Promise<{
    user: User;
    studentData: any;
  }> {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(normalizedEmail)) {
        throw new Error('Invalid email format');
      }

      console.log('Attempting student login for:', normalizedEmail);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      
      console.log('Firebase auth successful, getting student data...');
      
      // Get student data from users collection
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('uid', '==', userCredential.user.uid));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        throw new Error('Student account not found');
      }
      
      const userData = userSnapshot.docs[0].data();
      
      if (userData.role !== 'student') {
        throw new Error('Account is not a student account');
      }
      
      if (!userData.approved) {
        throw new Error('Student account is not approved yet. Please wait for HOD approval.');
      }
      
      // Get detailed student data
      const studentsRef = collection(db, 'students');
      const studentQuery = query(studentsRef, where('email', '==', normalizedEmail));
      const studentSnapshot = await getDocs(studentQuery);
      
      let studentData = userData;
      if (!studentSnapshot.empty) {
        studentData = { ...userData, ...studentSnapshot.docs[0].data() };
      }
      
      return {
        user: userCredential.user,
        studentData
      };
    } catch (error: any) {
      console.error('Error logging in student:', error);
      throw new Error(error.message || 'Failed to login');
    }
  }

  // Get approved colleges for dropdown
  static async getApprovedColleges(): Promise<Array<{
    id: string;
    name: string;
    hodEmail: string;
    hodUid: string;
    website?: string;
  }>> {
    try {
      const collegesRef = collection(db, 'colleges');
      const q = query(collegesRef, where('isApproved', '==', true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        hodEmail: doc.data().hodEmail,
        hodUid: doc.data().hodUid,
        website: doc.data().website
      }));
    } catch (error) {
      console.error('Error fetching approved colleges:', error);
      throw new Error('Failed to fetch colleges');
    }
  }

  // Subscribe to real-time analytics data
  static subscribeToAnalytics(callback: (data: any) => void): () => void {
    // Subscribe to multiple collections and aggregate data
    const unsubscribeStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        // Analytics will be calculated when any student data changes
        this.getHODAnalytics().then(callback);
      }
    );

    return unsubscribeStudents;
  }
}

// Drive Service Functions
export class DriveService {
  private static collection = 'placement_drives';

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
        const currentApplicants = driveSnap.data().applicants || 0;
        // Increment the applicants counter
        await updateDoc(driveRef, {
          applicants: currentApplicants + 1,
          updatedAt: serverTimestamp(),
        });
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

// Application Management Service
export interface StudentApplication {
  id: string;
  studentId: string;
  driveId: string;
  driveName: string;
  companyName: string;
  role: string;
  appliedAt: Timestamp;
  status: 'applied' | 'in_progress' | 'interview_scheduled' | 'selected' | 'rejected' | 'offer_received';
  currentRound: string;
  studentData: {
    name: string;
    email: string;
    phone: string;
    cgpa: number;
    branch: string;
    year: string;
    skillSet: string[];
    resume?: string;
  };
  updates: Array<{
    status: string;
    note: string;
    timestamp: Timestamp;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class ApplicationService {
  private static collection = 'applications';

  // Apply for a drive
  static async applyForDrive(studentId: string, driveId: string, studentData: any): Promise<string> {
    try {
      // Get drive details
      const drive = await DriveService.getDriveById(driveId);
      if (!drive) {
        throw new Error('Drive not found');
      }

      // Check if student already applied
      const existingApplication = await this.getStudentApplication(studentId, driveId);
      if (existingApplication) {
        throw new Error('You have already applied for this drive');
      }

      // Create application
      const applicationData: Omit<StudentApplication, 'id' | 'createdAt' | 'updatedAt'> = {
        studentId,
        driveId,
        driveName: drive.roleName,
        companyName: drive.companyName,
        role: drive.roleName,
        appliedAt: serverTimestamp() as Timestamp,
        status: 'applied',
        currentRound: 'Application Submitted',
        studentData: {
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          cgpa: studentData.cgpa,
          branch: studentData.branch,
          year: studentData.year,
          skillSet: studentData.skillSet || [],
          resume: studentData.resume
        },
        updates: [{
          status: 'applied',
          note: 'Application submitted successfully',
          timestamp: serverTimestamp() as Timestamp
        }]
      };

      const docRef = await addDoc(collection(db, this.collection), {
        ...applicationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update drive applicants
      await DriveService.addStudentToDrive(driveId, studentId);

      return docRef.id;
    } catch (error) {
      console.error('Error applying for drive:', error);
      throw error;
    }
  }

  // Get student's applications
  static async getStudentApplications(studentId: string): Promise<StudentApplication[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, this.collection),
          where('studentId', '==', studentId),
          orderBy('appliedAt', 'desc')
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as StudentApplication));
    } catch (error) {
      console.error('Error fetching student applications:', error);
      throw error;
    }
  }

  // Get specific application
  static async getStudentApplication(studentId: string, driveId: string): Promise<StudentApplication | null> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, this.collection),
          where('studentId', '==', studentId),
          where('driveId', '==', driveId)
        )
      );

      if (querySnapshot.docs.length > 0) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as StudentApplication;
      }

      return null;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  // Update application status
  static async updateApplicationStatus(applicationId: string, status: string, note: string): Promise<void> {
    try {
      const applicationRef = doc(db, this.collection, applicationId);
      const applicationSnap = await getDoc(applicationRef);
      
      if (applicationSnap.exists()) {
        const currentUpdates = applicationSnap.data().updates || [];
        await updateDoc(applicationRef, {
          status,
          currentRound: note,
          updates: [...currentUpdates, {
            status,
            note,
            timestamp: serverTimestamp()
          }],
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
}

// Enhanced DriveService for skill-based recommendations
export class EnhancedDriveService extends DriveService {
  // Get drives relevant to student's skills
  static async getRecommendedDrives(studentSkills: string[], studentBranch: string, studentCGPA: number): Promise<Drive[]> {
    try {
      const allDrives = await this.getAllDrives();
      
      // Filter active drives that match eligibility
      const eligibleDrives = allDrives.filter(drive => {
        // Check status
        if (drive.status !== 'active' && drive.status !== 'upcoming') return false;
        
        // Check CGPA eligibility
        if (drive.eligibilityCriteria.minCGPA && studentCGPA < parseFloat(drive.eligibilityCriteria.minCGPA)) return false;
        
        // Check branch eligibility
        if (drive.eligibilityCriteria.allowedBranches && drive.eligibilityCriteria.allowedBranches.length > 0) {
          if (!drive.eligibilityCriteria.allowedBranches.includes(studentBranch)) return false;
        }
        
        return true;
      });

      // Sort by skill relevance
      const skillScores = eligibleDrives.map(drive => {
        let score = 0;
        const driveSkills = this.extractSkillsFromDescription(drive.jobDescription + ' ' + drive.roleName);
        
        studentSkills.forEach(skill => {
          driveSkills.forEach(driveSkill => {
            if (skill.toLowerCase().includes(driveSkill.toLowerCase()) || 
                driveSkill.toLowerCase().includes(skill.toLowerCase())) {
              score += 1;
            }
          });
        });
        
        return { drive, score };
      });

      // Sort by score and return top recommendations
      return skillScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 6) // Top 6 recommendations
        .map(item => item.drive);
    } catch (error) {
      console.error('Error getting recommended drives:', error);
      throw error;
    }
  }

  // Extract potential skills from job description
  private static extractSkillsFromDescription(description: string): string[] {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'DevOps', 'CI/CD',
      'Machine Learning', 'AI', 'Data Science', 'Analytics', 'Spring Boot',
      'Microservices', 'REST', 'GraphQL', 'Agile', 'Scrum'
    ];

    return commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
  }
}
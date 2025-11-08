// Sample data for testing HOD Dashboard
// This file contains functions to populate the database with test data

import { addDoc, collection, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { serverTimestamp } from 'firebase/firestore';

export const createSampleStudents = async (hodEmail: string, universityName: string) => {
  const sampleStudents = [
    {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@student.edu',
      phone: '9876543210',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1001',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 8.5,
      placementStatus: 'Placed',
      company: 'Google',
      package: '₹25L',
      status: 'approved',
      isApproved: true,
      profileCompleted: true,
      skillSet: ['React', 'Node.js', 'Python', 'Machine Learning'],
      location: 'Bangalore',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      phone: '9876543211',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1002',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 9.1,
      placementStatus: 'Placed',
      company: 'Microsoft',
      package: '₹22L',
      status: 'approved',
      isApproved: true,
      profileCompleted: true,
      skillSet: ['Java', 'Spring Boot', 'Azure', 'SQL'],
      location: 'Hyderabad',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      name: 'Amit Kumar',
      email: 'amit.kumar@student.edu',
      phone: '9876543212',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1003',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 7.8,
      placementStatus: 'In Process',
      company: '',
      package: '',
      status: 'approved',
      isApproved: true,
      profileCompleted: true,
      skillSet: ['JavaScript', 'React', 'MongoDB'],
      location: 'Mumbai',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      name: 'Sneha Singh',
      email: 'sneha.singh@student.edu',
      phone: '9876543213',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1004',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 8.9,
      placementStatus: 'Placed',
      company: 'Amazon',
      package: '₹20L',
      status: 'approved',
      isApproved: true,
      profileCompleted: true,
      skillSet: ['Python', 'AWS', 'Docker', 'Kubernetes'],
      location: 'Chennai',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      name: 'Vikash Raj',
      email: 'vikash.raj@student.edu',
      phone: '9876543214',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1005',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 7.2,
      placementStatus: 'Unplaced',
      company: '',
      package: '',
      status: 'approved',
      isApproved: true,
      profileCompleted: true,
      skillSet: ['HTML', 'CSS', 'JavaScript', 'PHP'],
      location: 'Delhi',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  try {
    for (const student of sampleStudents) {
      await addDoc(collection(db, 'students'), student);
    }
    console.log('Sample students created successfully');
    return { success: true, message: 'Sample students created successfully' };
  } catch (error) {
    console.error('Error creating sample students:', error);
    return { success: false, error: error };
  }
};

export const createSamplePendingStudents = async (hodEmail: string, universityName: string) => {
  const samplePendingStudents = [
    {
      name: 'Arjun Mehta',
      email: 'arjun.mehta@student.edu',
      phone: '9876543215',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1006',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 8.2,
      status: 'pending_approval',
      isApproved: false,
      appliedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    {
      name: 'Kavya Reddy',
      email: 'kavya.reddy@student.edu',
      phone: '9876543216',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1007',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 9.3,
      status: 'pending_approval',
      isApproved: false,
      appliedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    {
      name: 'Rohit Gupta',
      email: 'rohit.gupta@student.edu',
      phone: '9876543217',
      university: universityName,
      hodEmail: hodEmail,
      studentId: 'KM1008',
      branch: 'Computer Science & Engineering',
      year: 'Final Year',
      cgpa: 7.5,
      status: 'pending_approval',
      isApproved: false,
      appliedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }
  ];

  try {
    for (const student of samplePendingStudents) {
      await addDoc(collection(db, 'pending_students'), student);
    }
    console.log('Sample pending students created successfully');
    return { success: true, message: 'Sample pending students created successfully' };
  } catch (error) {
    console.error('Error creating sample pending students:', error);
    return { success: false, error: error };
  }
};
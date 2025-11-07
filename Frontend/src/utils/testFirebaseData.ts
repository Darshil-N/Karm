// Test Firebase Data Creation Script
// Run this in your browser console while logged into the Firebase project

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Test Companies Data
const testCompanies = [
  {
    name: "Google",
    description: "Technology company specializing in Internet-related services",
    industry: "Technology",
    location: "Mountain View, CA",
    tier: "Tier 1",
    website: "https://google.com",
    requirements: {
      minCGPA: 8.0,
      branches: ["Computer Science", "Information Technology"],
      skills: ["JavaScript", "Python", "Data Structures"]
    },
    visitDate: new Date('2024-12-15'),
    package: "₹28 LPA",
    createdAt: serverTimestamp()
  },
  {
    name: "Microsoft",
    description: "Multinational technology corporation",
    industry: "Technology", 
    location: "Redmond, WA",
    tier: "Tier 1",
    website: "https://microsoft.com",
    requirements: {
      minCGPA: 7.5,
      branches: ["Computer Science", "Electronics"],
      skills: ["C++", "Java", "Cloud Technologies"]
    },
    visitDate: new Date('2024-12-20'),
    package: "₹32 LPA",
    createdAt: serverTimestamp()
  },
  {
    name: "TCS",
    description: "Indian multinational information technology services company",
    industry: "IT Services",
    location: "Mumbai, India", 
    tier: "Tier 2",
    website: "https://tcs.com",
    requirements: {
      minCGPA: 6.0,
      branches: ["Computer Science", "Information Technology", "Electronics"],
      skills: ["Java", "Python", "Web Development"]
    },
    visitDate: new Date('2024-11-25'),
    package: "₹3.5 LPA",
    createdAt: serverTimestamp()
  }
];

// Test Students Data
const testStudents = [
  {
    name: "Aditya Sharma",
    email: "aditya.sharma@student.college.edu",
    phone: "+91 9876543210",
    branch: "Computer Science",
    year: "Final Year",
    cgpa: 8.5,
    placementStatus: "Placed",
    company: "Google",
    package: "₹28 LPA",
    location: "Delhi, India",
    skillSet: ["JavaScript", "React", "Node.js", "Python"],
    resumeScore: 85,
    applications: 15,
    offers: 3,
    interviews: 8,
    dateOfBirth: "2002-05-15",
    guardianContact: "+91 9876543211",
    linkedinProfile: "https://linkedin.com/in/aditya-sharma",
    marks10th: 92.5,
    marks12th: 88.0,
    projects: [
      {
        title: "E-commerce Platform",
        description: "Full-stack web application for online shopping",
        technologies: ["React", "Node.js", "MongoDB"]
      }
    ],
    achievements: ["Winner of College Hackathon 2024", "Dean's List Student"],
    createdAt: serverTimestamp()
  },
  {
    name: "Priya Patel", 
    email: "priya.patel@student.college.edu",
    phone: "+91 9876543212",
    branch: "Information Technology",
    year: "Final Year", 
    cgpa: 9.2,
    placementStatus: "In Process",
    location: "Gujarat, India",
    skillSet: ["Java", "Spring Boot", "Angular", "MySQL"],
    resumeScore: 92,
    applications: 12,
    offers: 0,
    interviews: 5,
    dateOfBirth: "2002-08-22",
    guardianContact: "+91 9876543213",
    linkedinProfile: "https://linkedin.com/in/priya-patel",
    marks10th: 95.0,
    marks12th: 91.5,
    projects: [
      {
        title: "Student Management System",
        description: "Web-based system for managing student records",
        technologies: ["Java", "Spring Boot", "MySQL"]
      }
    ],
    achievements: ["Topper of the Batch", "Best Project Award"],
    createdAt: serverTimestamp()
  }
];

// Function to add test data
async function addTestData() {
  try {
    console.log('Adding test companies...');
    for (const company of testCompanies) {
      await addDoc(collection(db, 'companies'), company);
    }
    
    console.log('Adding test students...');
    for (const student of testStudents) {
      await addDoc(collection(db, 'students'), student);
    }
    
    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

// Export for use
export { addTestData, testCompanies, testStudents };
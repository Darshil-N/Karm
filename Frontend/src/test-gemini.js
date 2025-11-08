// Test Gemini AI Integration with Modern SDK
// This can be run independently to verify the API works

import { GeminiAIService } from './services/aiService.js';

async function testGeminiIntegration() {
  console.log('🧪 Testing Gemini AI Integration (Modern SDK)...');
  console.log('API Key configured:', !!import.meta.env.VITE_GEMINI_API_KEY);
  console.log('Using model: gemini-2.5-flash');
  
  try {
    // Test connection
    console.log('1️⃣ Testing connection...');
    const isConnected = await GeminiAIService.testConnection();
    console.log('Connection result:', isConnected ? '✅ SUCCESS' : '❌ FAILED');
    
    if (isConnected) {
      // Test response analysis
      console.log('2️⃣ Testing response analysis...');
      const analysis = await GeminiAIService.analyzeResponse(
        "What is your greatest strength?",
        "My greatest strength is problem-solving. I approach challenges systematically, break them down into smaller parts, and use analytical thinking to find effective solutions. For example, when debugging complex issues, I use structured debugging techniques and maintain detailed logs to track my progress."
      );
      console.log('Analysis result:', analysis);
      
      // Test question generation
      console.log('3️⃣ Testing question generation...');
      const question = await GeminiAIService.generateQuestion("intermediate", "frontend development");
      console.log('Generated question:', question);
      
      console.log('🎉 All tests passed! Gemini API is working with modern SDK.');
    } else {
      console.log('❌ Connection failed. Check your API key configuration.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('💡 Tip: Make sure your API key is valid and has the necessary permissions.');
  }
}

// Auto-run test when loaded
testGeminiIntegration();
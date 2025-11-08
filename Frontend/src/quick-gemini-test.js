// Quick Gemini API Test Script
// Run this in browser console to test the integration

async function quickGeminiTest() {
  console.log('🚀 Quick Gemini API Test...');
  
  // Check if SDK is loaded
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    console.log('✅ Google AI SDK loaded successfully');
    
    // Check API key
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || 'AIzaSyDTlQlWCZUcAylzzG1CfRDPgWxl-b19Oa4';
    console.log('✅ API Key:', apiKey ? 'Configured' : 'Missing');
    
    if (apiKey) {
      // Test API call
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      console.log('📡 Testing API call...');
      const result = await model.generateContent("Say 'Hello from Gemini!' if you can read this.");
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini Response:', text);
      console.log('🎉 API is working correctly!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('💡 Make sure to run this in the browser with the app loaded');
  }
}

// Run the test
quickGeminiTest();
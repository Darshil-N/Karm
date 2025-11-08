// Quick test script to verify AI services are working
// Run this from the browser console when the app is running

console.log('Testing AI Services Integration...');

// Check if environment variables are loaded
console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Configured' : 'Missing');

// Test YOLO model access
fetch('/best.pt')
  .then(response => {
    if (response.ok) {
      console.log('✅ YOLO model (best.pt) is accessible');
    } else {
      console.log('❌ YOLO model not found');
    }
  })
  .catch(error => {
    console.log('❌ Error accessing YOLO model:', error);
  });

// Test Gemini API connection
const testGemini = async () => {
  try {
    // Import the service
    const { GeminiAIService } = await import('./services/aiService');
    
    const isConnected = await GeminiAIService.testConnection();
    console.log(isConnected ? '✅ Gemini AI connected successfully' : '❌ Gemini AI connection failed');
    
    if (isConnected) {
      console.log('🧠 Testing interview analysis...');
      const analysis = await GeminiAIService.analyzeResponse(
        "Tell me about yourself",
        "I am a computer science student passionate about software development"
      );
      console.log('📝 Gemini response:', analysis);
    }
  } catch (error) {
    console.log('❌ Error testing Gemini:', error);
  }
};

// Test emotion detection
const testEmotionDetection = async () => {
  try {
    const { EmotionDetectionService } = await import('./services/aiService');
    
    console.log('🎭 Testing emotion detection...');
    await EmotionDetectionService.loadModel();
    
    // Create a simple test canvas
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 224, 224);
    
    const imageData = canvas.toDataURL('image/jpeg');
    const emotion = await EmotionDetectionService.detectEmotion(imageData);
    
    console.log('🎭 Detected emotion:', emotion);
  } catch (error) {
    console.log('❌ Error testing emotion detection:', error);
  }
};

testGemini();
testEmotionDetection();

console.log('Test script loaded. Check the logs above for results.');
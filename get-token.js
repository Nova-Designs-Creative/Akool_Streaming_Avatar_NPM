// Script to get Akool Bearer token from clientId and clientSecret
// Run this with: node get-token.js

const clientId = "y3LR1dOJxfZd5AWcYzR/hg==";
const clientSecret = "9j7HMZobt1of5Sv2+OGsK8Rv3oFigNvz";

async function getAkoolToken() {
  try {
    const response = await fetch('https://openapi.akool.com/api/open/v3/getToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret
      })
    });

    const result = await response.json();
    
    if (result.code === 1000) {
      console.log('✅ Success! Your Bearer token is:');
      console.log(result.token);
      console.log('\n📝 Copy this token and paste it in your .env file as:');
      console.log(`VITE_AKOOL_API_KEY=${result.token}`);
    } else {
      console.error('❌ Failed to get token:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getAkoolToken();

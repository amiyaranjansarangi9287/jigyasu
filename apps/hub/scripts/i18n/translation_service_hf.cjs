const https = require('https');

// Read HF token from environment
const HF_TOKEN = process.env.HF_TOKEN || '';

async function translateTextHF(text, targetLangCode) {
  return new Promise((resolve, reject) => {
    if (!HF_TOKEN) {
      return reject(new Error('HF_TOKEN environment variable is missing.'));
    }

    // Map ISO code to IndicTrans2 target format if needed
    // Note: IndicTrans2 requires specific language tags, e.g., 'hin_Deva' for Hindi
    const langMap = {
      'hi': 'hin_Deva',
      'od': 'ory_Orya',
      'or': 'ory_Orya',
      'bn': 'ben_Beng',
      'as': 'asm_Beng',
      'gu': 'guj_Gujr',
      'kn': 'kan_Knda',
      'ml': 'mal_Mlym',
      'mr': 'mar_Deva',
      'pa': 'pan_Guru',
      'ta': 'tam_Taml',
      'te': 'tel_Telu',
      'ur': 'urd_Arab',
      // Fallback
    };
    
    const targetTag = langMap[targetLangCode] || `${targetLangCode}_Deva`;
    
    // IndicTrans2 prompt format
    const inputFormatted = `__eng_Latn__ ${text} __${targetTag}__`;

    const data = JSON.stringify({
      inputs: inputFormatted,
      parameters: {
        max_new_tokens: 256
      }
    });

    const options = {
      hostname: 'api-inference.huggingface.co',
      port: 443,
      path: '/models/ai4bharat/indictrans2-en-indic-1B',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HF API failed with status ${res.statusCode}: ${responseBody}`));
        }
        try {
          const parsed = JSON.parse(responseBody);
          let translated = parsed[0]?.generated_text || '';
          
          // Clean up the output tags if present
          translated = translated.replace(/__.*?__/g, '').trim();
          resolve(translated);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Network error: ${e.message}`));
    });

    req.write(data);
    req.end();
  });
}

// Simple test block when run directly
if (require.main === module) {
  console.log('Testing HF Inference API for IndicTrans2...');
  translateTextHF('Hello, welcome to the maker space!', 'hi')
    .then(res => console.log('Translated (Hindi):', res))
    .catch(err => console.error('Test failed:', err.message));
}

module.exports = { translateTextHF };

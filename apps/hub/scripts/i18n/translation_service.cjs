require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function translateWithGoogle(text, targetLang, retries = 3) {
  // Google Translate uses 'or' for Odia, not 'od'
  const googleLang = targetLang === 'od' ? 'or' : targetLang;
  
  for (let i = 0; i < retries; i++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${googleLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (response.status === 429) {
        console.warn(`Rate limited. Retrying in ${Math.pow(2, i)} seconds...`);
        await delay(Math.pow(2, i) * 1000);
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data[0].map(item => item[0]).join('');
    } catch (error) {
      console.error(`Google translation failed for: "${text.substring(0, 20)}..." (Attempt ${i + 1}/${retries})`);
      if (i === retries - 1) return text; // fallback to English on final failure
      await delay(Math.pow(2, i) * 1000);
    }
  }
  return text;
}

async function translateWithSarvam(text, targetLang, apiKey) {
  console.log(`[Sarvam Provider] Translating "${text.substring(0, 20)}..." to ${targetLang}`);
  throw new Error("Sarvam API endpoint not implemented yet.");
}

async function translateText(text, targetLang, provider = process.env.TRANSLATION_PROVIDER || 'google') {
  if (provider === 'sarvam') {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      throw new Error("SARVAM_API_KEY is missing from .env!");
    }
    return translateWithSarvam(text, targetLang, apiKey);
  }
  
  return translateWithGoogle(text, targetLang);
}

module.exports = { translateText };

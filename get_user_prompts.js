const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/arsjo/.gemini/antigravity/brain/3a16289e-3a7f-4ba5-a3a7-3437f9f2cc48/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('"type":"USER_INPUT"')) {
      const parsed = JSON.parse(line);
      console.log('--- USER INPUT ---');
      console.log(parsed.content);
    }
  }
}

processLineByLine();

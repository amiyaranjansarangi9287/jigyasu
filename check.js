const fs = require('fs'); const code = fs.readFileSync('.vercel/output/static/assets/index-ACXL51Lb.js', 'utf8'); const match = code.match(/welcome_title:.{0,50}/g); console.log(match);

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'D:\\vision_agentic\\jigyasu\\pitch_docs';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
    deviceScaleFactor: 2, // High resolution
  });

  const page = await context.newPage();
  
  // 1. Landing / Onboarding (Multilingual Magic)
  console.log("Recording Multilingual Magic...");
  await page.goto('http://localhost:8090/');
  await delay(2000);
  await page.screenshot({ path: path.join(outDir, '01_multilingual_magic.png') });
  
  // Try to click around on the onboarding page
  try {
    await page.mouse.move(500, 500);
    await delay(500);
    await page.mouse.down();
    await page.mouse.up();
    await delay(1000);
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[0].click();
    }
  } catch(e) {}
  await delay(2000);

  // 2. Hub / Learning Paths
  console.log("Recording Learning Paths...");
  await page.goto('http://localhost:8090/home');
  await delay(2000);
  await page.screenshot({ path: path.join(outDir, '02_learning_paths.png') });
  
  try {
    await page.mouse.wheel(0, 500);
    await delay(2000);
    await page.mouse.wheel(0, -500);
  } catch(e) {}
  await delay(2000);

  // 3. Maker Space / CampCraft
  console.log("Recording Maker Space...");
  await page.goto('http://localhost:8090/execute');
  await delay(3000);
  await page.screenshot({ path: path.join(outDir, '03_maker_space.png') });
  
  try {
    await page.mouse.wheel(0, 800);
    await delay(2000);
    await page.mouse.wheel(0, 800);
    await delay(2000);
  } catch(e) {}

  // 4. Activity Details / Interaction
  console.log("Recording Activity Details...");
  try {
    // Click on the first activity card
    const cards = await page.$$('.rounded-3xl, .rounded-2xl');
    if (cards.length > 2) {
      const box = await cards[2].boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await delay(500);
        await page.mouse.down();
        await page.mouse.up();
        await delay(2000);
      }
    }
  } catch(e) {}
  await page.screenshot({ path: path.join(outDir, '04_activity_details.png') });
  await delay(2000);

  // 5. Settings / Theme toggle
  console.log("Recording Settings / Theme...");
  try {
    const svgs = await page.$$('svg');
    for (let svg of svgs) {
       // try clicking svgs hoping to hit settings/favorites
       const box = await svg.boundingBox();
       if (box && box.y < 100 && box.x > 1500) {
          await page.mouse.move(box.x + 5, box.y + 5);
          await page.mouse.down();
          await page.mouse.up();
          await delay(1000);
          break;
       }
    }
  } catch(e) {}
  await page.screenshot({ path: path.join(outDir, '05_settings.png') });
  await delay(3000);

  // 6. Parent Dashboard
  console.log("Recording Parent Dashboard...");
  await page.goto('http://localhost:8090/parents');
  await delay(2000);
  await page.screenshot({ path: path.join(outDir, '06_parent_dashboard.png') });
  try {
    await page.mouse.wheel(0, 600);
    await delay(2000);
  } catch(e) {}

  console.log("Closing browser and saving videos...");
  await browser.close();

  // Rename the generated webm file
  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
  for (let i = 0; i < files.length; i++) {
    fs.renameSync(path.join(outDir, files[i]), path.join(outDir, `showcase_video_${i + 1}.webm`));
  }
  
  console.log("Done!");
})();

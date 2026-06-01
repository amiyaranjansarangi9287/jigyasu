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
  const browser = await chromium.launch({ headless: true });
  
  async function recordSection(name, actionCallback) {
    console.log(`Recording ${name}...`);
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    
    await actionCallback(page);
    
    const videoPath = await page.video().path();
    await context.close(); // Wait for video to be saved
    
    const newPath = path.join(outDir, `${name}.webm`);
    if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
    fs.renameSync(videoPath, newPath);
  }

  // 1. Landing / Onboarding (Multilingual Magic)
  await recordSection('01_multilingual_magic', async (page) => {
    await page.goto('http://localhost:8090/');
    await delay(2000);
    try {
      await page.mouse.move(500, 500);
      await delay(500);
      await page.mouse.down();
      await page.mouse.up();
      await delay(1000);
      const buttons = await page.$$('button');
      if (buttons.length > 0) await buttons[0].click();
    } catch(e) {}
    await delay(2000);
  });

  // 2. Hub / Learning Paths
  await recordSection('02_learning_paths', async (page) => {
    await page.goto('http://localhost:8090/home');
    await delay(2000);
    try {
      await page.mouse.wheel(0, 500);
      await delay(2000);
      await page.mouse.wheel(0, -500);
    } catch(e) {}
    await delay(2000);
  });

  // 3. Maker Space / CampCraft
  await recordSection('03_maker_space', async (page) => {
    await page.goto('http://localhost:8090/execute');
    await delay(3000);
    try {
      await page.mouse.wheel(0, 800);
      await delay(2000);
      await page.mouse.wheel(0, 800);
      await delay(2000);
    } catch(e) {}
  });

  // 4. Activity Details / Interaction
  await recordSection('04_activity_details', async (page) => {
    await page.goto('http://localhost:8090/execute');
    await delay(3000);
    try {
      const cards = await page.$$('.rounded-3xl, .rounded-2xl');
      if (cards.length > 2) {
        const box = await cards[2].boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await delay(500);
          await page.mouse.down();
          await page.mouse.up();
          await delay(3000);
        }
      }
    } catch(e) {}
  });

  // 5. Settings / Theme toggle
  await recordSection('05_settings', async (page) => {
    await page.goto('http://localhost:8090/execute');
    await delay(2000);
    try {
      const svgs = await page.$$('svg');
      for (let svg of svgs) {
         const box = await svg.boundingBox();
         if (box && box.y < 100 && box.x > 1500) {
            await page.mouse.move(box.x + 5, box.y + 5);
            await page.mouse.down();
            await page.mouse.up();
            await delay(3000);
            break;
         }
      }
    } catch(e) {}
  });

  // 6. Parent Dashboard
  await recordSection('06_parent_dashboard', async (page) => {
    await page.goto('http://localhost:8090/parents');
    await delay(2000);
    try {
      await page.mouse.wheel(0, 600);
      await delay(2000);
      await page.mouse.wheel(0, -600);
      await delay(2000);
    } catch(e) {}
  });

  console.log("Closing browser...");
  await browser.close();
  console.log("Done!");
})();

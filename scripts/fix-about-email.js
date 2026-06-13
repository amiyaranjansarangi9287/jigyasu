#!/usr/bin/env node

/**
 * Email Replacement Script for Jigyasu About Us Page
 * 
 * This script replaces the personal email address (ars.jobs2019@gmail.com) 
 * with the professional email (contact@jigyasu.app) across locale JSON files.
 * 
 * Features:
 * - Deep object traversal to find all email instances
 * - Handles both formats: ars.jobs2019@gmail.com and ars_jobs2019_gmail_com
 * - Creates .bak backup files before modification
 * - Validates JSON integrity after changes
 * - Detects corruption (repeated email patterns)
 * - Clear logging of all changes
 * 
 * Usage:
 *   node scripts/fix-about-email.js <filepath>
 *   node scripts/fix-about-email.js apps/hub/src/learnos/i18n/locales/en.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OLD_EMAIL_DOT = 'ars.jobs2019@gmail.com';
const OLD_EMAIL_UNDERSCORE = 'ars_jobs2019_gmail_com';
const NEW_EMAIL_DOT = 'contact@jigyasu.app';
const NEW_EMAIL_UNDERSCORE = 'contact_jigyasu_app';

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Log with color
 */
function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

/**
 * Deep traverse an object and replace all email instances
 * @param {any} obj - The object to traverse
 * @param {string} path - Current path in the object (for logging)
 * @param {Array} changes - Array to collect change records
 * @returns {any} - The modified object
 */
function replaceEmailsDeep(obj, path = 'root', changes = []) {
  if (typeof obj === 'string') {
    let modified = obj;
    let hasChange = false;
    
    // Replace dot format
    if (modified.includes(OLD_EMAIL_DOT)) {
      const beforeCount = (modified.match(new RegExp(OLD_EMAIL_DOT.replace(/\./g, '\\.'), 'g')) || []).length;
      modified = modified.replace(new RegExp(OLD_EMAIL_DOT.replace(/\./g, '\\.'), 'g'), NEW_EMAIL_DOT);
      changes.push({
        path,
        type: 'dot_format',
        count: beforeCount,
        before: obj.length > 100 ? obj.substring(0, 100) + '...' : obj,
        after: modified.length > 100 ? modified.substring(0, 100) + '...' : modified,
      });
      hasChange = true;
    }
    
    // Replace underscore format
    if (modified.includes(OLD_EMAIL_UNDERSCORE)) {
      const beforeCount = (modified.match(new RegExp(OLD_EMAIL_UNDERSCORE, 'g')) || []).length;
      modified = modified.replace(new RegExp(OLD_EMAIL_UNDERSCORE, 'g'), NEW_EMAIL_UNDERSCORE);
      changes.push({
        path,
        type: 'underscore_format',
        count: beforeCount,
        before: obj.length > 100 ? obj.substring(0, 100) + '...' : obj,
        after: modified.length > 100 ? modified.substring(0, 100) + '...' : modified,
      });
      hasChange = true;
    }
    
    return modified;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item, index) => replaceEmailsDeep(item, `${path}[${index}]`, changes));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Replace emails in key names too
      let newKey = key;
      if (key.includes(OLD_EMAIL_UNDERSCORE)) {
        newKey = key.replace(new RegExp(OLD_EMAIL_UNDERSCORE, 'g'), NEW_EMAIL_UNDERSCORE);
        changes.push({
          path: `${path}.<key>`,
          type: 'key_name',
          count: 1,
          before: key,
          after: newKey,
        });
      }
      result[newKey] = replaceEmailsDeep(value, `${path}.${newKey}`, changes);
    }
    return result;
  }
  
  return obj;
}

/**
 * Detect corruption (thousands of repeated emails)
 * @param {string} content - File content
 * @returns {Object} - Corruption detection result
 */
function detectCorruption(content) {
  const dotMatches = (content.match(new RegExp(OLD_EMAIL_DOT.replace(/\./g, '\\.'), 'g')) || []).length;
  const underscoreMatches = (content.match(new RegExp(OLD_EMAIL_UNDERSCORE, 'g')) || []).length;
  const totalMatches = dotMatches + underscoreMatches;
  
  const isCorrupted = totalMatches > 100; // More than 100 instances suggests corruption
  
  return {
    isCorrupted,
    dotMatches,
    underscoreMatches,
    totalMatches,
  };
}

/**
 * Create backup of the file
 * @param {string} filePath - Path to the file
 * @returns {string} - Path to backup file
 */
function createBackup(filePath) {
  const backupPath = filePath + '.bak';
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Validate JSON structure
 * @param {string} content - JSON content
 * @returns {Object} - Validation result
 */
function validateJson(content) {
  try {
    const parsed = JSON.parse(content);
    return { valid: true, data: parsed };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message,
      line: error.message.match(/position (\d+)/)?.[1] || 'unknown',
    };
  }
}

/**
 * Process a single file
 * @param {string} filePath - Path to the JSON file
 */
function processFile(filePath) {
  log(colors.cyan, `\n${'='.repeat(60)}`);
  log(colors.bright + colors.cyan, `Processing: ${filePath}`);
  log(colors.cyan, '='.repeat(60));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    log(colors.red, `❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  // Read the file
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
    log(colors.green, `✓ File read successfully (${content.length} bytes)`);
  } catch (error) {
    log(colors.red, `❌ Error reading file: ${error.message}`);
    process.exit(1);
  }
  
  // Detect corruption
  const corruption = detectCorruption(content);
  if (corruption.isCorrupted) {
    log(colors.yellow, `⚠️  WARNING: File appears corrupted with repeated emails!`);
    log(colors.yellow, `   Found ${corruption.totalMatches} instances:`);
    log(colors.yellow, `   - Dot format: ${corruption.dotMatches}`);
    log(colors.yellow, `   - Underscore format: ${corruption.underscoreMatches}`);
  } else {
    log(colors.blue, `📊 Email instances found: ${corruption.totalMatches}`);
    if (corruption.dotMatches > 0) {
      log(colors.blue, `   - Dot format: ${corruption.dotMatches}`);
    }
    if (corruption.underscoreMatches > 0) {
      log(colors.blue, `   - Underscore format: ${corruption.underscoreMatches}`);
    }
  }
  
  // Skip if no emails found
  if (corruption.totalMatches === 0) {
    log(colors.green, '✓ No email replacements needed. File is clean.');
    return;
  }
  
  // Validate original JSON
  const originalValidation = validateJson(content);
  if (!originalValidation.valid) {
    log(colors.red, `❌ Error: Original file has invalid JSON structure`);
    log(colors.red, `   ${originalValidation.error}`);
    process.exit(1);
  }
  log(colors.green, '✓ Original JSON structure is valid');
  
  // Create backup
  try {
    const backupPath = createBackup(filePath);
    log(colors.green, `✓ Backup created: ${backupPath}`);
  } catch (error) {
    log(colors.red, `❌ Error creating backup: ${error.message}`);
    process.exit(1);
  }
  
  // Parse and replace emails
  const changes = [];
  const modifiedData = replaceEmailsDeep(originalValidation.data, 'root', changes);
  
  // Report changes
  if (changes.length === 0) {
    log(colors.yellow, '⚠️  No changes made (emails might be in unexpected locations)');
    return;
  }
  
  log(colors.bright + colors.magenta, `\n📝 Changes made (${changes.length} locations):`);
  changes.forEach((change, index) => {
    log(colors.magenta, `\n${index + 1}. ${change.path}`);
    log(colors.magenta, `   Type: ${change.type}`);
    log(colors.magenta, `   Replacements: ${change.count}`);
    if (change.before.length < 80) {
      log(colors.yellow, `   Before: "${change.before}"`);
      log(colors.green, `   After:  "${change.after}"`);
    } else {
      log(colors.yellow, `   (Content too long, showing first 100 chars)`);
    }
  });
  
  // Convert back to JSON string with proper formatting
  let newContent;
  try {
    newContent = JSON.stringify(modifiedData, null, 2);
    log(colors.green, `\n✓ JSON stringified (${newContent.length} bytes)`);
  } catch (error) {
    log(colors.red, `❌ Error stringifying JSON: ${error.message}`);
    process.exit(1);
  }
  
  // Validate modified JSON
  const modifiedValidation = validateJson(newContent);
  if (!modifiedValidation.valid) {
    log(colors.red, `❌ Error: Modified JSON has invalid structure`);
    log(colors.red, `   ${modifiedValidation.error}`);
    log(colors.red, `   Backup preserved at: ${filePath}.bak`);
    process.exit(1);
  }
  log(colors.green, '✓ Modified JSON structure is valid');
  
  // Verify replacements were successful
  const verifyCorruption = detectCorruption(newContent);
  if (verifyCorruption.totalMatches > 0) {
    log(colors.red, `❌ Error: Replacement validation failed`);
    log(colors.red, `   Still found ${verifyCorruption.totalMatches} old email instances`);
    log(colors.red, `   Backup preserved at: ${filePath}.bak`);
    process.exit(1);
  }
  log(colors.green, '✓ All email instances successfully replaced');
  
  // Write the modified content back to file
  try {
    fs.writeFileSync(filePath, newContent, 'utf8');
    log(colors.green, `✓ File written successfully`);
  } catch (error) {
    log(colors.red, `❌ Error writing file: ${error.message}`);
    log(colors.red, `   Backup preserved at: ${filePath}.bak`);
    process.exit(1);
  }
  
  // Final summary
  log(colors.bright + colors.green, `\n✅ SUCCESS!`);
  log(colors.green, `   File: ${filePath}`);
  log(colors.green, `   Emails replaced: ${corruption.totalMatches}`);
  log(colors.green, `   Old: ${OLD_EMAIL_DOT}`);
  log(colors.green, `   New: ${NEW_EMAIL_DOT}`);
  log(colors.green, `   Backup: ${filePath}.bak`);
  
  // Corruption warning in summary
  if (corruption.isCorrupted) {
    log(colors.yellow, `\n⚠️  This file showed signs of corruption (${corruption.totalMatches} repeated emails)`);
    log(colors.yellow, `   Please manually inspect the result to ensure quality.`);
  }
}

/**
 * Main entry point
 */
function main() {
  console.log(colors.bright + colors.blue, '\n🔧 Jigyasu Email Replacement Script\n');
  
  // Check arguments
  if (process.argv.length < 3) {
    log(colors.red, '❌ Error: Missing file path argument');
    console.log('\nUsage:');
    console.log('  node scripts/fix-about-email.js <filepath>');
    console.log('\nExamples:');
    console.log('  node scripts/fix-about-email.js apps/hub/src/learnos/i18n/locales/en.json');
    console.log('  node scripts/fix-about-email.js translation_cache.json');
    process.exit(1);
  }
  
  const filePath = process.argv[2];
  
  // Normalize path
  const normalizedPath = path.resolve(filePath);
  
  // Process the file
  processFile(normalizedPath);
  
  console.log('\n');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { replaceEmailsDeep, detectCorruption, validateJson };

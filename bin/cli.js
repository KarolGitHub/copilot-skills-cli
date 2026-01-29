#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import clipboard from 'clipboardy';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect current project skills
const skillsDir = fs.existsSync(path.join(process.cwd(), '.skills'))
  ? path.join(process.cwd(), '.skills')
  : path.join(__dirname, '..', '.skills');

if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });

const skillFolders = fs
  .readdirSync(skillsDir)
  .filter((f) => fs.statSync(path.join(skillsDir, f)).isDirectory());

if (skillFolders.length === 0) {
  console.log(
    "No skills found in .skills/ folder. Add skills via 'npx skills add <skill>'.",
  );
  process.exit();
}

// 1️⃣ Read current file content if provided
const fileArg = process.argv[2]; // e.g., node cli.js path/to/file.js
let currentContent = '';
if (fileArg && fs.existsSync(fileArg)) {
  currentContent = fs.readFileSync(fileArg, 'utf-8').toLowerCase();
}

// 2️⃣ Build skill objects with keywords
const skills = skillFolders
  .map((folder) => {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;
    const content = fs.readFileSync(skillPath, 'utf-8');
    let keywords = [];
    const lines = content.split('\n');
    if (lines[0].toLowerCase().startsWith('keywords:')) {
      keywords = lines[0]
        .replace('keywords:', '')
        .split(',')
        .map((k) => k.trim().toLowerCase());
    }
    return { name: folder, path: skillPath, content, keywords };
  })
  .filter(Boolean);

// 3️⃣ Rank skills by keyword match
const rankedSkills = skills
  .map((skill) => {
    const matchCount = skill.keywords.reduce((count, kw) => {
      if (currentContent.includes(kw)) return count + 1;
      return count;
    }, 0);
    return { ...skill, matchCount };
  })
  .sort((a, b) => b.matchCount - a.matchCount);

// 4️⃣ Pick the top 5 matches
const topSkills = rankedSkills.filter((s) => s.matchCount > 0).slice(0, 5);

// 5️⃣ Let user choose skill if multiple matches
const choices =
  topSkills.length > 0
    ? topSkills.map((s) => s.name)
    : skills.map((s) => s.name);

inquirer
  .prompt([
    {
      type: 'list',
      name: 'selectedSkill',
      message: 'Select a skill to use:',
      choices,
    },
  ])
  .then(async (answer) => {
    const skill = skills.find((s) => s.name === answer.selectedSkill);
    if (!skill) {
      console.log('Skill not found.');
      return;
    }

    const skillContent = skill.content.replace(/^keywords:.*\n/, '');

    // ✅ Reliable clipboard copy with clipboardy
    try {
      await clipboard.write(skillContent);
      console.log(
        `✅ "${skill.name}" copied to clipboard! Paste into VS Code for Copilot.`,
      );
    } catch (err) {
      console.error('❌ Clipboard failed:', err.message);
      // Fallback: print to console
      console.log('\n--- SKILL CONTENT ---\n' + skillContent + '\n--- END ---');
    }
  })
  .catch((err) => {
    console.error('Prompt failed:', err);
  });

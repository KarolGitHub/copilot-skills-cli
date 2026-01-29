# Copilot Skills Agent 🧠⚡

A lightweight **Node.js CLI agent** that makes GitHub Copilot _skills-aware_ by loading `skills.sh` skills into your project and injecting the right skill instructions into your editor context.

Copilot doesn’t natively understand `skills.sh`.
This tool bridges that gap.

---

## ✨ What This Does

- Reads skills installed via **skills.sh**
- Stores them per-project in `.skills/`
- Analyzes your current file’s code context
- Suggests the most relevant skill automatically
- Copies skill instructions into your clipboard
- Lets **Copilot generate code according to the selected skill**

Think of it as a **manual-but-smart AI agent** that feeds Copilot exactly the context it needs.

---

## 🧠 How It Works (High Level)

1. You install skills using `skills.sh`
2. This CLI scans the `.skills/` directory
3. It parses skill metadata (`SKILL.md`)
4. It matches skill keywords against your current file
5. It suggests the best skill
6. You paste it into VS Code
7. Copilot does the rest 🚀

---

## 📦 Project Structure

```txt
copilot-skills-cli/
├─ bin/
│  └─ cli.js        # CLI entry point
├─ .skills/         # Installed skills live here
├─ package.json
└─ README.md
```

## 🛠 Requirements

Node.js ≥ 18
GitHub Copilot (VS Code)
VS Code CLI (code) recommended
skills.sh CLI

## 🔧 Installation

Clone or copy this project into any repo:

```bash
git clone <your-repo-url>
cd copilot-skills-cli
npm install
```

## 🧩 Installing Skills

Use the official skills.sh CLI:
npx skills add owner/skill-repo

This will populate the .skills/ directory.

Example:
npx skills add lackeyjb/playwright-skill

🧠 Skill Metadata Format

For best results, each skill should include keywords at the top of SKILL.md:

## keywords: react, component, hooks, frontend

Create a React component using hooks and modern patterns.

These keywords are used to match skills against your code context.

▶️ Usage
Basic usage (manual selection)
npm run copilot-skills

Lists available skills
Copies selected skill instructions to clipboard
Context-aware usage (recommended)
npm run copilot-skills path/to/your/file.js

What happens:
Reads your file
Matches keywords against installed skills
Ranks the most relevant skills
Prompts you to confirm
Copies instructions to clipboard
Paste them into VS Code and let Copilot generate code.

🧪 Example Workflow

Open a file in VS Code:

function UserList() {
// TODO
}

Run:

npm run copilot-skills src/UserList.jsx

Select suggested React component skill
Paste instructions at top of file
Trigger Copilot
Profit 💰

Now you can trigger skill suggestions with a single keystroke.

🚀 Why This Exists
Copilot:
Is great at generating code
Has no concept of reusable skills or procedures

skills.sh:
Has reusable skills
Needs an agent to invoke them
This tool connects the two.

⚠️ Limitations

Copilot does not automatically invoke skills
Skills must be injected as editor context
Matching is keyword-based (not embeddings… yet)

🔮 Roadmap
VS Code extension
Automatic skill injection
Embedding-based matching
Skill chaining
Inline preview before injection

🤝 Contributing
PRs welcome.

Ideas:
Better matching heuristics
Skill scoring improvements
Editor integrations
Cross-agent support

🧠 Final Thought

This doesn’t replace Copilot.
It upgrades it.
You’re giving Copilot a memory of how you want things done — once — and reusing it everywhere.
Happy coding 👋

# Project Specification: Comment Hider Python

## Overview
Comment Hider Python is an extension for Visual Studio Code that allows users to visually hide/show comments in Python files, helping them focus solely on functional code. Comments remain in the file without being deleted, but are visually hidden using editor decorations.

## 🎯 Objective
Reduce visual noise in `.py` files by allowing users to temporarily hide comments, improving focus and readability of active code.

## Key Features
- Detects and hides single-line comments (`# comment`) in Python files.
- Detects and hides multi-line comments (`"""""" comment`) in Python files.
- Compatible with VSCode using TypeScript.
- Command accessible via the command palette (Ctrl+Shift+P) to toggle hiding.
- Comments are preserved in the file (only visually hidden).
- Easy to extend to more languages or comment types in the future.

## 🔧 Functional Requirements
### Activation
The extension is activated by executing the "Hide comments in Python" command.

### Deactivation
The extension is activated by executing the "Show comments in Python" command.

### Comment Detection
Detects lines that contain single-line comments starting with `#` or multi-line comments.

### Editor Decoration
Applies a decoration to comment lines with:
- Opacity: 0
- Font size: 0px

### Language Compatibility
Only works in files using the Python language.

## Technical Requirements
- Language: TypeScript
- Runtime Environment: Visual Studio Code
- APIs used: `vscode.TextEditorDecorationType`, `vscode.commands`, `vscode.window`
- Project structure: Generated with `yo code`

## 📁 Project Structure

```bash
comment-hidder-python/
├── .vscode/
├── src/
│   └── extension.ts       ← Main logic
├── package.json           ← Command declarations and configuration
├── tsconfig.json
├── README.md
└── ...other VSCode extension files
```

## 📜 Regex used to find comments:
`/^(\s*)#.*$/gm` for single-line comments
`/("""[\s\S]*?"""|'''[\s\S]*?''')/g` for multi-line comments

## 🧪 Test Cases (Manual)
| Scenario | Expected Result |
|----------|-----------------|
| .py file with comments | Comments disappear visually |
| File without comments | Nothing happens |
| Non-Python file (.js) | Warning is shown and nothing happens |
| Run command twice | Comments remain hidden (for now) |
| Inline comments (x = 1 # note) | (Not hidden in this basic version) |

## 🔮 Possible Future Improvements
- Toggle visibility (show/hide).
- Support for inline comments (x = 1 # comment).
- Compatibility with other languages.
- Opacity and style settings configurable via `settings.json`.
- Auto-run command when opening Python files.
"""
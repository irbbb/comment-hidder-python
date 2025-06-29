# Comment Hider Python

A Visual Studio Code extension that allows you to visually hide/show comments in Python files, helping you focus solely on functional code.

## Features

- Hide single-line comments (`# comment`) in Python files
- Hide multi-line comments (`"""comment"""` or `'''comment'''`) in Python files
- Comments remain in the file (only visually hidden)
- Easy to toggle visibility with commands

## Usage

1. Open a Python file
2. Open the Command Palette (Ctrl+Shift+P)
3. Run "Hide comments in Python" to hide comments
4. Run "Show comments in Python" to show comments again

## Requirements

- Visual Studio Code 1.60.0 or higher

## Extension Settings

This extension doesn't contribute any settings yet.

## Known Issues

- Inline comments (e.g., `x = 1 # note`) are not hidden in this version


---

## Development

### Building the Extension

```bash
npm install
npm run compile
```

## License

This extension is licensed under the [MIT License](LICENSE.md).

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

### Running Tests

```bash
npm test
```

### Trying the Extension in Development

To test the extension in a development environment:

1. Open the project in Visual Studio Code
2. Press `F5` to launch a new Extension Development Host window
3. In the new window, open a Python file
4. Open the Command Palette (`Ctrl+Shift+P` or `F1`)
5. Type "Hide comments in Python" and select the command
6. To show comments again, use the Command Palette and select "Show comments in Python"

Alternatively, you can run the extension from the terminal:

```bash
code --extensionDevelopmentPath=C:\path\to\comment-hider-python
```

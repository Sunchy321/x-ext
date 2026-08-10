# xlang — X language syntax highlighting

Provides VS Code syntax highlighting for the X language (TextMate grammar, `source.x`). Supports `.x`, `.xs`, `.xd` files.

## Features

- Keywords, types, and modifiers highlighted (kept in sync with the spec, incl. `linear`, `defer`, etc.)
- Literals: integer / float / string / char / boolean / name literals `\name`
- Lifetimes `'a` / `'_` and reference types `T 'a &`
- Comments, operators, string interpolation `\(e)`, loop labels `'label`

## Install

This is a local extension, not published to the VS Code Marketplace. Choose one:

### Option 1: Package as VSIX (recommended)

```sh
cd ext
npx @vscode/vsce package        # produces xlang-0.0.2.vsix
```

Then in VS Code: Extensions panel → `...` menu → **Install from VSIX…** → select the generated `.vsix`. Reload the window.

### Option 2: Development mode

Open the `ext` folder in VS Code and press `F5` to launch an Extension Development Host window; open a `.x` file there to see the highlighting.

### Option 3: Manual copy

Copy the `ext` folder to your extensions directory and rename it:

```sh
cp -r ext ~/.vscode/extensions/xlang
```

Restart VS Code. Extensions directory location:
- macOS / Linux: `~/.vscode/extensions/`
- Windows: `%USERPROFILE%\.vscode\extensions\`

## Development notes

- Grammar file: `syntaxes/x.tmLanguage.json` (TextMate grammar, kept in sync with the `docs/` spec)
- Language configuration: `language-configuration.json` (comments, bracket pairing)
- Run `vsce package` before shipping to validate the grammar JSON.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

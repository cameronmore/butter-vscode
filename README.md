# Butter VS Code

This is a VS Code extension for the Butter language.

It currently provides:

- syntax highlighting for `.butter` files
- comment handling for `//` and `/* ... */`
- bracket matching and auto-closing pairs
- starter snippets for `import(...)`, `fn`, `pub fn`, and `error`
- a local language client that starts the Butter language server from the sibling `lsp` directory

## Current File Extension

- `.butter`

## LSP Notes

The extension looks for:

- the Bun executable from the `butter.bunPath` setting
- the analyzer binary from the `butter.analyzerPath` setting


# alcatel-language-support README

This extension provides language support for Alcatel-Lucent switch configurations, including syntax highlighting, autocomplete functionality, hover documentation, and an integrated command reference.

## Features

* **Syntax Highlighting**: Custom syntax highlighting for Alcatel config files, with special colorization for enable (green) and disable (red) keywords
* **Auto-completion**: Context-aware command completion based on the current command structure
* **Hover Information**: Shows information about commands when hovering over them
* **Command Reference**: Integrated reference for Alcatel switch commands

![Syntax Highlighting Example](images/syntax-highlight-example.png)

## Requirements

No special requirements or dependencies.

## Extension Settings

This extension currently doesn't add any configurable settings.

## Known Issues

None reported yet.

## Release Notes

### 1.0.0

Initial release with syntax highlighting, autocomplete, and hover documentation.
- Custom green highlighting for "enable" keywords
- Custom red highlighting for "disable" keywords

---

## Working with Alcatel Configuration Files

* Files with extensions `.ale` or `.alcatel` will automatically be recognized
* Comments begin with `!` character
* Context-aware autocompletion will suggest valid command options

**Enjoy!**

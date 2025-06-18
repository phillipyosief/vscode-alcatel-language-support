import * as vscode from 'vscode';
import * as commandMap from './commands-context.json';

interface CommandEntry {
  pattern: string;
  options: string[];
}

interface CommandMap {
  [key: string]: CommandEntry;
}

export class AlcatelHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    // Get both the current word and any potential hyphenated word at the cursor position
    const wordRange = document.getWordRangeAtPosition(position);
    const word = document.getText(wordRange);
    
    // Try to get a hyphenated word (might span multiple "words" in VS Code's definition)
    const lineText = document.lineAt(position.line).text;
    const hyphenatedWordMatch = this.getHyphenatedWordAt(lineText, position.character);
    
    const map = commandMap as CommandMap;

    // First check if the hyphenated word matches a command
    if (hyphenatedWordMatch) {
      for (const [cmd, config] of Object.entries(map)) {
        if (cmd === hyphenatedWordMatch || cmd.includes(hyphenatedWordMatch)) {
          const markdown = new vscode.MarkdownString();
          markdown.appendCodeblock(cmd, 'alcatel');
          markdown.appendMarkdown(`\n\n**Options:**\n`);
          markdown.appendMarkdown(config.options.map((o) => `- \`${o}\``).join('\n'));
          return new vscode.Hover(markdown);
        }
        
        // Check if it matches any option in the config
        if (config.options.includes(hyphenatedWordMatch)) {
          const markdown = new vscode.MarkdownString();
          markdown.appendCodeblock(hyphenatedWordMatch, 'alcatel');
          markdown.appendMarkdown(`\n\n**Command parameter for:** \`${cmd}\``);
          return new vscode.Hover(markdown);
        }
      }
    }
    
    // If no match found with hyphenated word, try the regular word
    for (const [cmd, config] of Object.entries(map)) {
      if (cmd.includes(word)) {
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(cmd, 'alcatel');
        markdown.appendMarkdown(`\n\n**Options:**\n`);
        markdown.appendMarkdown(config.options.map((o) => `- \`${o}\``).join('\n'));
        return new vscode.Hover(markdown);
      }
    }

    return undefined;
  }
  
  private getHyphenatedWordAt(lineText: string, position: number): string | undefined {
    // Find word boundaries considering hyphens as part of the word
    let start = position;
    while (start > 0 && /[a-zA-Z0-9-]/.test(lineText[start - 1])) {
      start--;
    }
    
    let end = position;
    while (end < lineText.length && /[a-zA-Z0-9-]/.test(lineText[end])) {
      end++;
    }
    
    const word = lineText.substring(start, end);
    
    // Only return if it contains a hyphen
    return word.includes('-') ? word : undefined;
  }
}

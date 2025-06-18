import * as vscode from 'vscode';
import * as commandMap from './commands-context.json';

interface CommandStructure {
  [key: string]: {
    pattern: string;
    options: string[];
  };
}

export function getAlcatelCompletions(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
  const completions: vscode.CompletionItem[] = [];
  const line = document.lineAt(position).text.substring(0, position.character).trim();
  
  console.log('Processing completions for line:', line);
  
  const map: CommandStructure = commandMap as any;

  // Check for context matches
  for (const [cmd, config] of Object.entries(map)) {
    try {
      if (!config.pattern) {
        continue; // Skip entries with empty patterns
      }
      
      const regex = new RegExp(config.pattern);
      if (regex.test(line)) {
        console.log(`Matched pattern for '${cmd}':`, config.pattern);
        
        for (const opt of config.options) {
          const item = new vscode.CompletionItem(opt, vscode.CompletionItemKind.Property);
          item.detail = `Option for '${cmd}'`;
          item.insertText = opt;
          
          // Mark hyphenated words as single units
          if (opt.includes('-')) {
            item.kind = vscode.CompletionItemKind.Keyword;
            item.detail = `Hyphenated command for '${cmd}'`;
          }
          
          completions.push(item);
        }
        return completions;
      }
    } catch (error) {
      console.error(`Error matching pattern for '${cmd}':`, error);
    }
  }

  // If we're at the beginning of a line or after spacing, provide top-level commands
  if (line === '' || /^\s+$/.test(line)) {
    console.log('Providing top-level commands');
    const topLevelCommands = [
      'vlan', 'interface', 'ip', 'route', 'spanning-tree', 
      'lldp', 'system', 'auto-fabric', 'aaa', 'qos', 
      'session', 'policy', 'interfaces', 'mvrp', 'lanpower'
    ];
    
    for (const cmd of topLevelCommands) {
      const item = new vscode.CompletionItem(cmd, vscode.CompletionItemKind.Keyword);
      item.detail = 'Top-level command';
      item.insertText = cmd;
      completions.push(item);
    }
  } else {
    // Check if we're typing a partial hyphenated word
    const words = line.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    const isPartialHyphenated = lastWord.includes('-') && !lastWord.endsWith(' ');
    
    // Provide context-based suggestions
    const wordPrefix = isPartialHyphenated ? lastWord : (line.split(/\s+/).pop() || '');
    console.log('Looking for commands starting with:', wordPrefix);
    
    for (const base of Object.keys(map)) {
      if (base.startsWith(wordPrefix)) {
        const item = new vscode.CompletionItem(base, vscode.CompletionItemKind.Keyword);
        item.detail = 'Command';
        item.insertText = base;
        completions.push(item);
      }
    }
    
    // Also suggest hyphenated parameters that match
    for (const [cmd, config] of Object.entries(map)) {
      for (const opt of config.options) {
        if (opt.includes('-') && opt.startsWith(wordPrefix)) {
          const item = new vscode.CompletionItem(opt, vscode.CompletionItemKind.Keyword);
          item.detail = `Hyphenated command for '${cmd}'`;
          item.insertText = opt;
          completions.push(item);
        }
      }
    }
  }

  return completions;
}

import * as vscode from 'vscode';
import { getAlcatelCompletions } from './completion/alcatelCompletions';
import { AlcatelHoverProvider } from './completion/alcatelHoverProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Alcatel Language Support extension is now active');
  
  const provider = vscode.languages.registerCompletionItemProvider(
    { language: 'alcatel' },
    {
      provideCompletionItems(document, position) {
        console.log('Providing completions for position:', position);
        return getAlcatelCompletions(document, position);
      }
    },
    ' ', // After space
    '-', // After hyphen
    '\n' // After newline
  );

  context.subscriptions.push(provider);

  context.subscriptions.push(
    vscode.languages.registerHoverProvider({ language: 'alcatel' }, new AlcatelHoverProvider())
  );

  // Register a status bar item to confirm extension is active
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(symbol-keyword) Alcatel Support";
  statusBarItem.tooltip = "Alcatel Language Support is active";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

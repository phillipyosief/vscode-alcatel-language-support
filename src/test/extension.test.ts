import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
	
	// New test for completion functionality
	test('Extension activation', async () => {
		const extension = vscode.extensions.getExtension('alcatel-language-support');
		assert.ok(extension, 'Extension should be available');
		
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		assert.ok(extension?.isActive, 'Extension should be activated');
	});
});

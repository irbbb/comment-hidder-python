import * as vscode from 'vscode';
import { CommentDetectionService } from './services/CommentDetectionService';
import { CommentDecoratorService } from './services/CommentDecoratorService';
import { CommentHiderController } from './controllers/CommentHiderController';

/**
 * Activates the extension
 * @param context - The extension context
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Comment Hider Python is now active');

  // Create services following Dependency Injection principle
  const detectionService = new CommentDetectionService();
  const decoratorService = new CommentDecoratorService();
  const controller = new CommentHiderController(detectionService, decoratorService);

  // Register commands
  const hideCommentsCommand = vscode.commands.registerCommand(
    'comment-hider-python.hideComments',
    () => controller.hideComments()
  );

  const showCommentsCommand = vscode.commands.registerCommand(
    'comment-hider-python.showComments',
    () => controller.showComments()
  );

  // Add disposables to context
  context.subscriptions.push(
    hideCommentsCommand,
    showCommentsCommand,
    {
      dispose: () => controller.dispose()
    }
  );
}

/**
 * Deactivates the extension
 */
export function deactivate(): void {
  console.log('Comment Hider Python is now deactivated');
}

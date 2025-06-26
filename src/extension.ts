import * as vscode from 'vscode';
import { CommentDetectionService } from './services/CommentDetectionService';
import { CommentDecoratorService } from './services/CommentDecoratorService';
import { CommentHiderController } from './controllers/CommentHiderController';

export function activate(context: vscode.ExtensionContext): void {
  console.log('Comment Hider Python is now active');

  const detectionService = new CommentDetectionService();
  const decoratorService = new CommentDecoratorService();
  const controller = new CommentHiderController(detectionService, decoratorService);

  const hideCommentsCommand = vscode.commands.registerCommand(
    'comment-hider-python.hideComments',
    () => controller.hideComments()
  );

  const showCommentsCommand = vscode.commands.registerCommand(
    'comment-hider-python.showComments',
    () => controller.showComments()
  );

  context.subscriptions.push(
    hideCommentsCommand,
    showCommentsCommand,
    {
      dispose: () => controller.dispose()
    }
  );
}

export function deactivate(): void {
  console.log('Comment Hider Python is now deactivated');
}

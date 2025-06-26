import * as vscode from 'vscode';
import { CommentDetectionService } from '../services/CommentDetectionService';
import { CommentDecoratorService } from '../services/CommentDecoratorService';

/**
 * Main extension controller that coordinates the services
 * Following Dependency Inversion principle by depending on abstractions
 */
export class CommentHiderController {
  private detectionService: CommentDetectionService;
  private decoratorService: CommentDecoratorService;

  constructor(
    detectionService: CommentDetectionService,
    decoratorService: CommentDecoratorService
  ) {
    this.detectionService = detectionService;
    this.decoratorService = decoratorService;
  }

  /**
   * Hides all comments in the active editor
   */
  public hideComments(): void {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    if (editor.document.languageId !== 'python') {
      vscode.window.showWarningMessage('This extension only works with Python files');
      return;
    }

    const documentText = editor.document.getText();
    const singleLineCommentRanges = this.detectionService.detectSingleLineComments(documentText);
    const multiLineCommentRanges = this.detectionService.detectMultiLineComments(documentText);

    // Apply decorations to hide comments
    this.decoratorService.hideComments(editor, [...singleLineCommentRanges, ...multiLineCommentRanges]);
    
    // For multiline comments, we need to fold the text to completely hide the lines
    if (multiLineCommentRanges.length > 0) {
      // Use the editor's folding capabilities to hide multiline comment lines
      vscode.commands.executeCommand('editor.fold', {
        selectionLines: multiLineCommentRanges.map(range => range.start.line)
      });
    }
  }

  /**
   * Shows all comments in the active editor
   */
  public showComments(): void {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    // Remove decorations
    this.decoratorService.showComments(editor);
    
    // Unfold any folded regions
    vscode.commands.executeCommand('editor.unfoldAll');
  }

  /**
   * Disposes resources when extension is deactivated
   */
  public dispose(): void {
    this.decoratorService.dispose();
  }
}

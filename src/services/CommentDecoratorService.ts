import * as vscode from 'vscode';

/**
 * Decorator service responsible for applying visual decorations to hide comments
 * Following Open/Closed principle by allowing extension for different decoration types
 */
export class CommentDecoratorService {
  private decorationType: vscode.TextEditorDecorationType;

  constructor() {
    this.decorationType = vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      after: {
        contentText: ''
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
    });
  }

  /**
   * Applies decorations to hide comments
   * @param editor - The active text editor
   * @param ranges - The ranges to apply decorations to
   */
  public hideComments(editor: vscode.TextEditor, ranges: vscode.Range[]): void {
    editor.setDecorations(this.decorationType, ranges);
  }

  /**
   * Removes all decorations to show comments
   * @param editor - The active text editor
   */
  public showComments(editor: vscode.TextEditor): void {
    editor.setDecorations(this.decorationType, []);
  }

  /**
   * Disposes the decoration type when extension is deactivated
   */
  public dispose(): void {
    this.decorationType.dispose();
  }
}

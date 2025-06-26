import * as vscode from 'vscode';

/**
 * Comment detection service responsible for finding Python comments in text
 */
export class CommentDetectionService {
  /**
   * Detects single-line Python comments
   * @param text - The text to search for comments
   * @returns An array of ranges where single-line comments are found
   */
  public detectSingleLineComments(text: string): vscode.Range[] {
    const commentRanges: vscode.Range[] = [];
    const regex = /^(\s*)#.*$/gm;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const startPos = new vscode.Position(
        text.substring(0, match.index).split('\n').length - 1,
        match.index - text.lastIndexOf('\n', match.index) - 1
      );

      const endPos = new vscode.Position(
        startPos.line,
        startPos.character + match[0].length
      );

      commentRanges.push(new vscode.Range(startPos, endPos));
    }

    return commentRanges;
  }

  /**
   * Detects multi-line Python comments (docstrings)
   * @param text - The text to search for multi-line comments
   * @returns An array of ranges where multi-line comments are found
   */
  public detectMultiLineComments(text: string): vscode.Range[] {
    const commentRanges: vscode.Range[] = [];
    const regex = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const startPosLine = text.substring(0, match.index).split('\n').length - 1;
      const startPosChar = match.index - text.lastIndexOf('\n', match.index) - 1;

      const matchContent = match[0];
      const lineCount = matchContent.split('\n').length - 1;
      const lastLineLength = matchContent.substring(matchContent.lastIndexOf('\n') + 1).length;

      const endPosLine = startPosLine + lineCount;
      const endPosChar = lineCount === 0 ? startPosChar + matchContent.length : lastLineLength;

      commentRanges.push(new vscode.Range(
        new vscode.Position(startPosLine, startPosChar),
        new vscode.Position(endPosLine, endPosChar)
      ));
    }

    return commentRanges;
  }
}

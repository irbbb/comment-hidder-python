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
    
    // Find all potential triple-quoted strings
    const regex = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;
    
    // Process the document line by line to check context
    const lines = text.split('\n');
    let inFunction = false;
    let inClass = false;
    let indentLevel = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're entering a function or class definition
      if (/^\s*(def|class)\s+\w+/.test(line)) {
        const match = line.match(/^(\s*)/);
        indentLevel = match ? match[1].length : 0;
        
        if (line.trim().startsWith('def')) {
          inFunction = true;
        } else if (line.trim().startsWith('class')) {
          inClass = true;
        }
      }
      
      // Check if the current line has less indentation than the function/class
      // which would mean we've exited the function or class
      if ((inFunction || inClass) && line.trim() !== '') {
        const match = line.match(/^(\s*)/);
        const currentIndent = match ? match[1].length : 0;
        
        if (currentIndent <= indentLevel && !/^\s*(def|class)/.test(line)) {
          inFunction = false;
          inClass = false;
        }
      }
    }
    
    // Now find all triple-quoted strings
    let match;
    while ((match = regex.exec(text)) !== null) {
      const startPosLine = text.substring(0, match.index).split('\n').length - 1;
      const startPosChar = match.index - text.lastIndexOf('\n', match.index) - 1;
      
      const matchContent = match[0];
      const lineCount = matchContent.split('\n').length - 1;
      const lastLineLength = matchContent.substring(matchContent.lastIndexOf('\n') + 1).length;
      
      const endPosLine = startPosLine + lineCount;
      const endPosChar = lineCount === 0 ? startPosChar + matchContent.length : lastLineLength;
      
      // Check if this is likely a docstring or a multiline string/f-string
      const lineBeforeMatch = startPosLine > 0 ? lines[startPosLine - 1] : '';
      const currentLine = lines[startPosLine];
      const isAssignment = /=\s*$/.test(lineBeforeMatch) || /=\s*f?['"]/.test(currentLine);
      const isVariableDefinition = /^\s*\w+\s*=\s*f?['"]/.test(currentLine);
      const isFString = /f("""|''')/.test(currentLine);
      
      // Only consider it a comment if:
      // 1. It's at the beginning of a function/class (docstring)
      // 2. It's a standalone triple-quoted string not part of an assignment
      // 3. It's not an f-string
      if (!isAssignment && !isVariableDefinition && !isFString) {
        commentRanges.push(new vscode.Range(
          new vscode.Position(startPosLine, startPosChar),
          new vscode.Position(endPosLine, endPosChar)
        ));
      }
    }
    
    return commentRanges;
  }
}

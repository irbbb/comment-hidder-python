import * as vscode from 'vscode';

/**
 * Comment detection service responsible for finding Python comments in text
 * Based on the official Python grammar (python.gram)
 */
export class CommentDetectionService {
  /**
   * Detects single-line Python comments
   * @param text - The text to search for comments
   * @returns An array of ranges where single-line comments are found
   */
  public detectSingleLineComments(text: string): vscode.Range[] {
    const commentRanges: vscode.Range[] = [];
    // Python grammar defines comments as lines starting with #
    const regex = /^(\s*)#.*$/gm;
    let match;

    // First detect multiline comments to avoid parsing nested comments
    const multilineCommentRanges = this.findMultilineCommentRanges(text);

    while ((match = regex.exec(text)) !== null) {
      const startPos = new vscode.Position(
        text.substring(0, match.index).split('\n').length - 1,
        match.index - text.lastIndexOf('\n', match.index) - 1
      );

      const endPos = new vscode.Position(
        startPos.line,
        startPos.character + match[0].length
      );

      // Skip this comment if it's inside a multiline comment
      if (!this.isInsideMultilineComment(startPos.line, multilineCommentRanges)) {
        commentRanges.push(new vscode.Range(startPos, endPos));
      }
    }

    return commentRanges;
  }

  /**
   * Detects multi-line Python comments (docstrings)
   * According to the Python grammar, these are string literals that can be used as comments
   * @param text - The text to search for multi-line comments
   * @returns An array of ranges where multi-line comments are found
   */
  public detectMultiLineComments(text: string): vscode.Range[] {
    return this.findMultilineCommentRanges(text);
  }

  /**
   * Helper method to find multiline comment ranges
   * This is used by both detectMultiLineComments and detectSingleLineComments
   * to avoid parsing nested comments
   */
  private findMultilineCommentRanges(text: string): vscode.Range[] {
    const commentRanges: vscode.Range[] = [];
    const lines = text.split('\n');

    // Based on Python grammar, we need to find triple-quoted strings
    // that are not part of expressions (standalone docstrings)
    const tripleQuoteRegex = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;

    // Track string literals to avoid false positives
    const stringLiteralContexts = this.findStringLiteralContexts(text);

    // Find all potential docstrings
    let match;
    while ((match = tripleQuoteRegex.exec(text)) !== null) {
      // Skip if this match is inside a string literal context
      if (this.isInsideStringLiteral(match.index, match[0].length, stringLiteralContexts)) {
        continue;
      }

      const startPosLine = text.substring(0, match.index).split('\n').length - 1;
      const startPosChar = match.index - text.lastIndexOf('\n', match.index) - 1;

      const matchContent = match[0];
      const lineCount = matchContent.split('\n').length - 1;
      const lastLineLength = matchContent.substring(matchContent.lastIndexOf('\n') + 1).length;

      const endPosLine = startPosLine + lineCount;
      const endPosChar = lineCount === 0 ? startPosChar + matchContent.length : lastLineLength;

      // Check if this is a docstring by examining context
      const currentLine = lines[startPosLine];
      const prevLine = startPosLine > 0 ? lines[startPosLine - 1] : '';

      // Check for f-strings, t-strings, and other non-comment string contexts
      const isFString = /f("""|''')/.test(currentLine);
      const isTString = /t("""|''')/.test(currentLine);
      const isAssignment = /=\s*$/.test(prevLine) || /=\s*[frt]?['"]/.test(currentLine);
      const isVariableDefinition = /^\s*\w+\s*=\s*[frt]?['"]/.test(currentLine);

      // Check if it's a module/class/function docstring
      const isModuleDocstring = startPosLine === 0 ||
                               (startPosLine <= 2 && lines.slice(0, startPosLine)
                               .every(l => l.trim() === '' || l.trim().startsWith('#')));
      const isClassOrFuncDocstring = /^\s*(class|def)\s+\w+.*:\s*$/.test(prevLine);

      // Only consider it a comment if it's a proper docstring or standalone triple-quoted string
      if ((!isFString && !isTString && !isAssignment && !isVariableDefinition) ||
          isModuleDocstring || isClassOrFuncDocstring) {
        commentRanges.push(new vscode.Range(
          new vscode.Position(startPosLine, startPosChar),
          new vscode.Position(endPosLine, endPosChar)
        ));
      }
    }

    return commentRanges;
  }

  /**
   * Find all string literal contexts to avoid false positives
   * @param text - The document text
   * @returns Array of [start, end] indices for string literals
   */
  private findStringLiteralContexts(text: string): [number, number][] {
    const contexts: [number, number][] = [];

    // Find all string literals that are part of expressions
    // This includes strings in assignments, function calls, etc.
    const stringAssignmentRegex = /^\s*\w+\s*=\s*([frt]?["'])/gm;
    let match;

    while ((match = stringAssignmentRegex.exec(text)) !== null) {
      const quoteChar = match[1].slice(-1); // Get the quote character (' or ")
      const startIdx = match.index + match[0].length - 1;

      // Find the end of this string
      let endIdx = this.findMatchingQuote(text, startIdx, quoteChar);
      if (endIdx > startIdx) {
        contexts.push([startIdx, endIdx]);
      }
    }

    // Find strings in function calls, lists, etc.
    const stringInExprRegex = /[=,\[\(]\s*([frt]?["'])/g;
    while ((match = stringInExprRegex.exec(text)) !== null) {
      const quoteChar = match[1].slice(-1);
      const startIdx = match.index + match[0].length - 1;

      let endIdx = this.findMatchingQuote(text, startIdx, quoteChar);
      if (endIdx > startIdx) {
        contexts.push([startIdx, endIdx]);
      }
    }

    return contexts;
  }

  /**
   * Find the matching closing quote for a string
   * @param text - The document text
   * @param startIdx - Starting index of the quote
   * @param quoteChar - The quote character (' or ")
   * @returns The index of the matching quote or -1 if not found
   */
  private findMatchingQuote(text: string, startIdx: number, quoteChar: string): number {
    // Check if it's a triple quote
    const isTriple = text.substring(startIdx, startIdx + 3) === quoteChar.repeat(3);
    const searchTarget = isTriple ? quoteChar.repeat(3) : quoteChar;

    // Start searching after the opening quote
    const searchStartIdx = startIdx + searchTarget.length;

    // For triple quotes, we need to find the matching triple quote
    // For single quotes, we need to find the matching single quote that's not escaped
    if (isTriple) {
      const endIdx = text.indexOf(searchTarget, searchStartIdx);
      return endIdx !== -1 ? endIdx + searchTarget.length - 1 : -1;
    } else {
      // For single quotes, we need to handle escaping
      for (let i = searchStartIdx; i < text.length; i++) {
        if (text[i] === quoteChar && text[i-1] !== '\\') {
          return i;
        }
      }
      return -1;
    }
  }

  /**
   * Check if a position is inside a string literal context
   * @param position - The position to check
   * @param length - The length of the match
   * @param contexts - Array of string literal contexts
   * @returns True if the position is inside a string literal
   */
  private isInsideStringLiteral(position: number, length: number, contexts: [number, number][]): boolean {
    const end = position + length - 1;

    for (const [start, contextEnd] of contexts) {
      // If our match is completely inside a string literal context, it's not a docstring
      if (position > start && end < contextEnd) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a line is inside a multiline comment
   * @param line - The line number to check
   * @param multilineCommentRanges - Array of multiline comment ranges
   * @returns True if the line is inside a multiline comment
   */
  private isInsideMultilineComment(line: number, multilineCommentRanges: vscode.Range[]): boolean {
    for (const range of multilineCommentRanges) {
      if (line >= range.start.line && line <= range.end.line) {
        return true;
      }
    }
    return false;
  }
}

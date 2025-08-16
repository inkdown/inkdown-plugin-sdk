export interface EditorPosition {
  line: number;
  column: number;
}

export interface EditorRange {
  start: EditorPosition;
  end: EditorPosition;
}

export interface EditorSelection {
  range: EditorRange;
  text: string;
}

export interface EditorAPI {
  // Content Management
  getContent(): string;
  setContent(content: string): void;
  insertText(text: string, position?: EditorPosition): void;
  replaceText(range: EditorRange, text: string): void;
  
  // Selection
  getSelection(): EditorSelection | null;
  setSelection(range: EditorRange): void;
  selectAll(): void;
  
  // Cursor
  getCursor(): EditorPosition;
  setCursor(position: EditorPosition): void;
  
  // Search & Replace
  find(query: string, options?: { caseSensitive?: boolean; wholeWord?: boolean; regex?: boolean }): EditorRange[];
  replace(query: string, replacement: string, options?: { caseSensitive?: boolean; wholeWord?: boolean; regex?: boolean }): number;
  
  // Events
  onChange(callback: (content: string) => void): () => void;
  onSelectionChange(callback: (selection: EditorSelection | null) => void): () => void;
  onCursorChange(callback: (position: EditorPosition) => void): () => void;
  
  // Focus
  focus(): void;
  blur(): void;
  isFocused(): boolean;
  
  // Undo/Redo
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  
  // Line Operations
  getLine(lineNumber: number): string;
  getLineCount(): number;
  insertLine(lineNumber: number, text: string): void;
  deleteLine(lineNumber: number): void;
  
  // Formatting
  bold(): void;
  italic(): void;
  strikethrough(): void;
  code(): void;
  link(url?: string): void;
  heading(level: 1 | 2 | 3 | 4 | 5 | 6): void;
  blockquote(): void;
  unorderedList(): void;
  orderedList(): void;
  
  // View
  scrollToLine(lineNumber: number): void;
  scrollToCursor(): void;
  getVisibleRange(): EditorRange;
}
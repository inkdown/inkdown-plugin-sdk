import { 
  AppState, 
  AppEvent, 
  EventListener, 
  Command, 
  MenuItem, 
  PluginSettings,
  StatusBarItem,
  SettingsTab,
  EditorExtension
} from '../types/core';

export interface AppAPI {
  // State Management
  readonly state: AppState;
  
  // Event System
  on<T extends AppEvent>(eventType: T['type'], listener: EventListener<T>): () => void;
  off<T extends AppEvent>(eventType: T['type'], listener: EventListener<T>): void;
  emit(event: AppEvent): void;
  
  // Commands
  addCommand(command: Command): () => void;
  removeCommand(commandId: string): void;
  executeCommand(commandId: string): Promise<void>;
  
  // Menu System
  addMenuItem(location: 'context' | 'main' | 'editor', item: MenuItem): () => void;
  removeMenuItem(itemId: string): void;
  
  // Settings
  loadSettings<T extends PluginSettings>(pluginId: string): Promise<T>;
  saveSettings<T extends PluginSettings>(pluginId: string, settings: T): Promise<void>;
  
  // UI Components
  addSettingsTab(tab: SettingsTab): () => void;
  addStatusBarItem(item: StatusBarItem): () => void;
  removeStatusBarItem(itemId: string): void;
  
  // Editor Extensions
  addEditorExtension(extension: EditorExtension): () => void;
  removeEditorExtension(extensionId: string): void;
  
  // File Operations
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  createFile(path: string, content?: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  
  // Notifications
  showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void;
  showToast(message: string, duration?: number): void;
  
  // Dialogs
  showConfirm(title: string, message: string): Promise<boolean>;
  showPrompt(title: string, message: string, defaultValue?: string): Promise<string | null>;
  
  // Utilities
  openExternal(url: string): Promise<void>;
  copyToClipboard(text: string): Promise<void>;
  readFromClipboard(): Promise<string>;
}
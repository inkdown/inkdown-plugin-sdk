import type { EditorAPI } from "../api/editor";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  minAppVersion: string;
  main: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  permissions?: PluginPermission[];
}

export interface PluginPermission {
  type: 'files' | 'network' | 'clipboard' | 'notifications' | 'storage';
  description: string;
  optional?: boolean;
}

// Plugin Lifecycle
export interface Plugin {
  manifest: PluginManifest;
  onLoad(): Promise<void> | void;
  onUnload(): Promise<void> | void;
  onEnable?(): Promise<void> | void;
  onDisable?(): Promise<void> | void;
}

// App State
export interface AppState {
  readonly activeFile: FileInfo | null;
  readonly workspace: WorkspaceInfo;
  readonly settings: AppSettings;
  readonly theme: ThemeInfo;
}

export interface FileInfo {
  readonly path: string;
  readonly name: string;
  readonly extension: string;
  readonly size: number;
  readonly modified: Date;
  readonly content: string;
}

export interface WorkspaceInfo {
  readonly path: string;
  readonly name: string;
  readonly files: FileInfo[];
}

export interface AppSettings {
  readonly vimMode: boolean;
  readonly showLineNumbers: boolean;
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly theme: 'light' | 'dark' | 'auto';
}

export interface ThemeInfo {
  readonly mode: 'light' | 'dark';
  readonly colors: Record<string, string>;
}

// Events
export type AppEvent = 
  | { type: 'file:open'; file: FileInfo }
  | { type: 'file:save'; file: FileInfo }
  | { type: 'file:close'; file: FileInfo }
  | { type: 'file:change'; file: FileInfo; content: string }
  | { type: 'workspace:change'; workspace: WorkspaceInfo }
  | { type: 'theme:change'; theme: ThemeInfo }
  | { type: 'settings:change'; settings: AppSettings };

export type EventListener<T extends AppEvent = AppEvent> = (event: T) => void;

// Commands
export interface Command {
  id: string;
  name: string;
  description?: string;
  category?: string;
  hotkey?: string;
  icon?: string;
  execute(): Promise<void> | void;
  condition?(): boolean;
}

// Menu Items
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  submenu?: MenuItem[];
  separator?: boolean;
  onClick?(): void;
  condition?(): boolean;
}

// Settings Schema
export interface PluginSettings {
  [key: string]: any;
}

export type SettingType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'dropdown' 
  | 'slider' 
  | 'textarea' 
  | 'password' 
  | 'color' 
  | 'file' 
  | 'folder';

export interface BaseSetting {
  key: string;
  name: string;
  description?: string;
  type: SettingType;
  defaultValue: any;
}

export interface TextSetting extends BaseSetting {
  type: 'text' | 'password';
  placeholder?: string;
  maxLength?: number;
}

export interface NumberSetting extends BaseSetting {
  type: 'number' | 'slider';
  min?: number;
  max?: number;
  step?: number;
}

export interface BooleanSetting extends BaseSetting {
  type: 'boolean';
}

export interface DropdownSetting extends BaseSetting {
  type: 'dropdown';
  options: Array<{ value: string; label: string }>;
}

export interface TextareaSetting extends BaseSetting {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

export interface ColorSetting extends BaseSetting {
  type: 'color';
}

export interface FileSetting extends BaseSetting {
  type: 'file' | 'folder';
  extensions?: string[];
}

export type SettingDefinition = 
  | TextSetting 
  | NumberSetting 
  | BooleanSetting 
  | DropdownSetting 
  | TextareaSetting 
  | ColorSetting 
  | FileSetting;

export interface SettingGroup {
  id: string;
  name: string;
  description?: string;
  collapsible?: boolean;
  settings: SettingDefinition[];
}

export interface PluginSettingsConfig {
  groups: SettingGroup[];
}

export interface StatusBarItem {
  id: string;
  text: string;
  tooltip?: string;
  priority?: number;
  onClick?(): void;
}

// Editor Extensions
export interface EditorExtension {
  id: string;
  name: string;
  activate(editor: EditorAPI): void;
  deactivate?(): void;
}
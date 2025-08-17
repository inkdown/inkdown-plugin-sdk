declare module 'inkdown-plugin-api' {
  export interface App {
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string | ArrayBuffer | Uint8Array): Promise<void>;
    createFile(path: string, content?: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    
    getActiveFile(): Promise<TFile | null>;
    
    markdownToHTML(markdown: string, options?: any): Promise<string>;
    parseMarkdownFile(filePath: string, options?: any): Promise<string>;
    
    loadSettings(pluginId: string): Promise<Record<string, any>>;
    saveSettings(pluginId: string, settings: Record<string, any>): Promise<void>;
    
    showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void;
    showToast(message: string, duration?: number): void;
    showConfirm(title: string, message: string): Promise<boolean>;
    showPrompt(title: string, message: string, defaultValue?: string): Promise<string | null>;
    
    openExternal(url: string): Promise<void>;
    copyToClipboard(text: string): Promise<void>;
    readFromClipboard(): Promise<string>;
    
    openFileDialog(options?: FileDialogOptions): Promise<string | string[] | null>;
    saveFileDialog(options?: SaveDialogOptions): Promise<string | null>;
    
    addCommand(command: Command): () => void;
    removeCommand(commandId: string): void;
    executeCommand(commandId: string): Promise<void>;
    
    addKeyboardShortcut(shortcut: KeyboardShortcut): () => void;
    removeKeyboardShortcut(shortcutId: string): void;
    
    addMenuItem(location: string, item: MenuItem): () => void;
    removeMenuItem(itemId: string): void;
    
    addStatusBarItem(item: StatusBarItem): () => void;
    removeStatusBarItem(itemId: string): void;
    
    addEditorExtension(extension: any): () => void;
    removeEditorExtension(extensionId: string): void;
    
    on(eventType: string, listener: Function): () => void;
    off(eventType: string, listener: Function): void;
    emit(event: any): void;
    
    readonly state: AppState;
  }

  export interface Editor {
    getValue(): string;
    setValue(content: string): void;
    getSelection(): string;
    replaceSelection(replacement: string): void;
    getCursor(): EditorPosition;
    setCursor(pos: EditorPosition): void;
    getRange(from: EditorPosition, to: EditorPosition): string;
    replaceRange(replacement: string, from: EditorPosition, to: EditorPosition): void;
    getLine(n: number): string;
    lineCount(): number;
    setOption(option: string, value: any): void;
    getOption(option: string): any;
    focus(): void;
    refresh(): void;
    
    on(type: string, handler: Function): void;
    off(type: string, handler: Function): void;
  }

  export interface TFile {
    path: string;
    name: string;
    content: string;
  }

  export interface AppState {
    activeFile: TFile | null;
    workspace: {
      path: string;
      name: string;
      files: string[];
    };
    settings: {
      vimMode: boolean;
      showLineNumbers: boolean;
      fontSize: number;
      fontFamily: string;
      theme: 'light' | 'dark' | 'auto';
    };
    theme: {
      mode: 'light' | 'dark' | 'auto';
      colors: Record<string, string>;
    };
  }

  export interface EditorPosition {
    line: number;
    ch: number;
  }

  export interface EditorRange {
    from: EditorPosition;
    to: EditorPosition;
  }

  export interface Command {
    id: string;
    name: string;
    description?: string;
    category?: string;
    icon?: string;
    callback?: () => Promise<void> | void;
    editorCallback?: (editor: Editor, view: any) => Promise<void> | void;
    checkCallback?: (checking: boolean) => boolean;
    hotkeys?: Hotkey[];
  }

  export interface KeyboardShortcut {
    id: string;
    name: string;
    description?: string;
    shortcut: string;
    category?: string;
    execute(): Promise<void> | void;
    condition?(): boolean;
  }

  export interface Hotkey {
    modifiers: Array<'Ctrl' | 'Cmd' | 'Alt' | 'Shift' | 'Meta'>;
    key: string;
  }

  export interface MenuItem {
    id: string;
    title: string;
    icon?: string;
    callback?: () => void;
    submenu?: MenuItem[];
    separator?: boolean;
  }

  export interface StatusBarItem {
    id: string;
    text?: string;
    icon?: string;
    tooltip?: string;
    priority?: number;
    callback?: () => void;
  }

  export interface FileDialogOptions {
    title?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    multiple?: boolean;
    directory?: boolean;
  }

  export interface SaveDialogOptions {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }

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

  export interface PluginSettingsConfig {
    groups: SettingGroup[];
  }

  export interface SettingGroup {
    id: string;
    name: string;
    description?: string;
    collapsible?: boolean;
    settings: SettingDefinition[];
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

  export abstract class Plugin {
    app: App;
    manifest: PluginManifest;
    protected settings: Record<string, any>;

    constructor(app: App, manifest: PluginManifest);

    abstract onload(): Promise<void>;
    onunload(): Promise<void>;
    onEnable?(): Promise<void>;
    onDisable?(): Promise<void>;

    loadSettings(): Promise<void>;
    saveSettings(): Promise<void>;
    getSetting(key: string, defaultValue?: any): any;
    setSetting(key: string, value: any): void;

    addCommand(command: Command): () => void;
    addKeyboardShortcut(shortcut: KeyboardShortcut): () => void;
    addStatusBarItem(item: StatusBarItem): () => void;
    addMenuItem(location: string, item: MenuItem): () => void;
    registerSettings(config: PluginSettingsConfig): () => void;
    
    registerDomEvent(el: HTMLElement, type: string, callback: (e: Event) => void): void;
    registerInterval(id: number): void;
    
    showNotification(message: string, type?: string): void;

    loadData(): Promise<any>;
    saveData(data: any): Promise<void>;
  }

  export abstract class Modal {
    app: App;
    contentEl: HTMLElement;

    constructor(app: App);

    abstract onOpen(): void;
    abstract onClose(): void;
    open(): void;
    close(): void;
  }

  export abstract class PluginSettingTab {
    app: App;
    plugin: Plugin;
    containerEl: HTMLElement;

    constructor(app: App, plugin: Plugin);

    abstract display(): void;
    hide(): void;
  }

  export class Setting {
    settingEl: HTMLElement;

    constructor(containerEl: HTMLElement);

    setName(name: string): this;
    setDesc(desc: string): this;
    setClass(cls: string): this;
    setTooltip(tooltip: string): this;
    
    addText(cb: (text: TextComponent) => void): this;
    addTextArea(cb: (textArea: TextAreaComponent) => void): this;
    addToggle(cb: (toggle: ToggleComponent) => void): this;
    addDropdown(cb: (dropdown: DropdownComponent) => void): this;
    addSlider(cb: (slider: SliderComponent) => void): this;
    addButton(cb: (button: ButtonComponent) => void): this;
    addColorPicker(cb: (colorPicker: ColorComponent) => void): this;
  }

  export class TextComponent {
    inputEl: HTMLInputElement;
    
    setValue(value: string): this;
    getValue(): string;
    setPlaceholder(placeholder: string): this;
    onChange(callback: (value: string) => void): this;
    onEnter(callback: () => void): this;
  }

  export class TextAreaComponent {
    inputEl: HTMLTextAreaElement;
    
    setValue(value: string): this;
    getValue(): string;
    setPlaceholder(placeholder: string): this;
    onChange(callback: (value: string) => void): this;
  }

  export class ToggleComponent {
    toggleEl: HTMLElement;
    
    setValue(value: boolean): this;
    getValue(): boolean;
    onChange(callback: (value: boolean) => void): this;
  }

  export class DropdownComponent {
    selectEl: HTMLSelectElement;
    
    addOption(value: string, text: string): this;
    addOptions(options: Record<string, string>): this;
    setValue(value: string): this;
    getValue(): string;
    onChange(callback: (value: string) => void): this;
  }

  export class SliderComponent {
    sliderEl: HTMLInputElement;
    
    setLimits(min: number, max: number, step: number): this;
    setValue(value: number): this;
    getValue(): number;
    setDynamicTooltip(): this;
    onChange(callback: (value: number) => void): this;
  }

  export class ButtonComponent {
    buttonEl: HTMLButtonElement;
    
    setButtonText(text: string): this;
    setTooltip(tooltip: string): this;
    setClass(cls: string): this;
    setIcon(icon: string): this;
    onClick(callback: () => void): this;
  }

  export class ColorComponent {
    colorEl: HTMLInputElement;
    
    setValue(value: string): this;
    getValue(): string;
    onChange(callback: (value: string) => void): this;
  }

  export class Notice {
    noticeEl: HTMLElement;
    
    constructor(message: string | DocumentFragment, timeout?: number);
    setMessage(message: string | DocumentFragment): this;
    hide(): void;
  }

  export interface Workspace {
    getActiveViewOfType<T>(type: new (...args: any[]) => T): T | null;
  }

  export abstract class MarkdownView {
    editor: Editor;
    file: TFile | null;
    
    abstract getViewType(): string;
    getDisplayText(): string;
    getViewData(): string;
    setViewData(data: string, clear?: boolean): void;
  }
}
import { Plugin, PluginManifest, PluginSettings, PluginSettingsConfig } from '../types/core';
import { AppAPI } from '../api/app';
import { EditorAPI } from '../api/editor';

export abstract class BasePlugin implements Plugin {
  abstract manifest: PluginManifest;
  
  protected app!: AppAPI;
  protected editor!: EditorAPI;
  protected settings: PluginSettings = {};
  private cleanupFunctions: Array<() => void> = [];

  // Lifecycle Methods
  abstract onLoad(): Promise<void> | void;
  
  onUnload(): Promise<void> | void {
    // Auto-cleanup all registered listeners/commands
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }

  onEnable?(): Promise<void> | void;
  onDisable?(): Promise<void> | void;

  // Internal - Called by plugin manager
  _initialize(app: AppAPI, editor: EditorAPI): void {
    this.app = app;
    this.editor = editor;
  }

  // Helper Methods
  protected addCommand(command: Parameters<AppAPI['addCommand']>[0]) {
    const cleanup = this.app.addCommand(command);
    this.cleanupFunctions.push(cleanup);
    return cleanup;
  }

  protected addMenuItem(location: Parameters<AppAPI['addMenuItem']>[0], item: Parameters<AppAPI['addMenuItem']>[1]) {
    const cleanup = this.app.addMenuItem(location, item);
    this.cleanupFunctions.push(cleanup);
    return cleanup;
  }

  protected registerSettings(config: PluginSettingsConfig) {
    const cleanup = this.app.registerSettings(this.manifest.id, config);
    this.cleanupFunctions.push(cleanup);
    return cleanup;
  }

  protected addStatusBarItem(item: Parameters<AppAPI['addStatusBarItem']>[0]) {
    const cleanup = this.app.addStatusBarItem(item);
    this.cleanupFunctions.push(cleanup);
    return cleanup;
  }

  protected addEditorExtension(extension: Parameters<AppAPI['addEditorExtension']>[0]) {
    const cleanup = this.app.addEditorExtension(extension);
    this.cleanupFunctions.push(cleanup);
    return cleanup;
  }

  protected addEventListener<T extends Parameters<AppAPI['on']>[0]>(
    eventType: T, 
    listener: Parameters<AppAPI['on']>[1]
  ) {
    const cleanup = this.app.on(eventType, listener);
    this.cleanupFunctions.push(cleanup);
    return cleanup;
  }

  // Settings Management
  protected async loadSettings<T extends PluginSettings>(): Promise<T> {
    this.settings = await this.app.loadSettings<T>(this.manifest.id);
    return this.settings as T;
  }

  protected async saveSettings<T extends PluginSettings>(settings: T): Promise<void> {
    this.settings = settings;
    await this.app.saveSettings(this.manifest.id, settings);
  }

  protected getSetting<T = any>(key: string, defaultValue?: T): T {
    return this.settings[key] ?? defaultValue;
  }

  protected setSetting<T = any>(key: string, value: T): void {
    this.settings[key] = value;
  }

  // Utility Methods
  protected showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error') {
    this.app.showNotification(message, type);
  }

  protected showToast(message: string, duration?: number) {
    this.app.showToast(message, duration);
  }

  protected async showConfirm(title: string, message: string): Promise<boolean> {
    return this.app.showConfirm(title, message);
  }

  protected async showPrompt(title: string, message: string, defaultValue?: string): Promise<string | null> {
    return this.app.showPrompt(title, message, defaultValue);
  }
}
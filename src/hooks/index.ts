import { useState, useEffect, useCallback, useRef } from 'react';
import { AppAPI } from '../api/app';
import { EditorAPI } from '../api/editor';
import { AppEvent, EventListener, AppState, FileInfo, EditorSelection, EditorPosition } from '../types/core';

// Global references (set by plugin manager)
let appInstance: AppAPI;
let editorInstance: EditorAPI;

export function _setInstances(app: AppAPI, editor: EditorAPI) {
  appInstance = app;
  editorInstance = editor;
}

// App State Hook
export function useApp(): AppAPI {
  if (!appInstance) {
    throw new Error('useApp must be called within a plugin context');
  }
  return appInstance;
}

// Editor Hook
export function useEditor(): EditorAPI {
  if (!editorInstance) {
    throw new Error('useEditor must be called within a plugin context');
  }
  return editorInstance;
}

// App State Hook
export function useAppState(): AppState {
  const app = useApp();
  const [state, setState] = useState<AppState>(app.state);

  useEffect(() => {
    const unsubscribes = [
      app.on('file:open', () => setState(app.state)),
      app.on('file:save', () => setState(app.state)),
      app.on('file:close', () => setState(app.state)),
      app.on('file:change', () => setState(app.state)),
      app.on('workspace:change', () => setState(app.state)),
      app.on('theme:change', () => setState(app.state)),
      app.on('settings:change', () => setState(app.state)),
    ];

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [app]);

  return state;
}

// Active File Hook
export function useActiveFile(): FileInfo | null {
  const state = useAppState();
  return state.activeFile;
}

// Editor Content Hook
export function useEditorContent(): [string, (content: string) => void] {
  const editor = useEditor();
  const [content, setContent] = useState(editor.getContent());

  useEffect(() => {
    return editor.onChange(setContent);
  }, [editor]);

  const updateContent = useCallback((newContent: string) => {
    editor.setContent(newContent);
  }, [editor]);

  return [content, updateContent];
}

// Editor Selection Hook
export function useEditorSelection(): EditorSelection | null {
  const editor = useEditor();
  const [selection, setSelection] = useState<EditorSelection | null>(editor.getSelection());

  useEffect(() => {
    return editor.onSelectionChange(setSelection);
  }, [editor]);

  return selection;
}

// Editor Cursor Hook
export function useEditorCursor(): EditorPosition {
  const editor = useEditor();
  const [cursor, setCursor] = useState<EditorPosition>(editor.getCursor());

  useEffect(() => {
    return editor.onCursorChange(setCursor);
  }, [editor]);

  return cursor;
}

// Event Listener Hook
export function useAppEvent<T extends AppEvent>(
  eventType: T['type'],
  listener: EventListener<T>,
  deps: any[] = []
): void {
  const app = useApp();
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const wrappedListener = (event: T) => listenerRef.current(event);
    return app.on(eventType, wrappedListener);
  }, [app, eventType, ...deps]);
}

// Settings Hook
export function usePluginSettings<T extends Record<string, any>>(
  pluginId: string,
  defaultSettings: T
): [T, (settings: Partial<T>) => Promise<void>, boolean] {
  const app = useApp();
  const [settings, setSettings] = useState<T>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    app.loadSettings<T>(pluginId).then(loadedSettings => {
      setSettings({ ...defaultSettings, ...loadedSettings });
      setLoading(false);
    }).catch(() => {
      setSettings(defaultSettings);
      setLoading(false);
    });
  }, [pluginId]);

  const updateSettings = useCallback(async (newSettings: Partial<T>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await app.saveSettings(pluginId, updatedSettings);
  }, [app, pluginId, settings]);

  return [settings, updateSettings, loading];
}

// Debounced Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Command Hook
export function useCommand(
  commandId: string,
  commandDefinition: Omit<Parameters<AppAPI['addCommand']>[0], 'id'>
): void {
  const app = useApp();

  useEffect(() => {
    return app.addCommand({
      id: commandId,
      ...commandDefinition
    });
  }, [app, commandId, commandDefinition.execute]);
}

// Status Bar Hook
export function useStatusBarItem(
  itemId: string,
  item: Omit<Parameters<AppAPI['addStatusBarItem']>[0], 'id'>
): void {
  const app = useApp();

  useEffect(() => {
    return app.addStatusBarItem({
      id: itemId,
      ...item
    });
  }, [app, itemId, item.text, item.onClick]);
}
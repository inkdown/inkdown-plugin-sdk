
export * from './types/core';

export type { AppAPI } from './api/app';

export type { EditorAPI, EditorPosition, EditorRange, EditorSelection } from './api/editor';

export { BasePlugin } from './plugin/base';

export { definePlugin } from './utils/define-plugin';

export { createSettings, SettingsBuilder, GroupBuilder } from './utils/settings-builder';

export const SDK_VERSION = '1.0.0';
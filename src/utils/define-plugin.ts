import { Plugin, PluginManifest } from '../types/core';

export function definePlugin(
  manifest: PluginManifest,
  plugin: Omit<Plugin, 'manifest'>
): Plugin {
  return {
    manifest,
    ...plugin
  };
}
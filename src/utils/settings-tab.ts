import { ReactNode } from 'react';
import { SettingsTab } from '../types/core';

export function createSettingsTab(
  id: string,
  name: string,
  component: ReactNode,
  icon?: string
): SettingsTab {
  return {
    id,
    name,
    component,
    icon
  };
}
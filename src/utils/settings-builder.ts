import { 
  PluginSettingsConfig, 
  SettingGroup, 
  SettingDefinition,
  TextSetting,
  NumberSetting,
  BooleanSetting,
  DropdownSetting,
  TextareaSetting,
  ColorSetting,
  FileSetting
} from '../types/core';

export class SettingsBuilder {
  private groups: SettingGroup[] = [];

  addGroup(id: string, name: string, description?: string, collapsible?: boolean): GroupBuilder {
    const group: SettingGroup = {
      id,
      name,
      description,
      collapsible,
      settings: []
    };
    this.groups.push(group);
    return new GroupBuilder(group);
  }

  build(): PluginSettingsConfig {
    return { groups: this.groups };
  }
}

export class GroupBuilder {
  constructor(private group: SettingGroup) {}

  addText(
    key: string, 
    name: string, 
    defaultValue: string,
    options?: { 
      description?: string; 
      placeholder?: string; 
      maxLength?: number; 
    }
  ): GroupBuilder {
    const setting: TextSetting = {
      key,
      name,
      type: 'text',
      defaultValue,
      description: options?.description,
      placeholder: options?.placeholder,
      maxLength: options?.maxLength
    };
    this.group.settings.push(setting);
    return this;
  }

  addPassword(
    key: string, 
    name: string, 
    defaultValue: string,
    options?: { 
      description?: string; 
      placeholder?: string; 
    }
  ): GroupBuilder {
    const setting: TextSetting = {
      key,
      name,
      type: 'password',
      defaultValue,
      description: options?.description,
      placeholder: options?.placeholder
    };
    this.group.settings.push(setting);
    return this;
  }

  addNumber(
    key: string, 
    name: string, 
    defaultValue: number,
    options?: { 
      description?: string; 
      min?: number; 
      max?: number; 
      step?: number; 
    }
  ): GroupBuilder {
    const setting: NumberSetting = {
      key,
      name,
      type: 'number',
      defaultValue,
      description: options?.description,
      min: options?.min,
      max: options?.max,
      step: options?.step
    };
    this.group.settings.push(setting);
    return this;
  }

  addSlider(
    key: string, 
    name: string, 
    defaultValue: number,
    min: number,
    max: number,
    options?: { 
      description?: string; 
      step?: number; 
    }
  ): GroupBuilder {
    const setting: NumberSetting = {
      key,
      name,
      type: 'slider',
      defaultValue,
      min,
      max,
      description: options?.description,
      step: options?.step || 1
    };
    this.group.settings.push(setting);
    return this;
  }

  addBoolean(
    key: string, 
    name: string, 
    defaultValue: boolean,
    description?: string
  ): GroupBuilder {
    const setting: BooleanSetting = {
      key,
      name,
      type: 'boolean',
      defaultValue,
      description
    };
    this.group.settings.push(setting);
    return this;
  }

  addDropdown(
    key: string, 
    name: string, 
    defaultValue: string,
    options: Array<{ value: string; label: string }>,
    description?: string
  ): GroupBuilder {
    const setting: DropdownSetting = {
      key,
      name,
      type: 'dropdown',
      defaultValue,
      options,
      description
    };
    this.group.settings.push(setting);
    return this;
  }

  addTextarea(
    key: string, 
    name: string, 
    defaultValue: string,
    options?: { 
      description?: string; 
      placeholder?: string; 
      rows?: number; 
    }
  ): GroupBuilder {
    const setting: TextareaSetting = {
      key,
      name,
      type: 'textarea',
      defaultValue,
      description: options?.description,
      placeholder: options?.placeholder,
      rows: options?.rows
    };
    this.group.settings.push(setting);
    return this;
  }

  addColor(
    key: string, 
    name: string, 
    defaultValue: string,
    description?: string
  ): GroupBuilder {
    const setting: ColorSetting = {
      key,
      name,
      type: 'color',
      defaultValue,
      description
    };
    this.group.settings.push(setting);
    return this;
  }

  addFile(
    key: string, 
    name: string, 
    defaultValue: string,
    options?: { 
      description?: string; 
      extensions?: string[]; 
    }
  ): GroupBuilder {
    const setting: FileSetting = {
      key,
      name,
      type: 'file',
      defaultValue,
      description: options?.description,
      extensions: options?.extensions
    };
    this.group.settings.push(setting);
    return this;
  }

  addFolder(
    key: string, 
    name: string, 
    defaultValue: string,
    description?: string
  ): GroupBuilder {
    const setting: FileSetting = {
      key,
      name,
      type: 'folder',
      defaultValue,
      description
    };
    this.group.settings.push(setting);
    return this;
  }
}

// Função helper para criar settings facilmente
export function createSettings(): SettingsBuilder {
  return new SettingsBuilder();
}
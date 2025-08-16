import { ReactNode, useState, useCallback } from 'react';

// Base Setting Component Props
interface BaseSettingProps {
  label: string;
  description?: string;
  children: ReactNode;
}

export function SettingItem({ label, description, children }: BaseSettingProps) {
  return (
    <div className="setting-item">
      <div className="setting-label">
        <span className="setting-title">{label}</span>
        {description && <span className="setting-description">{description}</span>}
      </div>
      <div className="setting-control">
        {children}
      </div>
    </div>
  );
}

// Toggle Switch
interface ToggleSettingProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function ToggleSetting({ label, description, value, onChange, disabled }: ToggleSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider"></span>
      </label>
    </SettingItem>
  );
}

// Text Input
interface TextSettingProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'email' | 'url';
}

export function TextSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  type = 'text' 
}: TextSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="setting-input"
      />
    </SettingItem>
  );
}

// Number Input
interface NumberSettingProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function NumberSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  disabled 
}: NumberSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="setting-input"
      />
    </SettingItem>
  );
}

// Dropdown Select
interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSettingProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
}

export function DropdownSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  options, 
  disabled 
}: DropdownSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="setting-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SettingItem>
  );
}

// Slider
interface SliderSettingProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
}

export function SliderSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  disabled,
  showValue = true 
}: SliderSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <div className="slider-container">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="setting-slider"
        />
        {showValue && <span className="slider-value">{value}</span>}
      </div>
    </SettingItem>
  );
}

// Button
interface ButtonSettingProps {
  label: string;
  description?: string;
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function ButtonSetting({ 
  label, 
  description, 
  buttonText, 
  onClick, 
  disabled,
  variant = 'secondary'
}: ButtonSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`setting-button setting-button--${variant}`}
      >
        {buttonText}
      </button>
    </SettingItem>
  );
}

// Textarea
interface TextareaSettingProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function TextareaSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  placeholder, 
  disabled,
  rows = 4 
}: TextareaSettingProps) {
  return (
    <SettingItem label={label} description={description}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="setting-textarea"
      />
    </SettingItem>
  );
}

// Settings Group
interface SettingsGroupProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function SettingsGroup({ 
  title, 
  children, 
  collapsible = false, 
  defaultOpen = true 
}: SettingsGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  }, [collapsible, isOpen]);

  return (
    <div className="settings-group">
      <div 
        className={`settings-group-header ${collapsible ? 'collapsible' : ''}`}
        onClick={toggle}
      >
        <h3 className="settings-group-title">{title}</h3>
        {collapsible && (
          <span className={`collapse-icon ${isOpen ? 'open' : ''}`}>▼</span>
        )}
      </div>
      {isOpen && (
        <div className="settings-group-content">
          {children}
        </div>
      )}
    </div>
  );
}
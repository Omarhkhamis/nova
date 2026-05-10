"use client";

import {
  Building2,
  Car,
  Cpu,
  Droplets,
  Factory,
  FlaskConical,
  Gauge,
  PlugZap,
  Settings2,
  Ship,
  Snowflake,
  Utensils,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: Array<{ name: string; Icon: LucideIcon }> = [
  { name: "Cpu", Icon: Cpu },
  { name: "Settings2", Icon: Settings2 },
  { name: "Ship", Icon: Ship },
  { name: "Snowflake", Icon: Snowflake },
  { name: "Gauge", Icon: Gauge },
  { name: "PlugZap", Icon: PlugZap },
  { name: "Factory", Icon: Factory },
  { name: "Zap", Icon: Zap },
  { name: "Droplets", Icon: Droplets },
  { name: "Utensils", Icon: Utensils },
  { name: "FlaskConical", Icon: FlaskConical },
  { name: "Car", Icon: Car },
  { name: "Building2", Icon: Building2 },
];

export function IconPicker({
  name,
  label,
  defaultValue = "Cpu",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <label className="dashboard-field dashboard-field--wide">
      <span>{label}</span>
      <div className="icon-picker">
        {icons.map(({ name: iconName, Icon }) => (
          <label className="icon-picker__option" key={iconName}>
            <input name={name} type="radio" value={iconName} defaultChecked={iconName === defaultValue} />
            <span>
              <Icon size={20} aria-hidden="true" />
              {iconName}
            </span>
          </label>
        ))}
      </div>
    </label>
  );
}

export function DashboardIcon({ name }: { name?: string }) {
  const found = icons.find((icon) => icon.name === name) ?? icons[0];
  const Icon = found.Icon;

  return (
    <span className="dashboard-item-icon" title={found.name}>
      <Icon size={18} aria-hidden="true" />
    </span>
  );
}

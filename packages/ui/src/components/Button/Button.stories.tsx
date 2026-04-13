import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the button fills its container width",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    children: {
      control: "text",
      description: "Button label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Primary ────────────────────────────────────────────────────────────────

export const Primary: Story = {
  args: {
    children: "Primary button",
    variant: "primary",
  },
};

// ─── Secondary ──────────────────────────────────────────────────────────────

export const Secondary: Story = {
  args: {
    children: "Secondary button",
    variant: "secondary",
  },
};

// ─── Ghost ──────────────────────────────────────────────────────────────────

export const Ghost: Story = {
  args: {
    children: "Ghost button",
    variant: "ghost",
  },
};

// ─── Danger ─────────────────────────────────────────────────────────────────

export const Danger: Story = {
  args: {
    children: "Delete",
    variant: "danger",
  },
};

// ─── Sizes ──────────────────────────────────────────────────────────────────

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

// ─── States ─────────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: {
    children: "Saving…",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full width button",
    fullWidth: true,
  },
};

// ─── All variants overview ───────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

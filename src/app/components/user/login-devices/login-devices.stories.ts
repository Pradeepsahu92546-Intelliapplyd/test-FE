import type { Meta, StoryObj } from '@storybook/angular';
import { LoginDevices } from './login-devices';

const meta: Meta<LoginDevices> = {
  title: 'Security/LoginDevices',
  component: LoginDevices,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<LoginDevices>;

// --- Empty Devices ---
export const EmptyDevices: Story = {
  render: (args) => ({
    component: LoginDevices,
    props: {
      ...args,
      devices: [],
    },
  }),
};

// --- All Devices Render ---
export const AllDevices: Story = {
  render: (args) => ({
    component: LoginDevices,
    props: {
      ...args,
    },
  }),
};

// --- Logout One Device ---
export const LogoutOneDevice: Story = {
  render: (args) => ({
    component: LoginDevices,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    // Click logout icon of the first device
    const logoutIcon = canvasElement.querySelector<HTMLElement>(
      '#deviceList #deviceItem #logoutIcon'
    );
    if (logoutIcon) logoutIcon.click();
  },
};

// --- Logout All Devices ---
export const LogoutAllDevices: Story = {
  render: (args) => ({
    component: LoginDevices,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    // Click the "Logout from all devices" button
    const logoutAllBtn = canvasElement.querySelector<HTMLButtonElement>(
      '#logoutAllBtn'
    );
    if (logoutAllBtn) logoutAllBtn.click();
  },
};

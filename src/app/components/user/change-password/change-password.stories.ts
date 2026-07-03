import type { Meta, StoryObj } from '@storybook/angular';
import { ChangePassword } from './change-password';

const meta: Meta<ChangePassword> = {
  title: 'Security/ChangePassword',
  component: ChangePassword,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ChangePassword>;

// --- Case 1: Default Render ---
export const DefaultRender: Story = {
  render: (args) => ({
    component: ChangePassword,
    props: { ...args },
  }),
};

// --- Case 2: Invalid Data (trigger validation errors) ---
export const InvalidData: Story = {
  render: (args) => ({
    component: ChangePassword,
    props: { ...args },
  }),
  play: async ({ canvasElement }) => {
    // Current password too short
    const currentPassword = canvasElement.querySelector<HTMLInputElement>('#currentPassword');
    if (currentPassword) {
      currentPassword.value = 'abc';
      currentPassword.dispatchEvent(new Event('input'));
      currentPassword.dispatchEvent(new Event('blur'));
    }

    // New password missing required pattern
    const newPassword = canvasElement.querySelector<HTMLInputElement>('#newPassword');
    if (newPassword) {
      newPassword.value = '123';
      newPassword.dispatchEvent(new Event('input'));
      newPassword.dispatchEvent(new Event('blur'));
    }

    // Confirm password empty
    const confirmPassword = canvasElement.querySelector<HTMLInputElement>('#confirmPassword');
    if (confirmPassword) {
      confirmPassword.value = '';
      confirmPassword.dispatchEvent(new Event('input'));
      confirmPassword.dispatchEvent(new Event('blur'));
    }

    // Click submit to trigger form errors
    const submitBtn = canvasElement.querySelector<HTMLButtonElement>('#submit-btn');
    if (submitBtn) submitBtn.click();
  },
};

// --- Case 3: Valid Data and Submit ---
export const ValidDataAndSubmit: Story = {
  render: (args) => ({
    component: ChangePassword,
    props: { ...args },
  }),
  play: async ({ canvasElement }) => {
    // Current password (valid strong)
    const currentPassword = canvasElement.querySelector<HTMLInputElement>('#currentPassword');
    if (currentPassword) {
      currentPassword.value = 'OldPass@123';
      currentPassword.dispatchEvent(new Event('input'));
    }

    // New password (valid strong)
    const newPassword = canvasElement.querySelector<HTMLInputElement>('#newPassword');
    if (newPassword) {
      newPassword.value = 'NewPass@123';
      newPassword.dispatchEvent(new Event('input'));
    }

    // Confirm password matches
    const confirmPassword = canvasElement.querySelector<HTMLInputElement>('#confirmPassword');
    if (confirmPassword) {
      confirmPassword.value = 'NewPass@123';
      confirmPassword.dispatchEvent(new Event('input'));
    }

    // Click Change Password
    const submitBtn = canvasElement.querySelector<HTMLButtonElement>('#submit-btn');
    if (submitBtn) submitBtn.click();
  },
};

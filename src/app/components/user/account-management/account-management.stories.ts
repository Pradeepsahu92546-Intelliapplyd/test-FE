import type { Meta, StoryObj } from '@storybook/angular';
import { AccountManagement } from './account-management';

const meta: Meta<AccountManagement> = {
  title: 'Account/AccountManagement',
  component: AccountManagement,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AccountManagement>;

// --- Case 1: Default Render ---
export const DefaultRender: Story = {
  render: (args) => ({
    component: AccountManagement,
    props: { ...args },
  }),
};

// --- Case 2: Click Delete Account ---
export const ClickDelete: Story = {
  render: (args) => ({
    component: AccountManagement,
    props: { ...args },
  }),
  play: async ({ canvasElement }) => {
    const deleteButton = canvasElement.querySelector<HTMLButtonElement>('#delete-btn');
    if (deleteButton) {
      deleteButton.click();
      console.log('Clicked Delete button');
    } else {
      console.error('Delete button not found!');
    }
  },
};

// --- Case 3: Click Deactivate Account ---
export const ClickDeactivate: Story = {
  render: (args) => ({
    component: AccountManagement,
    props: { ...args },
  }),
  play: async ({ canvasElement }) => {
    const deactivateButton = canvasElement.querySelector<HTMLButtonElement>('#deactivate-btn');
    if (deactivateButton) {
      deactivateButton.click();
      console.log('Clicked Deactivate button');
    } else {
      console.error('Deactivate button not found!');
    }
  },
};

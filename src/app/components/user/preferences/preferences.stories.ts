import type { Meta, StoryObj } from '@storybook/angular';
import { Preferences } from './preferences';

const meta: Meta<Preferences> = {
  title: 'Account/Preferences',
  component: Preferences,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Preferences>;

// --- Case 1: Default Render ---
export const DefaultRender: Story = {
    args: {
    theme: '',
     language: '',
     
  },
};

// --- Case 2: Theme is Light ---
export const ThemeLight: Story = {
  args: {
    theme: 'light',
     language: '',
  },
};

// --- Case 3: Theme is Dark ---
export const ThemeDark: Story = {
  args: {
    theme: 'dark',
     language: '',
  },
};

// --- Case 4: Language is English ---
export const LanguageEnglish: Story = {
  args: {
    theme:"",
    
  },
};


// --- Case 5: Reports Selected ---
export const ReportsSelected: Story = {
  args: {
    language:"",
    theme:"",
    reports: true,
  },
};

// --- Case 6: Promotion Selected ---
export const PromotionSelected: Story = {
  args: {
    language:"",
    theme:"",
    promotion: true,
  },
};

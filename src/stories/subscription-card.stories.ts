import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  SubscriptionCard,
  BillingPeriod,
} from '../app/shared/components/subscription-card/subscription-card';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { userEvent, within } from '@storybook/testing-library';

const meta: Meta<SubscriptionCard> = {
  title: 'Shared/SubscriptionCard',
  component: SubscriptionCard,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        NzButtonModule,
        NzTagModule,
        NzIconModule,
        NzRadioModule,
        FormsModule,
        NzDividerModule,
      ],
    }),
  ],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design',
    },
  },
  argTypes: {
    billing: {
      options: ['monthly', 'annual'],
      control: { type: 'radio' },
    },
    select: { action: 'selected' },
    billingChange: { action: 'billingChanged' },
  },
};

export default meta;
type Story = StoryObj<SubscriptionCard>;

// Basic subscription card with monthly billing
export const Basic: Story = {
  args: {
    title: 'Basic Plan',
    subtitle: 'Perfect for individuals getting started',
    recommended: false,
    showPrice: true,
    showBillingToggle: true,
    price: '999',
    billing: 'monthly',
    features: [
      '10 projects limit',
      'Basic analytics',
      'Email support',
      '5GB storage',
    ],
    ctaText: 'Choose plan',
    ctaDisabled: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design/basic-plan',
    },
  },
};

// Recommended plan with annual billing
export const RecommendedAnnual: Story = {
  args: {
    title: 'Pro Plan',
    subtitle: 'For growing businesses and teams',
    recommended: true,
    showPrice: true,
    showBillingToggle: true,
    price: '1999',
    billing: 'annual',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'Team collaboration',
      'Custom branding',
    ],
    ctaText: 'Get Started',
    ctaDisabled: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design/recommended-annual',
    },
  },
};

// Postpaid plan without price display
export const PostpaidPlan: Story = {
  args: {
    title: 'Enterprise',
    subtitle: 'Custom solutions for large organizations',
    recommended: false,
    showPrice: false, // No price shown for postpaid
    showBillingToggle: true,
    billing: 'annual',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      '24/7 premium support',
      'Custom integrations',
      'SLA guarantee',
      'Onboarding assistance',
    ],
    ctaText: 'Contact Sales',
    ctaDisabled: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design/postpaid-plan',
    },
  },
};

// Disabled plan card
export const DisabledPlan: Story = {
  args: {
    title: 'Premium Plan',
    subtitle: 'Currently unavailable for new subscriptions',
    recommended: false,
    showPrice: true,
    showBillingToggle: false,
    price: '2999',
    billing: 'monthly',
    features: [
      'All Pro features',
      'API access',
      'White-label options',
      'Advanced security',
    ],
    ctaText: 'Coming Soon',
    ctaDisabled: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design/disabled-plan',
    },
  },
};

// Interactive story with user interactions
export const Interactive: Story = {
  args: {
    title: 'Interactive Plan',
    subtitle: 'Test all interactive elements',
    recommended: true,
    showPrice: true,
    showBillingToggle: true,
    price: '1499',
    billing: 'monthly',
    features: [
      'Click the CTA button',
      'Toggle billing period',
      'See event actions in Actions panel',
    ],
    ctaText: 'Select Plan',
    ctaDisabled: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design/interactive',
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click the CTA button
    const button = canvas.getByRole('button', { name: /select plan/i });
    await userEvent.click(button);

    // Change billing period to annual
    const annualRadio = canvas.getByRole('radio', { name: /annual/i });
    await userEvent.click(annualRadio);

    // Change back to monthly
    const monthlyRadio = canvas.getByRole('radio', { name: /monthly/i });
    await userEvent.click(monthlyRadio);
  },
};

// Without billing toggle (simple pricing)
export const SimplePricing: Story = {
  args: {
    title: 'Starter',
    subtitle: 'Simple pricing without options',
    recommended: false,
    showPrice: true,
    showBillingToggle: false, // No billing toggle
    price: '499',
    billing: 'monthly',
    features: ['5 projects limit', 'Basic support', '2GB storage'],
    ctaText: 'Choose Starter',
    ctaDisabled: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-subscription-card-design/simple-pricing',
    },
  },
};

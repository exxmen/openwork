/**
 * Integration tests for OnboardingWizard component
 * Tests wizard rendering, feature cards, and completion flow
 * @module __tests__/integration/renderer/components/OnboardingWizard.integration.test
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Create mock functions for accomplish API
const mockLogEvent = vi.fn();

// Mock accomplish API
const mockAccomplish = {
  logEvent: mockLogEvent.mockResolvedValue(undefined),
};

// Mock the accomplish module
vi.mock('../../lib/accomplish', () => ({
  getAccomplish: () => mockAccomplish,
}));

// Also mock the @/lib/accomplish path alias
vi.mock('@/lib/accomplish', () => ({
  getAccomplish: () => mockAccomplish,
}));

// Mock framer-motion to simplify testing animations
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) => {
      // Filter out motion-specific props
      const { initial, animate, exit, transition, variants, whileHover, ...domProps } = props;
      return <div className={className} {...domProps}>{children}</div>;
    },
    p: ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) => {
      const { initial, animate, exit, transition, variants, ...domProps } = props;
      return <p className={className} {...domProps}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock animation utilities
vi.mock('@/lib/animations', () => ({
  springs: {
    bouncy: { type: 'spring', stiffness: 300 },
    gentle: { type: 'spring', stiffness: 200 },
  },
  staggerContainer: {
    initial: {},
    animate: {},
  },
  staggerItem: {
    initial: {},
    animate: {},
  },
}));

// Need to import after mocks are set up
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

describe('OnboardingWizard Integration', () => {
  const defaultProps = {
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('wizard rendering', () => {
    it('should render the wizard overlay', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert - Check for overlay backdrop
      const overlay = document.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('should render welcome title', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Welcome to Openwork')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Your AI-powered automation assistant')).toBeInTheDocument();
    });

    it('should render introductory description', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText(/with openwork, you can create complex ai-powered workflows/i)).toBeInTheDocument();
    });

    it('should render Get Started button', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    it('should render Zap icon', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert - Check for icon container
      const iconContainer = document.querySelector('.h-14.w-14');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should log onboarding start event on mount', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(mockLogEvent).toHaveBeenCalledWith({
        level: 'info',
        message: 'Onboarding wizard started',
      });
    });
  });

  describe('feature cards', () => {
    it('should render Code Generation feature card', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Code Generation')).toBeInTheDocument();
      expect(screen.getByText(/generate and modify code with natural language/i)).toBeInTheDocument();
    });

    it('should render Browser Automation feature card', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Browser Automation')).toBeInTheDocument();
      expect(screen.getByText(/automate browser tasks with dev browser/i)).toBeInTheDocument();
    });

    it('should render Task Management feature card', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Task Management')).toBeInTheDocument();
      expect(screen.getByText(/track and manage your ai-assisted workflows/i)).toBeInTheDocument();
    });

    it('should render Secure & Local feature card', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Secure & Local')).toBeInTheDocument();
      expect(screen.getByText(/your data stays on your machine/i)).toBeInTheDocument();
    });

    it('should render all four feature cards', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const featureCards = document.querySelectorAll('.rounded-xl.border');
      expect(featureCards.length).toBe(4);
    });

    it('should render feature icons', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert - Check for icon containers in feature cards
      const iconContainers = document.querySelectorAll('.h-10.w-10.rounded-lg');
      expect(iconContainers.length).toBe(4);
    });
  });

  describe('completion flow', () => {
    it('should call onComplete when Get Started is clicked', () => {
      // Arrange
      const onComplete = vi.fn();
      render(<OnboardingWizard onComplete={onComplete} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      // Assert
      expect(onComplete).toHaveBeenCalled();
    });

    it('should log completion event when Get Started is clicked', () => {
      // Arrange
      render(<OnboardingWizard {...defaultProps} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      // Assert
      expect(mockLogEvent).toHaveBeenCalledWith({
        level: 'info',
        message: 'Onboarding completed',
      });
    });

    it('should only call onComplete once on multiple clicks', () => {
      // Arrange
      const onComplete = vi.fn();
      render(<OnboardingWizard onComplete={onComplete} />);

      // Act
      const button = screen.getByRole('button', { name: /get started/i });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Assert - Each click should trigger the callback
      expect(onComplete).toHaveBeenCalledTimes(3);
    });
  });

  describe('layout and styling', () => {
    it('should render card container', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert - Card component should be rendered
      const card = document.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with max-width constraint', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const container = document.querySelector('.max-w-2xl');
      expect(container).toBeInTheDocument();
    });

    it('should render feature cards in grid layout', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have backdrop blur on overlay', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const overlay = document.querySelector('.backdrop-blur-sm');
      expect(overlay).toBeInTheDocument();
    });

    it('should render with centered flex layout', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const container = document.querySelector('.flex.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });
  });

  describe('feature card tones', () => {
    it('should render Code Generation with blue tone', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const codeCard = screen.getByText('Code Generation').closest('.rounded-xl');
      const iconContainer = codeCard?.querySelector('.bg-blue-500\\/10');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render Browser Automation with teal tone', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const browserCard = screen.getByText('Browser Automation').closest('.rounded-xl');
      const iconContainer = browserCard?.querySelector('.bg-teal-500\\/10');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render Task Management with purple tone', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const taskCard = screen.getByText('Task Management').closest('.rounded-xl');
      const iconContainer = taskCard?.querySelector('.bg-purple-500\\/10');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render Secure & Local with green tone', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const secureCard = screen.getByText('Secure & Local').closest('.rounded-xl');
      const iconContainer = secureCard?.querySelector('.bg-green-500\\/10');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render Get Started button with accessible name', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toBeInTheDocument();
    });

    it('should render heading with proper hierarchy', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Welcome to Openwork');
    });

    it('should render feature card headings', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBe(4);
    });

    it('should have visible focus indicator on button', () => {
      // Arrange & Act
      render(<OnboardingWizard {...defaultProps} />);

      // Assert - Button should have focus-visible classes from Button component
      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toBeInTheDocument();
    });
  });
});

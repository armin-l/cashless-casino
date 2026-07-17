import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import Badge from '../../src/components/Badge';

describe('BaseComponents', () => {
  describe('Card', () => {
    it('renders children inside card container', () => {
      const { getByText } = render(
        <Card>
          <span>Card Content</span>
        </Card>,
      );
      expect(getByText(/Card Content/i)).toBeTruthy();
    });

    it('applies dark casino styling classes', () => {
      const { container } = render(<Card>Content</Card>);
      const cardEl = container.querySelector('[data-testid="card"]');
      expect(cardEl).toHaveClass('bg-gray-800');
      expect(cardEl).toHaveClass('border-yellow-600');
    });
  });

  describe('Button', () => {
    it('renders button with children text', () => {
      const { getByText } = render(
        <Button>Click Me</Button>,
      );
      expect(getByText(/Click Me/i)).toBeTruthy();
    });

    it('applies gold accent styling', () => {
      const { container } = render(<Button>Test</Button>);
      const btn = container.querySelector('button');
      expect(btn).toHaveClass('bg-yellow-500');
    });
  });

  describe('Input', () => {
    it('renders input with placeholder', () => {
      const { container } = render(
        <Input placeholder="Enter amount" />,
      );
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('placeholder', 'Enter amount');
    });

    it('applies dark theme styling', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('bg-gray-900');
      expect(input).toHaveClass('text-white');
    });
  });

  describe('Badge', () => {
    it('renders badge text', () => {
      const { getByText } = render(
        <Badge>Hot</Badge>,
      );
      expect(getByText(/Hot/i)).toBeTruthy();
    });

    it('applies neon glow styling', () => {
      const { container } = render(<Badge>New</Badge>);
      const badge = container.querySelector('[data-testid="badge"]');
      expect(badge).toHaveClass('text-neon-cyan');
    });
  });
});

import { render, screen } from '@testing-library/react';
import React from 'react';
import PageContainer from '@/components/PageContainer';

describe('PageContainer', () => {
  it('renders children', () => {
    render(
      <PageContainer>
        <span data-testid="child">Hello World</span>
      </PageContainer>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies max-width and padding classes', () => {
    const { container } = render(
      <PageContainer>
        <span>test</span>
      </PageContainer>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('max-w-4xl');
    expect(wrapper.className).toContain('mx-auto');
    expect(wrapper.className).toContain('px-6');
    expect(wrapper.className).toContain('py-12');
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <PageContainer className="custom-class">
        <span>test</span>
      </PageContainer>,
    );
    expect(container.firstChild.className).toContain('custom-class');
  });
});

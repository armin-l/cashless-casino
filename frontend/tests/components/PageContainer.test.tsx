import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PageContainer from '../../src/components/PageContainer';

describe('PageContainer', () => {
  it('renders children content', () => {
    const { getByText } = render(
      <PageContainer>
        <div>Hello World</div>
      </PageContainer>,
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies max-width and padding classes', () => {
    const { container } = render(<PageContainer>Content</PageContainer>);
    const mainEl = container.querySelector('main');
    expect(mainEl).toHaveClass('max-w-7xl');
    expect(mainEl).toHaveClass('mx-auto');
  });

  it('wraps content in a semantic main element', () => {
    const { container } = render(<PageContainer>Content</PageContainer>);
    const mainEl = container.querySelector('main');
    expect(mainEl).toBeTruthy();
    expect(mainEl!.tagName.toLowerCase()).toBe('main');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/components/Layout';

describe('Layout', () => {
  const baseProps = { userId: 'user123' };

  it('renders children content', () => {
    render(
      <Layout {...baseProps}>
        <div data-testid="child">Hello</div>
      </Layout>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders a balance bar at the top', () => {
    render(<Layout {...baseProps}><span>test</span></Layout>);
    expect(screen.getByTestId('balance-display')).toBeInTheDocument();
  });
});

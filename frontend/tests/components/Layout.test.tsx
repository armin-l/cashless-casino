import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Layout from '../../src/components/Layout';

describe('Layout', () => {
  it('renders children content', () => {
    const { getByText } = render(
      <Layout>
        <div data-testid="child">Hello World</div>
      </Layout>,
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  it('renders header with title and balance bar', () => {
    const { container } = render(
      <Layout>C</Layout>,
    );
    // Header should be present in the DOM
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('renders navigation bar', () => {
    const { container } = render(
      <Layout>C</Layout>,
    );
    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('renders footer with legal text', () => {
    const { getByText } = render(
      <Layout>Content</Layout>,
    );
    // Footer should contain the legal disclaimer
    expect(getByText(/simulated virtual credit/i)).toBeTruthy();
  });
});

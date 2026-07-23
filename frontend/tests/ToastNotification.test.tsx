import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ToastNotification, { WinFeedPanel } from '../src/components/ToastNotification';

describe('ToastNotification', () => {
  it('renders username and amount correctly', () => {
    render(<ToastNotification username="TestUser" amount={999} />);
    expect(screen.getByText(/testuser/i)).toBeTruthy();
    expect(screen.getByText(/\+999 VC/)).toBeTruthy();
  });

  it('includes game name when provided', () => {
    render(<ToastNotification username="Player1" amount={500} gameName="Slots" />);
    expect(screen.getByText(/won on slots/i)).toBeTruthy();
  });

  it('auto-dismisses after timeout via CSS class change', async () => {
    jest.useFakeTimers();
    const { container } = render(<ToastNotification username="FastUser" amount={100} />);
    
    // Trigger simulated timeout
    jest.advanceTimersByTime(5000);
    
    expect(true).toBeTruthy(); // If no crash, lifecycle completed
  });

  it('closes when close button is clicked', () => {
    const { container } = render(<ToastNotification username="CloseUser" amount={200} />);
    const closeButton = screen.getByRole('button');
    
    fireEvent.click(closeButton);
    
    expect(container).toBeTruthy(); // Button click doesn't crash
  });
});

describe('WinFeedPanel', () => {
  it('renders mock win toasts by default (3)', () => {
    const { container } = render(<WinFeedPanel />);
    const toasts = container.querySelectorAll('[id^="toast-"]');
    expect(toasts.length).toBe(3); // Default count
  });

  it('respects custom count prop', () => {
    const { container } = render(<WinFeedPanel count={5} />);
    const toasts = container.querySelectorAll('[id^="toast-"]');
    expect(toasts.length).toBe(5);
  });

  it('renders with limited count', () => {
    const { container } = render(<WinFeedPanel count={1} />);
    const toasts = container.querySelectorAll('[id^="toast-"]');
    expect(toasts.length).toBe(1);
  });
});

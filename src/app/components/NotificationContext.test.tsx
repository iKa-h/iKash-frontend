import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificationProvider, useNotification } from './NotificationContext';
import { useEffect } from 'react';

// A test component to trigger notifications
function TestComponent({ notifyAction }: { notifyAction: (notify: ReturnType<typeof useNotification>['notify']) => void }) {
  const { notify } = useNotification();
  
  useEffect(() => {
    notifyAction(notify);
  }, [notify, notifyAction]);

  return <div>Test App</div>;
}

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders a toast notification successfully', () => {
    render(
      <NotificationProvider>
        <TestComponent notifyAction={(notify) => notify('success', 'Test message')} />
      </NotificationProvider>
    );

    expect(screen.getByText('Test message')).toBeDefined();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('auto-dismisses the toast after duration', () => {
    render(
      <NotificationProvider>
        <TestComponent notifyAction={(notify) => notify('success', 'Test message', 3000)} />
      </NotificationProvider>
    );

    expect(screen.getByText('Test message')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Test message')).toBeNull();
  });

  it('deduplicates identical active toasts', () => {
    render(
      <NotificationProvider>
        <TestComponent notifyAction={(notify) => {
          notify('success', 'Duplicate message');
          notify('success', 'Duplicate message');
        }} />
      </NotificationProvider>
    );

    const toasts = screen.getAllByText('Duplicate message');
    expect(toasts.length).toBe(1); // Should only be 1
  });

  it('limits max visible toasts to 3 and removes the oldest', () => {
    render(
      <NotificationProvider>
        <TestComponent notifyAction={(notify) => {
          notify('info', 'Message 1');
          notify('info', 'Message 2');
          notify('info', 'Message 3');
          notify('info', 'Message 4');
        }} />
      </NotificationProvider>
    );

    expect(screen.queryByText('Message 1')).toBeNull();
    expect(screen.getByText('Message 2')).toBeDefined();
    expect(screen.getByText('Message 3')).toBeDefined();
    expect(screen.getByText('Message 4')).toBeDefined();
  });

  it('renders title, description, and action button', () => {
    const actionMock = vi.fn();
    render(
      <NotificationProvider>
        <TestComponent notifyAction={(notify) => notify('info', 'Main message', {
          title: 'My Title',
          description: 'My description',
          action: { label: 'Undo', onClick: actionMock }
        })} />
      </NotificationProvider>
    );

    expect(screen.getByText('My Title')).toBeDefined();
    expect(screen.getByText('Main message')).toBeDefined();
    expect(screen.getByText('My description')).toBeDefined();
    
    const actionButton = screen.getByRole('button', { name: 'Undo' });
    expect(actionButton).toBeDefined();

    fireEvent.click(actionButton);
    expect(actionMock).toHaveBeenCalledTimes(1);
  });
});

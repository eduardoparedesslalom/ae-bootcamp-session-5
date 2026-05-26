import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

const renderApp = () => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders TODO App heading', async () => {
    renderApp();
    const headingElement = await screen.findByText(/TODO App/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('displays empty state message when no todos exist', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderApp();
    
    const emptyMessage = await screen.findByText(/no todos yet/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  test('displays correct stats for incomplete and completed todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
      { id: 3, title: 'Todo 3', completed: false },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });
    
    expect(screen.getByText('1 completed')).toBeInTheDocument();
  });

  test('calls delete API when delete button is clicked', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo', completed: false },
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Todo deleted successfully' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  test('shows error message when API fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
    });
  });

  test('uses relative API URL instead of hardcoded localhost', async () => {
    global.fetch.mockResolvedValueOnce({      ok: true,      json: () => Promise.resolve([]),
    });

    renderApp();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^\/api\/todos/)
      );
    });
  });
});

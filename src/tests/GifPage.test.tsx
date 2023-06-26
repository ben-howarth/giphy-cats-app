import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GifPage from '../GifPage';

describe('GifPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'gif1',
            title: 'Gif 1',
            images: {
              fixed_height: {
                url: 'https://example.com/gif1.gif',
              },
            },
          },
          {
            id: 'gif2',
            title: 'Gif 2',
            images: {
              fixed_height: {
                url: 'https://example.com/gif2.gif',
              },
            },
          },
        ],
      }),
    }) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders GIF search results', async () => {
    render(<GifPage />);

    const gif1Title = await screen.findByText('Gif 1');
    const gif2Title = screen.getByText('Gif 2');
    const gif1Image = screen.getByAltText('Gif 1');
    const gif2Image = screen.getByAltText('Gif 2');

    expect(gif1Title).toBeInTheDocument();
    expect(gif2Title).toBeInTheDocument();
    expect(gif1Image.getAttribute('src')).toBe('https://example.com/gif1.gif');
    expect(gif2Image.getAttribute('src')).toBe('https://example.com/gif2.gif');
  });

  test('displays detailed view when a GIF is clicked', async () => {
    render(<GifPage />);

    const gif1Title = await screen.findByText('Gif 1');
    fireEvent.click(gif1Title);

    const gif1DetailView = await screen.findByText('Gif 1 Detailed View');
    const closeButton = screen.getByText('Close');

    expect(gif1DetailView).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test('closes detailed view when "Close" button is clicked', async () => {
    render(<GifPage />);

    const gif1Title = await screen.findByText('Gif 1');
    fireEvent.click(gif1Title);
    
    const gif1DetailView = await screen.findByText('Gif 1 Detailed View');
    const closeButton = await screen.findByText('Close');    
    
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(gif1DetailView).not.toBeInTheDocument();
    });
  });
});

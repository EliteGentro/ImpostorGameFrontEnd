import { Category, Word } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}/api${endpoint}`);

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export const api = {
  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories');
  },

  async getRandomWord(categoryIds?: string[]): Promise<Word> {
    const params = categoryIds?.length
      ? `?categories=${categoryIds.join(',')}`
      : '';
    return fetchApi<Word>(`/words/random${params}`);
  },
};

export { ApiError };

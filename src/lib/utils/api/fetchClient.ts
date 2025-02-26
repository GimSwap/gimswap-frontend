import { camelCase } from 'change-case/keys';
import { fetchSendLog } from './fetchSendLog';

const serverBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if (!serverBaseUrl) {
  fetchSendLog({
    name: 'fetchClient',
    error: 'the environment variable is not set',
  });
  throw new Error('the environment variable is not set');
}

type InitType = RequestInit & { next: { revalidate: number } };

export class FetchError extends Error {
  status: number;
  response: any;

  constructor(message: string, status: number, response: any) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.response = response;
  }
}

async function Fetch(endpoint: string, options?: Partial<InitType>) {
  return handleFetch(`${serverBaseUrl}${endpoint}`, {
    ...options,
    cache: 'no-store',
  });
}

async function handleFetch(
  url: string,
  options?: Partial<InitType>,
): Promise<any> {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new FetchError(
        `fetch error, status: ${response.status}`,
        response.status,
        errorData,
      );
    }
    return camelCase(await response.json(), 4);
  } catch (error) {
    console.error('fetch error:', error);

    throw error;
  }
}

async function isrFetch(
  endpoint: string,
  time = 0,
  tags?: string[],
  options?: Partial<InitType>,
) {
  return handleFetch(`${serverBaseUrl}${endpoint}`, {
    ...options,
    next: { revalidate: time, tags },
  });
}

export { Fetch, isrFetch };

// app/services/payor.ts

export interface Provider {
    provider_id: number;
    provider_name: string;
    address: string;
}

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await fetch('http://localhost:5000/api/provider', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('Failed to fetch providers');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
}

export async function createProvider(provider: Omit<Provider, 'provider_id'>): Promise<Provider> {
  const response = await fetch('http://localhost:5000/api/provider', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(provider),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error creating provider:', errorBody);
    throw new Error('Failed to create provider');
  }

  return response.json();
}

export async function updateProvider(provider_id: number, provider: Omit<Provider, 'provider_id'>): Promise<Provider> {
  const response = await fetch(`http://localhost:5000/api/provider/${provider_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(provider),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error updating provider:', errorBody);
    throw new Error('Failed to update provider');
  }

  return response.json();
}

export async function deleteProvider(provider_id: number): Promise<void> {
  const response = await fetch(`http://localhost:5000/api/provider/${provider_id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error deleting provider:', errorBody);
    throw new Error('Failed to delete provider');
  }
}

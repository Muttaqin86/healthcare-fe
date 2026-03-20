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

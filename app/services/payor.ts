// app/services/payor.ts

export interface Payor {
    payor_id: number;
    payor_name: string;
    address: string;
}

export async function getPayors(): Promise<Payor[]> {
  try {
    const response = await fetch('http://localhost:5000/api/payor', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('Failed to fetch payors');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payors:', error);
    return [];
  }
}

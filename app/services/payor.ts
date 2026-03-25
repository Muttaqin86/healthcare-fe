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

export async function createPayor(payor: Omit<Payor, 'payor_id'>): Promise<Payor> {
  const response = await fetch('http://localhost:5000/api/payor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payor),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error creating payor:', errorBody);
    throw new Error('Failed to create payor');
  }

  return response.json();
}

export async function updatePayor(payor_id: number, payor: Omit<Payor, 'payor_id'>): Promise<Payor> {
  const response = await fetch(`http://localhost:5000/api/payor/${payor_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payor),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error updating payor:', errorBody);
    throw new Error('Failed to update payor');
  }

  return response.json();
}

export async function deletePayor(payor_id: number): Promise<void> {
  const response = await fetch(`http://localhost:5000/api/payor/${payor_id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error deleting payor:', errorBody);
    throw new Error('Failed to delete payor');
  }
}

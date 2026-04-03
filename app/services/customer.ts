// app/services/customer.ts

export interface Customer {
    customer_id: number;
    customer_name: string;
    payor_id: number;
    payor_name: string;
    address: string;
  }
  
  export async function getCustomers(): Promise<Customer[]> {
    try {
      const response = await fetch('http://localhost:5000/api/customer', { cache: 'no-store' });
  
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }
  
  export async function createCustomer(customer: Omit<Customer, 'customer_id'>): Promise<Customer> {
  const response = await fetch('http://localhost:5000/api/customer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error creating customer:', errorBody);
    throw new Error('Failed to create customer');
  }

  return response.json();
}

export async function updateCustomer(customer_id: number, customer: Omit<Customer, 'customer_id'>): Promise<Customer> {
  const response = await fetch(`http://localhost:5000/api/customer/${customer_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error updating customer:', errorBody);
    throw new Error('Failed to update customer');
  }

  return response.json();
}

export async function deleteCustomer(customer_id: number): Promise<void> {
  const response = await fetch(`http://localhost:5000/api/customer/${customer_id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error deleting customer:', errorBody);
    throw new Error('Failed to delete customer');
    }
  }
  
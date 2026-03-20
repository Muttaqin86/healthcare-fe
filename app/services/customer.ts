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
  
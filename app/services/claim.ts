// app/services/claim.ts

export interface Claim {
    claim_id: number;
    member_id: number;
    provider_id: number;
    diagnosis_id: string;
    admission_date: string;
    discharge_date: string;
    incurred: number;
    approved: number;
    excessed: number;
    member_name: string;
    provider_name: string;
    diagnosis_name: string;
    customer_name: string;
    payor_name: string;
  }
  
  export async function getClaims(): Promise<Claim[]> {
    try {
      const response = await fetch('http://localhost:5000/api/claim/', { cache: 'no-store' });
  
      if (!response.ok) {
        throw new Error('Failed to fetch claims');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching claims:', error);
      // In a real app, you might want to throw the error or return a specific error shape
      // For this example, returning an empty array on error
      return [];
    }
  }

  export async function getClaimById(id: number): Promise<Claim | null> {
    try {
      const response = await fetch(`http://localhost:5000/api/claim/${id}`, { cache: 'no-store' });
  
      if (!response.ok) {
        throw new Error('Failed to fetch claim');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching claim with id ${id}:`, error);
      return null;
    }
  }
  
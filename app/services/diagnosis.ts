// app/services/diagnosis.ts

export interface Diagnosis {
    diagnosis_id: number;
    icd_code: string;
    description: string;
  }
  
  export async function getDiagnoses(): Promise<Diagnosis[]> {
    try {
      const response = await fetch('http://localhost:5000/api/diagnosis', { cache: 'no-store' });
  
      if (!response.ok) {
        throw new Error('Failed to fetch diagnoses');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      return [];
    }
  }
  
  export async function createDiagnosis(diagnosis: Omit<Diagnosis, 'diagnosis_id'>): Promise<Diagnosis> {
    try {
      const response = await fetch('http://localhost:5000/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosis),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create diagnosis');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating diagnosis:', error);
      throw error;
    }
  }
  
  export async function updateDiagnosis(id: number, diagnosis: Partial<Omit<Diagnosis, 'diagnosis_id'>>): Promise<Diagnosis> {
    try {
      const response = await fetch(`http://localhost:5000/api/diagnosis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosis),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update diagnosis');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      throw error;
    }
  }
  
  export async function deleteDiagnosis(id: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:5000/api/diagnosis/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete diagnosis');
      }
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      throw error;
    }
  }
  
export interface ClaimAssessment {
    claims_assessment_id: number;
    claim_id: number;
    benefit_id: number;
    benefit_name: string;
    incurred: number;
    approved: number;
    excess: number;
  }
  
  export async function getClaimAssessmentByClaimId(claimId: number): Promise<ClaimAssessment[]> {
    const response = await fetch(`http://localhost:5000/api/claim-assessment/claim/${claimId}`);
  
    if (!response.ok) {
      throw new Error('Failed to fetch claim assessment');
    }
  
    const data = await response.json();
    return data;
  }

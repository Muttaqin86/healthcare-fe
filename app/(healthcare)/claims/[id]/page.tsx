"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getClaimById, Claim } from '@/app/services/claim';
import { getClaimAssessmentByClaimId, ClaimAssessment } from '@/app/services/claim-assessment';

export default function ClaimDetailPage() {
  const params = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [claimAssessment, setClaimAssessment] = useState<ClaimAssessment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    const claimIdStr = Array.isArray(id) ? id[0] : id;

    if (claimIdStr) {
      const claimId = parseInt(claimIdStr, 10);
      if (!isNaN(claimId)) {
        async function fetchClaim() {
          try {
            setLoading(true);
            const claimData = await getClaimById(claimId);
            if (claimData) {
              setClaim(claimData);
              const claimAssessmentData = await getClaimAssessmentByClaimId(claimId);
              setClaimAssessment(claimAssessmentData);
            } else {
              setError('Claim not found.');
            }
          } catch (err) {
            setError('Failed to fetch claim details.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
        fetchClaim();
      } else {
        setError('Invalid claim ID.');
        setLoading(false);
      }
    }
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Claim Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!claim) {
    return null; // Or some other placeholder
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Claim Details</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Claim Information</h3>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Claim ID:</strong> {claim.claim_id}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Provider:</strong> {claim.provider_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Admission Date:</strong> {formatDate(claim.admission_date)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Discharge Date:</strong> {formatDate(claim.discharge_date)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Diagnosis:</strong> {claim.diagnosis_name}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Member Information</h3>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Member:</strong> {claim.member_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Customer:</strong> {claim.customer_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Payor:</strong> {claim.payor_name}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Financial Information</h3>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Incurred:</strong> {formatCurrency(claim.incurred)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Approved:</strong> {formatCurrency(claim.approved)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Excess:</strong> {formatCurrency(claim.excessed)}
            </p>
          </div>
        </div>
      </div>
      {claimAssessment && claimAssessment.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h3 className="text-lg font-semibold text-gray-700">Claim Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {claimAssessment.map((assessment) => (
                <div key={assessment.claims_assessment_id}>
                <p className="text-sm text-gray-600">
                    <strong>Benefit ID:</strong> {assessment.benefit_id}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Benefit Name:</strong> {assessment.benefit_name}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Incurred:</strong> {formatCurrency(assessment.incurred)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Approved:</strong> {formatCurrency(assessment.approved)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Excess:</strong> {formatCurrency(assessment.excess)}
                </p>
                </div>
            ))}
            </div>
        </div>
        )}

    </div>
  );
}

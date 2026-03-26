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
  const [ragResult, setRagResult] = useState<string | null>(null);
  const [ragLoading, setRagLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
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

  const handleCheckCoverage = async () => {
    if (!claim) return;

    try {
      setRagLoading(true);

      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: `Apakah polis ini menanggung penyakit dengan diagnosis ${claim.diagnosis_id}?`,
          contexts: [
            claim.terms_and_conditions || "Tidak ada ketentuan polis"
          ],
          top_k: 2,
        }),
      });

      const data = await response.json();
      setRagResult(data.answer);
    } catch (error) {
      console.error(error);
      setRagResult("Gagal mengambil analisa AI");
    } finally {
      setRagLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
  if (!claim) return;

  try {
    setStatusLoading(true);

    const response = await fetch(`http://localhost:5000/api/claim/${claim.claim_id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Failed to update status");

    // fetch ulang biar lengkap
    const refreshed = await getClaimById(claim.claim_id);
    setClaim(refreshed);

  } catch (error) {
    console.error(error);
    alert("Gagal update status");
  } finally {
    setStatusLoading(false);
  }

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
              <strong>Diagnosis:</strong> {claim.diagnosis_id} - {claim.diagnosis_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white text-xs ${
                  claim.status === "APPROVED"
                    ? "bg-green-500"
                    : claim.status === "PENDING"
                    ? "bg-yellow-500"
                    : claim.status === "REJECTED"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {claim.status || "pending"}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Member Information</h3>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Member ID:</strong> {claim.member_id}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Member Name:</strong> {claim.member_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Customer:</strong> {claim.customer_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Payor:</strong> {claim.payor_name}
            </p>
          </div>
          
        </div>
      </div>
      
      {claimAssessment && claimAssessment.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Claim Assessment
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Benefit ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Benefit Name</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">Incurred</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">Approved</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">Excess</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {claimAssessment.map((assessment) => (
                  <tr key={assessment.claims_assessment_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{assessment.benefit_id}</td>
                    <td className="px-4 py-2 text-sm">{assessment.benefit_name}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {formatCurrency(assessment.incurred)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {formatCurrency(assessment.approved)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {formatCurrency(assessment.excess)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={2} className="px-4 py-2 text-right">Total</td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(claimAssessment.reduce((sum, i) => sum + i.incurred, 0))}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(claimAssessment.reduce((sum, i) => sum + i.approved, 0))}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(claimAssessment.reduce((sum, i) => sum + i.excess, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}


<div className="mt-4 flex gap-2">
  <button
    onClick={() => handleUpdateStatus("APPROVED")}
    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    disabled={statusLoading}
  >
    Approve
  </button>

  <button
    onClick={() => handleUpdateStatus("REJECTED")}
    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    disabled={statusLoading}
  >
    Reject
  </button>

  <button
    onClick={() => handleUpdateStatus("PENDING")}
    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    disabled={statusLoading}
  >
    Pending
  </button>
</div>


<div className="mt-6 bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold text-gray-700">
    Diagnosis Coverage Analysis
  </h3>

  <div className="mt-4">
    <button
      onClick={handleCheckCoverage}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      disabled={ragLoading}
    >
      {ragLoading ? "Checking..." : "Check Coverage"}
    </button>
  </div>

  {ragResult && (
    <div className="mt-4 p-4 bg-gray-50 border rounded-md">
      <p className="text-sm text-gray-700 whitespace-pre-line">
        {ragResult}
      </p>
    </div>
  )}
</div>





    </div>
  );
}

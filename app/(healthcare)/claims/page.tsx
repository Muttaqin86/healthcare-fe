"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClaims, Claim } from "@/app/services/claim";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    async function fetchData() {
      const claimsData = await getClaims();
      setClaims(claimsData);
    }
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if(!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-emerald-800">Claims</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Admission
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Incurred
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Approved
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Excess
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.length > 0 ? (
                claims.map((claim) => (
                  <tr key={claim.claim_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {claim.claim_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {claim.member_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {claim.provider_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {claim.diagnosis_id} - {claim.diagnosis_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {claim.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(claim.admission_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                      {formatCurrency(claim.incurred)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                      {formatCurrency(claim.approved)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                      {formatCurrency(claim.excessed)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <Link
                        href={`/claims/${claim.claim_id}`}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                        Adjustment
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                    No claims found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

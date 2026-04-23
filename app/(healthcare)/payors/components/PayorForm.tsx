"use client";

import { useState, useEffect } from "react";
import { Payor } from "../../../services/payor";

interface PayorFormProps {
  payor: Payor | null;
  onSave: (payor: Omit<Payor, 'payor_id'>) => void;
  onCancel: () => void;
}

export default function PayorForm({ payor, onSave, onCancel }: PayorFormProps) {
  const [formData, setFormData] = useState({
    payor_name: '',
    address: '',
  });

  useEffect(() => {
    if (payor) {
      setFormData({
        payor_name: payor.payor_name,
        address: payor.address,
      });
    }
  }, [payor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{payor ? 'Edit Payor' : 'Add Payor'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="payor_name" className="block text-sm font-medium text-gray-700">
              Payor Name
            </label>
            <input
              type="text"
              name="payor_name"
              id="payor_name"
              value={formData.payor_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

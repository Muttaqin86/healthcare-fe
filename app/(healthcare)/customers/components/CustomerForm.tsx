"use client";

import { useState, useEffect } from "react";
import { Customer } from "../../../services/customer";
import { getPayors, Payor } from "../../../services/payor";

interface CustomerFormProps {
  customer: Customer | null;
  onSave: (customer: { customer_name: string; payor_id: number; address: string }) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    payor_id: 0,
    address: '',
  });
  const [payors, setPayors] = useState<Payor[]>([]);

  useEffect(() => {
    const fetchPayors = async () => {
      try {
        const res = await getPayors();
        setPayors(res);
      } catch (err) {
        console.error("Error fetching payors:", err);
      }
    };
    fetchPayors();
  }, []);

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_name: customer.customer_name,
        payor_id: customer.payor_id,
        address: customer.address,
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'payor_id' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{customer ? 'Edit Customer' : 'Add Customer'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              name="customer_name"
              id="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="payor_id" className="block text-sm font-medium text-gray-700">
              Payor
            </label>
            <select
              name="payor_id"
              id="payor_id"
              value={formData.payor_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              required
            >
              <option value={0}>Select Payor</option>
              {payors.map((payor) => (
                <option key={payor.payor_id} value={payor.payor_id}>
                  {payor.payor_name}
                </option>
              ))}
            </select>
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
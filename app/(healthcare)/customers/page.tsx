"use client";

import { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, Customer } from "../../services/customer";
import CustomerForm from "./components/CustomerForm";

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await getCustomers();
      setData(res);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async (customer_id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customer_id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete customer', error);
      }
    }
  };

  const handleSave = async (customerData: { customer_name: string; payor_id: number; address: string }) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.customer_id, customerData as Omit<Customer, 'customer_id'>);
      } else {
        await createCustomer(customerData as Omit<Customer, 'customer_id'>);
      }
      fetchData();
      setIsFormOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Failed to save customer', error);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  // PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-800">
          Customers
        </h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Add Customer
        </button>
      </div>

      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-emerald-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Customer Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Payor Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Address
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.customer_id} className="hover:bg-gray-50">

                  <td className="px-4 py-2">
                    {item.customer_name}
                  </td>

                  <td className="px-4 py-2">
                    {item.payor_name}
                  </td>

                  <td className="px-4 py-2">
                    {item.address}
                  </td>

                  <td className="px-4 py-2 flex justify-center gap-2">

                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-400 rounded text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.customer_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4 justify-center items-center">

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}

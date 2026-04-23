"use client";

import { useEffect, useState } from "react";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/member";
import { getCustomers, Customer } from "../../services/customer";

type Member = {
  member_id: number;
  member_name: string;
  customer_id: number;
  customer_name?: string;
  payor_name?: string;
  address: string;
  terms_and_conditions?: string;
};

export default function MembersPage() {
  const [data, setData] = useState<Member[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [isTncModalOpen, setIsTncModalOpen] = useState(false);
  const [tncContent, setTncContent] = useState("");

  const [formData, setFormData] = useState({
    member_name: "",
    customer_id: "",
    address: "",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isFormVisible, setIsFormVisible] = useState(false);

  // FETCH DATA
  const fetchData = async () => {
    try {
      const [membersRes, customersRes] = await Promise.all([
        getMembers(),
        getCustomers(),
      ]);
      setData(membersRes);
      setCustomers(customersRes);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT (CREATE / UPDATE) ✅ FIX TYPE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        customer_id: Number(formData.customer_id), // ✅ FIX DI SINI
      };

      if (!payload.customer_id) {
        alert("Customer ID is required");
        return;
      }

      if (editId) {
        await updateMember(editId, payload);
      } else {
        await createMember(payload);
      }

      setFormData({
        member_name: "",
        customer_id: "",
        address: "",
      });

      setEditId(null);
      setIsFormVisible(false);
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // EDIT
  const handleEdit = (item: Member) => {
    setEditId(item.member_id);
    setFormData({
      member_name: item.member_name,
      customer_id: String(item.customer_id),
      address: item.address,
    });
    setIsFormVisible(true);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this data?")) return;

    try {
      await deleteMember(id);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="space-y-6 p-6">

      <h1 className="text-2xl font-bold text-emerald-800">
        Members
      </h1>

      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        {isFormVisible ? "Hide Form" : "Show Form"}
      </button>

      {/* FORM */}
      {isFormVisible && (
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          name="member_name"
          placeholder="Member Name"
          value={formData.member_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.customer_name}
            </option>
          ))}
        </select>

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <button
          type="submit"
          className="col-span-2 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          {editId ? "Update Member" : "Add Member"}
        </button>
      </form>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-emerald-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Member Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Payor
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
                <tr key={item.member_id} className="hover:bg-gray-50">

                  <td className="px-4 py-2">
                    {item.member_name}
                  </td>

                  <td className="px-4 py-2">
                    {item.customer_name || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {item.payor_name || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {item.address}
                  </td>

                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setTncContent(
                          item.terms_and_conditions || "Terms and conditions tidak tersedia"
                        );
                        setIsTncModalOpen(true);
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      View Terms
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-400 rounded text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.member_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {isTncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-3xl w-full rounded bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Terms and Conditions</h2>
              <button
                onClick={() => setIsTncModalOpen(false)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
            <div className="h-72 overflow-y-auto border p-4 rounded bg-slate-50 text-sm whitespace-pre-wrap">
              {tncContent}
            </div>
          </div>
        </div>
      )}

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
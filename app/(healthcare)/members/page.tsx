"use client";

import { useEffect, useState } from "react";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/member";

type Member = {
  member_id: number;
  member_name: string;
  customer_id: number;
  customer_name?: string;
  payor_name?: string;
  address: string;
};

export default function MembersPage() {
  const [data, setData] = useState<Member[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    member_name: "",
    customer_id: "",
    address: "",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await getMembers();
      setData(res);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert("Customer ID wajib diisi");
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
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus data?")) return;

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

      {/* FORM */}
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

        <input
          name="customer_id"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={handleChange}
          className="border p-2 rounded"
        />

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
          {editId ? "Update Member" : "Tambah Member"}
        </button>
      </form>

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
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-400 rounded text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.member_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Hapus
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
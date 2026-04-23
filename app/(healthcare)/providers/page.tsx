"use client";

import { useEffect, useState } from "react";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../../services/provider";

type Provider = {
  provider_id: number;
  provider_name: string;
  address: string;
};

export default function ProvidersPage() {
  const [data, setData] = useState<Provider[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    provider_name: "",
    address: "",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await getProviders();
      setData(res);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateProvider(editId, formData);
      } else {
        await createProvider(formData);
      }

      setFormData({ provider_name: "", address: "" });
      setEditId(null);
      setIsFormVisible(false);
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (item: Provider) => {
    setEditId(item.provider_id);
    setFormData({ provider_name: item.provider_name, address: item.address });
    setIsFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this data?")) return;

    try {
      await deleteProvider(id);
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

      <h1 className="text-2xl font-bold text-emerald-800">Providers</h1>

      <button
        onClick={() => {
          setIsFormVisible(!isFormVisible);
          if (!isFormVisible) {
            setEditId(null);
            setFormData({ provider_name: "", address: "" });
          }
        }}
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        {isFormVisible ? "Hide Form" : "Show Form"}
      </button>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
        >
          <input
            name="provider_name"
            placeholder="Provider Name"
            value={formData.provider_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="col-span-2 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
          >
            {editId ? "Update Provider" : "Add Provider"}
          </button>
        </form>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-emerald-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Provider Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Address</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.provider_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.provider_name}</td>
                  <td className="px-4 py-2">{item.address}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-400 rounded text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.provider_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
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

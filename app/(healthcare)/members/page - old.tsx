"use client";

import { useEffect, useState } from "react";
import {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from "../../services/bootcamp";

export default function PatientsPage() {
  const [data, setData] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    address: "",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // READ
  const fetchData = async () => {
    const res = await getBootcamps();
    setData(res.data);
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

  // CREATE / UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      await updateBootcamp(editId, formData);
    } else {
      await createBootcamp(formData);
    }

    setFormData({
      name: "",
      description: "",
      website: "",
      phone: "",
      email: "",
      address: "",
    });

    setEditId(null);
    fetchData();
  };

  // EDIT
  const handleEdit = (item: any) => {
    setEditId(item.id);
    setFormData(item);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (confirm("Yakin hapus data?")) {
      await deleteBootcamp(id);
      fetchData();
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-800">
        Patients Management
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />

        <button
          type="submit"
          className="col-span-2 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-3">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 bg-yellow-400 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4 justify-center items-center">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
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
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

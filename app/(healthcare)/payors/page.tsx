"use client";

import { useEffect, useState } from "react";
import { getPayors } from "../../services/payor";

type Payor = {
  payor_id: number;
  payor_name: string;
  address: string;
};

export default function PayorsPage() {
  const [data, setData] = useState<Payor[]>([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await getPayors();
      setData(res);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="space-y-6 p-6">

      <h1 className="text-2xl font-bold text-emerald-800">
        Payors
      </h1>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-emerald-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Payor Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Address
              </th>
              {/* <th className="px-4 py-2 text-center text-sm font-semibold">
                Actions
              </th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.payor_id} className="hover:bg-gray-50">

                  <td className="px-4 py-2">
                    {item.payor_name}
                  </td>

                  <td className="px-4 py-2">
                    {item.address}
                  </td>

                  {/* <td className="px-4 py-2 flex justify-center gap-2">

                    <button
                      // onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-400 rounded text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      // onClick={() => handleDelete(item.payor_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Hapus
                    </button>

                  </td> */}

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

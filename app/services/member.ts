//const BASE_URL = "http://localhost:4545/api/bootcamp";
//const BASE_URL = "http://localhost:5000/api/member";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Member {
  member_id: number;
  member_name: string;
  customer_id: number;
  address: string;
}

export async function getMembers() {
  const res = await fetch(`${API_URL}/api/member`);
  return res.json();
}

export async function createMember(data: Partial<Member>) {
  const res = await fetch(`${API_URL}/api/member`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMember(id: number, data: Partial<Member>) {
  const res = await fetch(`${API_URL}/api/member/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteMember(id: number) {
  const res = await fetch(`${API_URL}/api/member/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

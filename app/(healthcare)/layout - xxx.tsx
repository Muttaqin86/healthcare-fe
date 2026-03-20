import Link from "next/link";

export default function HealthcareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="h-16 flex items-center px-6 font-bold text-xl text-emerald-600">
          Healthcare
        </div>

        <nav className="px-4 space-y-1 text-sm">
          <Link
            href="/"
            className="block px-4 py-2 rounded-md hover:bg-emerald-50 hover:text-emerald-600"
          >
            Home
          </Link>

          <Link
            href="/bootcamp"
            className="block px-4 py-2 rounded-md hover:bg-emerald-50 hover:text-emerald-600"
          >
            Bootcamp
          </Link>

          <Link
            href="/users"
            className="block px-4 py-2 rounded-md hover:bg-emerald-50 hover:text-emerald-600"
          >
            Users
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <h1 className="font-semibold text-gray-700">
            Healthcare Platform
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Hello, Muttaqin
            </span>

            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
              M
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

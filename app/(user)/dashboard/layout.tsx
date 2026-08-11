import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-10 md:flex-row">
      <aside className="md:w-56">
        <DashboardNav />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

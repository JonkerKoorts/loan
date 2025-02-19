import DashboardSidebar from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <DashboardSidebar>{children}</DashboardSidebar>
    </section>
  );
}

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="pt-20 top-20">
      {/* <AppSidebar className="pt-20" /> */}
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}

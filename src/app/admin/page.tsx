import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth-admin";

export default async function AdminIndexPage() {
  const ok = await isAdminAuthenticated();
  if (ok) {
    redirect("/organizzatori");
  }
  redirect("/admin/login");
}

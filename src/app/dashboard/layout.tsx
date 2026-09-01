import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-xl text-brand-dark">
            Skarlathy Assessoria & Eventos
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:inline">{user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <DashboardNav />
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOutIcon, FileTextIcon, BookOpenIcon, SparklesIcon } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                Teacher&apos;s Bridge
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Lesson Plans
                </Link>
                <Link
                  href="/dashboard/documents"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Documents
                </Link>
                <Link
                  href="/dashboard/generate"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  AI Generate
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  <LogOutIcon className="w-4 h-4 mr-1" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

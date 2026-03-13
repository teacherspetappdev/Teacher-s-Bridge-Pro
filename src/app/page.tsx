import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-blue-600">Teacher&apos;s Bridge</div>
          <div className="flex gap-4">
            <Link
              href="/signin"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="py-24 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Lesson Planning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create engaging lesson plans in seconds. Upload your curriculum documents 
            and let AI help you build detailed, personalized lessons.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
            >
              Start Free
            </Link>
            <Link
              href="/signin"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="py-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Generation</h3>
            <p className="text-gray-600">
              Generate complete lesson plans with objectives, activities, and materials in seconds.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Curriculum Storage</h3>
            <p className="text-gray-600">
              Upload and store your curriculum documents with AI-powered semantic search.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Lesson Plans</h3>
            <p className="text-gray-600">
              Create, organize, and manage all your lesson plans in one place.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

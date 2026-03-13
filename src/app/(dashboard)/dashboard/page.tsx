import { createClient } from "@/supabase/server";
import { getLessonPlans } from "@/lib/db/lesson-plans";
import Link from "next/link";
import { PlusIcon, ClockIcon } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const lessonPlans = await getLessonPlans(user.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
        <Link
          href="/dashboard/generate"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Lesson Plan
        </Link>
      </div>

      {lessonPlans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No lesson plans yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first lesson plan using AI or start from scratch.
          </p>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Lesson Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessonPlans.map((plan) => (
            <Link
              key={plan.id}
              href={`/dashboard/lesson-plans/${plan.id}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {plan.title}
              </h3>
              {plan.subject && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2">
                  {plan.subject}
                </span>
              )}
              {plan.grade_level && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  Grade {plan.grade_level}
                </span>
              )}
              {plan.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {plan.description}
                </p>
              )}
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <ClockIcon className="w-3 h-3 mr-1" />
                {plan.duration_minutes ? `${plan.duration_minutes} min` : "No duration"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { BookOpen, CheckCircle, Loader } from "lucide-react";

export default function CourseStatsCard({ courses = {} }) {
  const active = courses?.active || 0;
  const completed = courses?.completed || 0;
  const totalCourses = active + completed;

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900">Course Progress</h3>
        <BookOpen className="w-5 h-5 text-purple-600" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600 text-sm">Active Courses</span>
          </div>
          <span className="font-bold text-lg text-blue-600">{active}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600 text-sm">Completed</span>
          </div>
          <span className="font-bold text-lg text-green-600">{completed}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{
              width: totalCourses > 0 ? `${(courses.completed / totalCourses) * 100}%` : "0%"
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          {totalCourses > 0 
            ? `${completed} of ${totalCourses} courses completed` 
            : "No courses yet"}
        </p>
      </div>
    </div>
  );
}

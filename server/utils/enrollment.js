/**
 * Clerk sends string IDs; Mongo may store ObjectIds in enrolledCourses.
 */
export function isUserEnrolledInCourse(user, courseId) {
  if (!user?.enrolledCourses?.length) return false;
  const cid = String(courseId);
  return user.enrolledCourses.some((id) => String(id) === cid);
}

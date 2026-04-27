/**
 * Clerk bearer token for protected /api/test/* routes
 * (levels, level-questions, questions, submit, question, recommendations, analytics, …).
 */
export async function withClerkAuth(getToken, config = {}) {
  if (typeof getToken !== "function") return config;
  let token;
  try {
    token = await getToken();
  } catch {
    token = null;
  }
  if (!token) return config;
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
}

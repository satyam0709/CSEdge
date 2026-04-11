/**
 * Clerk bearer token for protected /api/test/* routes (submit, question, recommendations, …).
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

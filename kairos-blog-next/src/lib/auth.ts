// Mock auth for static export
// In production, consider using a serverless function or client-side auth

export const authOptions = {
  providers: [],
}

// Mock session for static export
export function useSession() {
  return {
    data: null,
    status: "unauthenticated",
  }
}

export function signIn() {
  console.log("Sign in not available in static export mode")
}

export function signOut() {
  console.log("Sign out not available in static export mode")
}

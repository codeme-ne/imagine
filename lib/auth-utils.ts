import { Session } from 'next-auth';

/**
 * Safely extract user ID from NextAuth session
 * Returns null if session is invalid or user ID cannot be determined
 */
export function getUserId(session: Session | null): string | null {
  if (!session?.user) {
    return null;
  }

  const user = session.user as { id?: string; email?: string };
  const userId = user.id || user.email;

  if (!userId || userId === 'unknown') {
    return null;
  }

  return userId;
}

/**
 * Validate session and get user ID, throwing an error if invalid
 */
export function requireUserId(session: Session | null): string {
  const userId = getUserId(session);
  
  if (!userId) {
    throw new Error('Unauthorized: Invalid session or user ID');
  }
  
  return userId;
}

/**
 * Check if a session is valid
 */
export function isValidSession(session: Session | null): boolean {
  return getUserId(session) !== null;
}

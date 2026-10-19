/**
 * Session lookup is off. The generate demo does not ask a backend who is signed in.
 */
export async function hasServerSession(): Promise<boolean> {
  return false;
}

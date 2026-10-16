/**
 * Asks for web push permission.
 *
 * Returns true when granted — including when the Notification API is missing
 * (Storybook, older WebViews), so the in-app toggle still works as the “or else”
 * path next to the native Android/iOS prompt.
 */
export async function requestPushNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") {
    return true;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const result = await Notification.requestPermission();
  return result === "granted";
}

export function hasPushNotificationPermission(): boolean {
  return typeof Notification !== "undefined" && Notification.permission === "granted";
}

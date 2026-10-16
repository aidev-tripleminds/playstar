const EMAIL_FORMAT_REGEX =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(value: string) {
  const email = value.trim().toLowerCase();

  if (!email || email.length > 254 || !EMAIL_FORMAT_REGEX.test(email)) {
    return false;
  }

  if (email.includes("..")) {
    return false;
  }

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain || localPart.length > 64) {
    return false;
  }

  const labels = domain.split(".");
  if (labels.length < 2) {
    return false;
  }

  // TLDs are letters-only and at least 2 characters (a hardcoded allowlist
  // can't keep up with real ccTLDs like .cy, .io, etc.).
  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return false;
  }

  return labels.every(
    (label) =>
      label.length > 0 &&
      label.length <= 63 &&
      !label.startsWith("-") &&
      !label.endsWith("-") &&
      /^[a-z0-9-]+$/.test(label),
  );
}

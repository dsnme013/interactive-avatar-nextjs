// utils/meetingLinkGenerator.ts

export interface MeetingLink {
  code: string;
  fullUrl: string;
  shortUrl: string;
  displayFormat: string;
}

export function generateMeetingCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";

  const generateSegment = (length: number): string => {
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  };

  // Google Meet format: xxx-xxxx-xxx
  return `${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`;
}

export function generateInterviewMeetingLink(baseUrl?: string): MeetingLink {
  const code = generateMeetingCode();
  const origin =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

  return {
    code,
    fullUrl: `${origin}/meet/${code}`,
    shortUrl: `/meet/${code}`,
    displayFormat: `meet/${code}`,
  };
}

export function isValidMeetingCode(code: string): boolean {
  const pattern = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

  return pattern.test(code);
}

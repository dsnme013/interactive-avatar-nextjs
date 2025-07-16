// app/meeting/[meetingCode]/page.tsx
import MeetingAccessPage from "@/components/MeetingAccessPage";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ meetingCode: string }>;
}) {
  const { meetingCode } = await params;

  return <MeetingAccessPage meetingCode={meetingCode} />;
}

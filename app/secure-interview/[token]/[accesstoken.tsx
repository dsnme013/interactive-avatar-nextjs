// /pages/secure-interview/[accessToken].tsx

import { useRouter } from "next/router";
import SecureInterviewAccessPage from "../../components/SecureInterviewAccessPage";

export default function SecureInterviewTokenPage() {
  const router = useRouter();
  const { accessToken } = router.query;

  // Wait for router to be ready and param present
  if (!router.isReady || !accessToken) return null;

  // Handles case where accessToken can be array or string
  const token = Array.isArray(accessToken) ? accessToken[0] : accessToken;

  return <SecureInterviewAccessPage accessToken={token} />;
}

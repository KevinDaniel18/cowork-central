// hooks/useNavigation.ts
import { useRouter } from "next/navigation";

export function useNavigation() {
  const router = useRouter();
  return router;
}

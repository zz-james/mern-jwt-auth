import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "../lib/api";
import { SESSIONS } from "./useSessions";
import type { Session } from "../components/SessionCard";

interface UseDeleteSessionProps {
  sessionId: string;
}

interface UseDeleteSessionReturn {
  deleteSession: () => void;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  [key: string]: any; // To account for additional properties returned by useMutation
}

const useDeleteSession = (
  sessionId: UseDeleteSessionProps["sessionId"]
): UseDeleteSessionReturn => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData<Session[]>(
        [SESSIONS],
        (cache: Session[] | undefined) =>
          (cache ?? []).filter((session: Session) => session._id !== sessionId)
      );
    },
  });
  return {
    deleteSession: mutate,
    ...rest,
  };
};

export default useDeleteSession;

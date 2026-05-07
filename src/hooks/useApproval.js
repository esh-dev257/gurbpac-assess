import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as approvalService from "../services/approval.service";

export function useApproveContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approvalService.approveContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["contentStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentContent"] });
    },
  });
}

export function useRejectContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => approvalService.rejectContent(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["contentStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentContent"] });
    },
  });
}

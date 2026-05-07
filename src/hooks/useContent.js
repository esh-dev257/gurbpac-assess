import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as contentService from "../services/content.service";

export function useContent({ teacherId, status, search, page = 1, pageSize = 10 } = {}) {
  return useQuery({
    queryKey: ["content", { teacherId, status, search, page, pageSize }],
    queryFn: () =>
      contentService.fetchContent({ teacherId, status, search, page, pageSize }),
  });
}

export function useContentStats(teacherId) {
  return useQuery({
    queryKey: ["contentStats", teacherId],
    queryFn: () => contentService.fetchContentStats(teacherId),
  });
}

export function useRecentContent({ teacherId, limit = 5 } = {}) {
  return useQuery({
    queryKey: ["recentContent", { teacherId, limit }],
    queryFn: () => contentService.fetchRecentContent({ teacherId, limit }),
  });
}

export function useLiveContent(teacherId) {
  return useQuery({
    queryKey: ["liveContent", teacherId],
    queryFn: () => contentService.fetchTeacherLiveContent(teacherId),
    refetchInterval: 30000,
    enabled: !!teacherId,
  });
}

export function useUploadContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contentService.uploadContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["contentStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentContent"] });
    },
  });
}

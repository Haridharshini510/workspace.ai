import { useMutation, useQuery } from '@tanstack/react-query';
import { gmailApi } from '@/api/gmail';
import { queryClient } from '@/lib/query-client';
import { queryKeys } from '@/lib/constants';
import { useToast } from '@/components/ui/ToastProvider';

export function useGmailSync() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: gmailApi.sync,
    onSuccess: (data) => {
      const itemsMsg = `${data.created} new items, ${data.updated} updated`;
      const commitmentsMsg = data.commitmentsGenerated > 0
        ? `, ${data.commitmentsGenerated} commitments generated`
        : '';
      showToast(
        `Gmail synced! ${itemsMsg}${commitmentsMsg}`,
        'success'
      );
      // Invalidate workspace items to show new data
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaceItems.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.commitments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline.all });
    },
    onError: (error: any) => {
      showToast(error.error || 'Failed to sync Gmail', 'error');
    },
  });
}

export function useGmailStatus() {
  return useQuery({
    queryKey: ['gmail', 'status'],
    queryFn: gmailApi.getStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

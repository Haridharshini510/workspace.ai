import { useMutation } from '@tanstack/react-query';
import { calendarApi } from '@/api/calendar';
import { queryClient } from '@/lib/query-client';
import { queryKeys } from '@/lib/constants';
import { useToast } from '@/components/ui/ToastProvider';

export function useCalendarSync() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (daysAhead?: number) => calendarApi.sync(daysAhead),
    onSuccess: (data) => {
      const itemsMsg = `${data.created} new events, ${data.updated} updated`;
      const commitmentsMsg = data.commitmentsGenerated > 0
        ? `, ${data.commitmentsGenerated} commitments generated`
        : '';
      showToast(
        `Calendar synced! ${itemsMsg}${commitmentsMsg}`,
        'success'
      );
      // Invalidate workspace items to show new data
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaceItems.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.commitments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline.all });
    },
    onError: (error: any) => {
      showToast(error.error || 'Failed to sync Calendar', 'error');
    },
  });
}

import { Calendar, RefreshCw } from 'lucide-react';
import { useCalendarSync } from '@/hooks/use-calendar';
import { Button } from '@/components/ui/Button';

export function CalendarSyncButton() {
  const { mutate: syncCalendar, isPending } = useCalendarSync();

  const handleSync = () => {
    syncCalendar(30); // Sync next 30 days
  };

  return (
    <Button
      variant="secondary"
      onClick={handleSync}
      disabled={isPending}
      title="Sync upcoming events from Google Calendar"
    >
      {isPending ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <Calendar className="h-4 w-4" />
          Sync Calendar
        </>
      )}
    </Button>
  );
}

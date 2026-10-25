import { Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { useGmailSync, useGmailStatus } from '@/hooks/use-gmail';
import { Button } from '@/components/ui/Button';

export function GmailSyncButton() {
  const { mutate: syncGmail, isPending } = useGmailSync();
  const { data: status, isLoading } = useGmailStatus();

  const handleSync = () => {
    syncGmail();
  };

  const isConnected = status?.isConnected;

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="secondary"
        onClick={handleSync}
        disabled={isPending || !isConnected}
        title={!isConnected ? 'Gmail not connected. Please sign out and sign in again.' : 'Sync emails from Gmail'}
      >
        {isPending ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Sync Gmail
          </>
        )}
      </Button>

      {!isLoading && !isConnected && (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Sign out & sign in again to enable
        </p>
      )}
    </div>
  );
}

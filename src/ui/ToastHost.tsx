import { useUiStore } from '@stores/uiStore';
import { cn } from '@utils/index';

export function ToastHost() {
  const { notifications, dismissNotification } = useUiStore();

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((message, index) => (
        <button
          key={`${message}-${index}`}
          type="button"
          onClick={() => dismissNotification(index)}
          className={cn(
            'pointer-events-auto max-w-sm rounded-lg border border-surface-600/50 bg-surface-800/90 px-4 py-3 text-left text-sm text-surface-100 shadow-lg backdrop-blur',
          )}
        >
          {message}
        </button>
      ))}
    </div>
  );
}

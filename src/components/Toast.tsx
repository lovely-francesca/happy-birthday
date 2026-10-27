import { Icon } from './Icon';

export function Toast({ message }: { message: string }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="sparkles" size={16} />
      <span>{message}</span>
    </div>
  );
}

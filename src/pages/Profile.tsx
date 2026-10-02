import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/index';

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-surface-100">Profile</h1>
        <p className="mt-1 text-surface-400">Your identity across the Skomma world.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Card title="Account details">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-surface-400">Username</dt>
              <dd className="text-surface-100">{user?.username ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-surface-400">Display name</dt>
              <dd className="text-surface-100">{user?.displayName ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-surface-400">Email</dt>
              <dd className="text-surface-100">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-surface-400">Member since</dt>
              <dd className="text-surface-100">{user ? formatDate(user.createdAt) : '—'}</dd>
            </div>
          </dl>
        </Card>
        <div>
          <Button variant="secondary">Edit profile</Button>
        </div>
      </div>
    </div>
  );
}

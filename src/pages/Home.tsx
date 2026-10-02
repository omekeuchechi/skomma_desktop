import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { healthCheck } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { useUiStore } from '@stores/uiStore';
import { ROUTES } from '@constants/index';

export function Home() {
  const { user } = useAuth();
  const { world } = useUiStore();
  const health = useQuery({ queryKey: ['health'], queryFn: healthCheck });

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-surface-100">
            Welcome back, {user?.displayName ?? user?.username ?? 'traveler'}
          </h1>
          <p className="mt-1 text-surface-400">Your 2D live stream world is ready to explore.</p>
        </div>
        <div className="flex gap-2">
          <Link to={ROUTES.world}>
            <Button>Enter the World</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Server status" description={health.data ? 'Connected' : 'Reconnecting...'}>
          <Badge tone={health.isSuccess ? 'accent' : 'danger'}>
            {health.isSuccess ? 'online' : 'offline'}
          </Badge>
        </Card>
        <Card title="World state" description="Live stream status">
          <div className="flex flex-col gap-1 text-sm text-surface-300">
            <span>
              Status: <span className="text-primary-300">{world.status}</span>
            </span>
            <span>Position: {world.currentChunk}</span>
          </div>
        </Card>
        <Card title="Quick actions" description="Jump into the world">
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTES.marketplace}>
              <Button variant="secondary" size="sm">Browse market</Button>
            </Link>
            <Link to={ROUTES.inventory}>
              <Button variant="secondary" size="sm">Inventory</Button>
            </Link>
            <Link to={ROUTES.orders}>
              <Button variant="secondary" size="sm">Orders</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Card } from '@components/Card';
import { Badge } from '@components/Badge';

const placeholderOrders = [
  { id: 'ORD-1001', item: 'Neon Headphones', status: 'delivered', total: 89 },
  { id: 'ORD-1002', item: 'Hover Skateboard', status: 'in transit', total: 240 },
];

const statusTone: Record<string, 'accent' | 'primary' | 'danger'> = {
  delivered: 'accent',
  'in transit': 'primary',
  cancelled: 'danger',
};

export function Orders() {
  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-surface-100">Orders</h1>
        <p className="mt-1 text-surface-400">Track real-world delivery of your purchases.</p>
      </div>

      <div className="flex flex-col gap-4">
        {placeholderOrders.map((order) => (
          <Card key={order.id} title={order.id} description={order.item}>
            <div className="flex items-center justify-between">
              <Badge tone={statusTone[order.status] ?? 'neutral'}>{order.status}</Badge>
              <span className="font-display text-lg font-bold text-accent-400">${order.total}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

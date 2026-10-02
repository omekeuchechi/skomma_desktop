import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';

const placeholderListings = [
  { id: '1', title: 'Neon Headphones', shop: 'Aurora Audio', price: 89 },
  { id: '2', title: 'Hover Skateboard', shop: 'Velocity Depot', price: 240 },
  { id: '3', title: 'Starfield Backpack', shop: 'Orbital Supply', price: 65 },
];

export function Marketplace() {
  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-surface-100">Marketplace</h1>
        <p className="mt-1 text-surface-400">Buy real products from shops around the world.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderListings.map((listing) => (
          <Card key={listing.id} title={listing.title} description={`Sold by ${listing.shop}`}>
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-accent-400">
                ${listing.price}
              </span>
              <Button size="sm">Buy now</Button>
            </div>
            <div className="mt-3">
              <Badge tone="primary">Digital</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

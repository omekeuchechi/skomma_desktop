import { Badge } from '@components/Badge';

const placeholderItems = [
  { id: '1', name: 'Neon Headphones', quantity: 2, slot: 'Audio' },
  { id: '2', name: 'Starlight Potion', quantity: 5, slot: 'Consumable' },
  { id: '3', name: 'Titanium Ore', quantity: 12, slot: 'Material' },
];

export function Inventory() {
  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-surface-100">Inventory</h1>
        <p className="mt-1 text-surface-400">Items you own, ready for delivery.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-900 text-surface-400">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Slot</th>
              <th className="px-4 py-3 text-right font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800">
            {placeholderItems.map((item) => (
              <tr key={item.id} className="bg-surface-900/40">
                <td className="px-4 py-3 text-surface-100">{item.name}</td>
                <td className="px-4 py-3">
                  <Badge tone="neutral">{item.slot}</Badge>
                </td>
                <td className="px-4 py-3 text-right text-surface-300">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

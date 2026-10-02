import { useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

const placeholderMessages = [
  { id: '1', author: 'aurora_supply', body: 'Free shipping on all orders today!', time: '10:02' },
  { id: '2', author: 'You', body: 'How much is delivery to EU?', time: '10:05' },
];

export function Chat() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(placeholderMessages);

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), author: 'You', body: trimmed, time: new Date().toLocaleTimeString() },
    ]);
    setDraft('');
  };

  return (
    <div className="container-page flex h-full flex-col py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-surface-100">Chat</h1>
        <p className="mt-1 text-surface-400">Talk to merchants and friends in real time.</p>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[75%] rounded-lg border border-surface-700 px-3 py-2 text-sm ${
                message.author === 'You'
                  ? 'self-end bg-primary-600/20 text-primary-200'
                  : 'self-start bg-surface-800 text-surface-200'
              }`}
            >
              <div className="mb-0.5 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-surface-400">{message.author}</span>
                <span className="text-[10px] text-surface-500">{message.time}</span>
              </div>
              {message.body}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 border-t border-surface-800 pt-4">
          <Input
            placeholder="Type a message..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') send();
            }}
          />
          <Button onClick={send} className="shrink-0">
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}

export type ChatMessageKind = 'text' | 'system' | 'trade';

export interface ChatMessage {
  id: string;
  channel: string;
  kind: ChatMessageKind;
  author: string;
  body: string;
  sentAt: string;
}

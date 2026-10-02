export interface NpcProfile {
  id: string;
  name: string;
  role: 'merchant' | 'guard' | 'citizen' | 'courier';
  shopId?: string;
}

export interface NpcSpawnRequest {
  profile: NpcProfile;
  x: number;
  z: number;
}

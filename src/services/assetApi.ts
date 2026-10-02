import http from '@network/http';

export type AssetCategory = 'sprite' | 'tile' | 'item' | 'ui' | 'background' | 'effect';

export interface AssetMetadata {
  width?: number;
  height?: number;
  frameCount?: number;
  animationSpeed?: number;
  tileSize?: number;
  isAnimated?: boolean;
}

export interface Asset {
  assetId: string;
  category: AssetCategory;
  name: string;
  url: string;
  thumbnailUrl?: string;
  version: number;
  active: boolean;
  metadata: AssetMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface AssetApiResponse {
  success: boolean;
  data: Asset[];
  message: string;
}

export interface SingleAssetApiResponse {
  success: boolean;
  data: Asset;
  message: string;
}

export async function fetchAssets(): Promise<Asset[]> {
  const response = await http.get<AssetApiResponse>('/assets');
  return response.data.data;
}

export async function fetchAssetsByCategory(category: AssetCategory): Promise<Asset[]> {
  const response = await http.get<AssetApiResponse>(`/assets/${category}`);
  return response.data.data;
}

export async function fetchAsset(category: AssetCategory, assetId: string): Promise<Asset> {
  const response = await http.get<SingleAssetApiResponse>(`/assets/${category}/${assetId}`);
  return response.data.data;
}
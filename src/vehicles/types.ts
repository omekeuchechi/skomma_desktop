export type VehicleKind = 'bike' | 'car' | 'drone' | 'hoverboard';

export interface VehicleModel {
  id: string;
  kind: VehicleKind;
  maxSpeed: number;
  cargoCapacity: number;
}

export const VEHICLE_MODELS: Record<VehicleKind, Omit<VehicleModel, 'id'>> = {
  bike: { kind: 'bike', maxSpeed: 14, cargoCapacity: 10 },
  car: { kind: 'car', maxSpeed: 24, cargoCapacity: 60 },
  drone: { kind: 'drone', maxSpeed: 18, cargoCapacity: 5 },
  hoverboard: { kind: 'hoverboard', maxSpeed: 20, cargoCapacity: 2 },
};

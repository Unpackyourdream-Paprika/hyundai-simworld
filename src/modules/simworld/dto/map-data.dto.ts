import { MapComponentType, MapSize } from '../interfaces/map-data.interface';

export interface MapComponent {
  t: number; // type
  x: number;
  y: number;
  r: number; // rotate
}

export interface OriginMapComponent {
  id: string;
  type: string; // type
  x: number;
  y: number;
  rorate: number; // rotate
  name: string;
  width: number;
  height: number;
}

export class MapDataDto {
  id: number;
  name: string;
  author: string;
  size: MapSize;
  components: Array<MapComponent>;
  origin: Array<OriginMapComponent>;
  status?: boolean;
  createdAt: Date;
}

export class MapDataResponse {
  mapData: MapDataDto[];
  pagination: {
    totalItems: number;
    totalPages: number;
  };
}

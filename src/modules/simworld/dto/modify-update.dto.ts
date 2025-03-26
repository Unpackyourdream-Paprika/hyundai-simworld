import { MapComponent, OriginMapComponent } from './map-data.dto';

export class UpdateSimworldDto {
  id: number;
  name: string;
  author: string;
  components: Array<MapComponent>;
  origin: Array<OriginMapComponent>;
}

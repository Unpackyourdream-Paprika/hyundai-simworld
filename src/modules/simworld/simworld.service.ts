import { ConnectionService } from '@modules/connection/connection.service';
import { Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MapComponent, MapDataDto, MapDataResponse } from './dto/map-data.dto';
import { UpdateSimworldDto } from './dto/modify-update.dto';

@Injectable()
export class SimworldService {
  constructor(private readonly connectionService: ConnectionService) {}

  async getAllWithMinInfo(
    page: number,
    limit: number,
  ): Promise<MapDataResponse> {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT
      id, name, author, createdAt
      , (select COUNT(id) from simworld where status = 1) as total
      FROM simworld
      WHERE status = 1
      ORDER BY id
      LIMIT ${limit} OFFSET ${offset};
    `;
    try {
      const rows = await this.connectionService.query<RowDataPacket[]>(sql);
      const total = rows.length > 0 ? rows[0].total : 0;
      return {
        mapData: rows.map(({ status, total, ...rest }) => rest) as MapDataDto[],
        pagination: {
          totalItems: total,
          totalPages: Math.ceil((total || 0) / limit),
        },
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAll(page: number, limit: number): Promise<MapDataResponse> {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT * , (select COUNT(id) from simworld where status = 1) as total
      FROM simworld
      WHERE status = 1
      ORDER BY id
      LIMIT ${limit} OFFSET ${offset};
    `;
    try {
      const rows = await this.connectionService.query<RowDataPacket[]>(sql);
      const total = rows.length > 0 ? rows[0].total : 0;
      return {
        mapData: rows.map(({ status, total, ...rest }) => rest) as MapDataDto[],
        pagination: {
          totalItems: total,
          totalPages: Math.ceil((total || 0) / limit),
        },
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getWorldById(id: number): Promise<MapDataDto> {
    const sql = `
      SELECT *
      FROM simworld
      WHERE id = ${id}
      AND status = 1
    `;
    try {
      const rows = await this.connectionService.query<RowDataPacket[]>(sql);

      if (rows.length > 0) {
        const { status, ...rest } = rows[0];
        return rest as MapDataDto;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async create(mapDataDto: MapDataDto): Promise<boolean> {
    try {
      const sqlQuery = `
        INSERT INTO simworld (name, author, size, components, origin)
        VALUES (
          "${mapDataDto.name}",
          "${mapDataDto.author}",
          "${mapDataDto.size}",
          JSON_ARRAY(
            ${mapDataDto.components
              .map((component: any) => {
                return `JSON_OBJECT(
                ${Object.entries(component)
                  .map(([key, value]) => {
                    return `'${key}', ${typeof value === 'string' ? `'${value}'` : value}`;
                  })
                  .join(', ')}
              )`;
              })
              .join(', ')}
          ),
          JSON_ARRAY(
            ${mapDataDto.origin
              .map((origin: any) => {
                return `JSON_OBJECT(
                ${Object.entries(origin)
                  .map(([key, value]) => {
                    return `'${key}', ${typeof value === 'string' ? `'${value}'` : value}`;
                  })
                  .join(', ')}
              )`;
              })
              .join(', ')}
          )
        )
      `;

      const rows =
        await this.connectionService.query<ResultSetHeader>(sqlQuery);

      if (rows.affectedRows > 0) return true;
      return false;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async forceUpdate(
    id: number,
    forceUpdateSimworldDto: UpdateSimworldDto,
  ): Promise<boolean> {
    try {
      const sqlQuery = `
      UPDATE simworld set
      name = '${forceUpdateSimworldDto.name}',
      author = '${forceUpdateSimworldDto.author}',
      components = JSON_ARRAY(
            ${forceUpdateSimworldDto.components
              .map((component: any) => {
                return `JSON_OBJECT(
                ${Object.entries(component)
                  .map(([key, value]) => {
                    return `'${key}', ${typeof value === 'string' ? `'${value}'` : value}`;
                  })
                  .join(', ')}
              )`;
              })
              .join(', ')}
          ),
        origin = JSON_ARRAY(
          ${forceUpdateSimworldDto.origin
            .map((origin: any) => {
              return `JSON_OBJECT(
              ${Object.entries(origin)
                .map(([key, value]) => {
                  return `'${key}', ${typeof value === 'string' ? `'${value}'` : value}`;
                })
                .join(', ')}
            )`;
            })
            .join(', ')}
        )
      WHERE id = ${id};
      `;

      const rows =
        await this.connectionService.query<ResultSetHeader>(sqlQuery);

      if (rows.affectedRows > 0) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async modifySimworld(
    id,
    name: string,
    author: string,
    components: MapComponent[],
  ): Promise<boolean> {
    try {
      const sqlQuery = `
      UPDATE simworld set
      name = '${name}',
      author = '${author}',
      components = JSON_ARRAY(
            ${components
              .map((component: any) => {
                return `JSON_OBJECT(
                ${Object.entries(component)
                  .map(([key, value]) => {
                    return `'${key}', ${typeof value === 'string' ? `'${value}'` : value}`;
                  })
                  .join(', ')}
              )`;
              })
              .join(', ')}
          )
      WHERE id = ${id};
      `;

      const rows =
        await this.connectionService.query<ResultSetHeader>(sqlQuery);

      if (rows.affectedRows > 0) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async softDelete(id: number): Promise<boolean> {
    try {
      const sqlQuery = `
        UPDATE simworld set status = 0
        WHERE id = ${id} AND status = 1;
      `;
      const rows =
        await this.connectionService.query<ResultSetHeader>(sqlQuery);

      if (rows.affectedRows > 0) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

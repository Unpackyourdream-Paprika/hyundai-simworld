import { ConnectionService } from '@modules/connection/connection.service';
import { Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { CustomerDto, CustomerResponse } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly connectionService: ConnectionService) {}

  async getAllCustomers(
    page: number,
    limit: number,
  ): Promise<CustomerResponse> {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT
      *
      , (select COUNT(id) from customer) as total
      FROM customer
      ORDER BY id
      LIMIT ${limit} OFFSET ${offset};
    `;

    try {
      const rows = await this.connectionService.query<RowDataPacket[]>(sql);
      const total = rows.length > 0 ? rows[0].total : 0;
      return {
        customers: rows.map(({ total, ...rest }) => rest) as CustomerDto[],
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

  async getCustomerById(id: number): Promise<CustomerDto> {
    const sql = `
      SELECT
      *
      FROM customer
      WHERE id = ${id}
    `;

    try {
      const rows = await this.connectionService.query<RowDataPacket[]>(sql);
      return rows.length > 0 ? (rows[0] as CustomerDto) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCustomersByNameWithPage(
    name: string,
    page: number,
    limit: number,
  ): Promise<CustomerResponse> {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT
      *
      , (select COUNT(id) from customer WHERE name = '${name}') as total
      FROM customer
      WHERE name = '${name}'
      ORDER BY id
      LIMIT ${limit} OFFSET ${offset};
    `;

    try {
      const rows = await this.connectionService.query<RowDataPacket[]>(sql);
      const total = rows.length > 0 ? rows[0].total : 0;
      return {
        customers: rows.map(({ total, ...rest }) => rest) as CustomerDto[],
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

  async createCustomer(customerDto: CustomerDto): Promise<any> {
    const sql = `
      INSERT INTO customer (
        name, age, gender, city, county, carNum,
        isBuyCarTwoYear, hasExperienceNewSkill, yearlyDistance,
        totalDistance, skillful, purpose, newSkillInfo, carInfo
      ) VALUES (
        '${customerDto.name}', ${customerDto.age}, '${customerDto.gender}', '${customerDto.city}', '${customerDto.county}', ${customerDto.carNum},
        ${customerDto.isBuyCarTwoyear}, ${customerDto.hasExperienceNewSkill}, ${customerDto.yearlyDistance},
        ${customerDto.totalDistance}, ${customerDto.skillful},

        JSON_OBJECT( ${Object.entries(customerDto.purpose)
          .map(([key, value]) => {
            if (typeof value == 'string') return `'${key}', '${value}'`;
            else return `'${key}', ${value}`;
          })
          .join(', ')}
          ),

        JSON_OBJECT(
          ${Object.entries(customerDto.newSkillInfo)
            .map(([key, value]) => `'${key}', ${value}`)
            .join(', ')}
        ),

        JSON_ARRAY(
          ${customerDto.carInfo.map((info) => {
            return `JSON_OBJECT(
              ${Object.entries(info)
                .map(
                  ([key, value]) =>
                    `'${key}', ${typeof value === 'string' ? `'${value}'` : value}`,
                )
                .join(', ')}
            )`;
          })}
        )
      );
    `;
    try {
      const rows = await this.connectionService.query<ResultSetHeader>(sql);
      rows.affectedRows; // 에러 캐치용용
      if (rows && rows.affectedRows > 0) return 1;
    } catch (error) {
      if (error.code == 'ER_BAD_FIELD_ERROR') {
        return -1; // 잘못된 dto 에러
      } else {
        console.log(error);
      }
      return -2;
    }
  }
}

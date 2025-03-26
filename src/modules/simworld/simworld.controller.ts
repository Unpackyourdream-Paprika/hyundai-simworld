import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MapComponent, MapDataDto } from './dto/map-data.dto';
import { SimworldService } from './simworld.service';
import { UpdateSimworldDto } from './dto/modify-update.dto';
import { TcpService } from '@modules/tcp/tcp.service';
import { PacketId } from '@modules/packet-handler/interface/packet-id.interface';

@Controller('simworld')
export class SimworldController {
  constructor(
    private readonly simworldService: SimworldService,
    private readonly tcpService: TcpService,
  ) {}

  @Post('')
  async simworldTest(@Body() body: any) {
    if (!body) return;

    const now = new Date();
    now.setHours(now.getHours() + 9);

    const formattedDate = now
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
      .replace(/:/g, '-');

    const fileName = `${formattedDate}.json`;
    const filePath = path.join(__dirname, '../../../../test_files', fileName);

    try {
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
      return {
        success: true,
        message: 'Success data.',
        data: {
          saveTime: now,
        },
      };
    } catch (error) {
      console.error('파일 저장 중 오류 발생:', error);
      return {
        success: false,
        message: 'Invalid data.',
      };
    }
  }

  @Get('')
  async getAllSimworlds(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.simworldService.getAllWithMinInfo(page, limit);

    return {
      success: data ? true : false,
      message: `${data ? 'Success' : 'Fail'} Get worlds`,
      data,
    };
  }

  @Get('/all')
  async getAllSimworldsWithDetail(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.simworldService.getAll(page, limit);

    return {
      success: data ? true : false,
      message: `${data ? 'Success' : 'Fail'} Get worlds`,
      data,
    };
  }

  @Get('/:id')
  async getSimworldById(@Param('id') id: number) {
    const data = await this.simworldService.getWorldById(id);

    return {
      success: data ? true : false,
      message: `${data ? 'Success' : 'Fail'} Get worlds`,
      data: {
        mapData: data,
      },
    };
  }

  @Post('/create')
  async createSimworld(@Body() mapDataDto: MapDataDto) {
    const create = await this.simworldService.create(mapDataDto);
    if (create) {
      return {
        success: true,
        message: 'Success Create worlds',
      };
    }

    return {
      success: false,
      message: 'Fail Create worlds',
      data: {
        mapData: mapDataDto,
      },
    };
  }

  @Post('/modify/:id/force')
  async forceModifySimworld(
    @Param('id') id: number,
    @Body() forceUpdateSimworldDto: UpdateSimworldDto,
  ) {
    const getSimworld = await this.simworldService.getWorldById(id);
    if (!getSimworld) {
      return {
        success: false,
        message: 'Not Exist World',
      };
    }

    const forceUpdate = await this.simworldService.forceUpdate(
      id,
      forceUpdateSimworldDto,
    );

    return {
      success: forceUpdate ? true : false,
      message: `${forceUpdate ? 'Success' : 'Fail'} Modify worlds`,
    };
  }

  // @Post('/modify/:id/')
  // async modifySimworld(
  //   @Param('id') id: number,
  //   @Body() modifySimworldDto: UpdateSimworldDto,
  // ) {
  //   const getSimworld = await this.simworldService.getWorldById(id);
  //   if (!getSimworld) {
  //     return {
  //       success: false,
  //       message: 'Not Exist World',
  //     };
  //   }

  //   getSimworld.components = getSimworld.components.map(
  //     (component: MapComponent, idx: number) => {
  //       const isExist = modifySimworldDto.components.find(
  //         (com) => com.id == component.id,
  //       );
  //       if (isExist) {
  //         return isExist;
  //       }
  //       return component;
  //     },
  //   );

  //   const modifySimworld = await this.simworldService.modifySimworld(
  //     id,
  //     modifySimworldDto.name,
  //     modifySimworldDto.author,
  //     getSimworld.components,
  //   );

  //   return {
  //     success: modifySimworld ? true : false,
  //     message: `${modifySimworld ? 'Success' : 'Fail'} Modify worlds`,
  //   };
  // }

  @Delete('/delete/:id')
  async deleteSimworld(@Param('id') id: number) {
    const softDelete = await this.simworldService.softDelete(id);

    return {
      success: softDelete ? true : false,
      message: `${softDelete ? 'Success' : 'Fail'} Delete worlds`,
    };
  }

  @Post('/start/:id')
  async startSimworld(@Param('id') id: number) {
    const simworld = await this.simworldService.getWorldById(id);
    if (!simworld) {
      return {
        success: false,
        message: 'World not exist.',
      };
    }

    this.tcpService.sendToClient(
      PacketId.SEND_SIMWORLD_START,
      JSON.stringify(simworld),
      null,
    );

    return {
      success: true,
      message: 'Success send to UE',
    };
  }
}

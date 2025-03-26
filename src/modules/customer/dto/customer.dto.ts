import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export interface CustomerCarInfo {
  brand: string;
  name: string;
  year: number;
}

export interface CustomerNewSkillInfo {
  HDA2: number;
  SCC: number;
  NSCC: number;
  RSPA: number;
  HUB: number;
}

// export interface CustomerPurpose{
//   work: boolean;
//   vacation: boolean;
//   offroad: boolean;
//   camp: boolean;
//   sports: boolean;
//   fish: boolean;
//   etc: string;
// }

export class CustomerPurpose {
  @IsDefined()
  @IsBoolean()
  work: boolean;

  @IsDefined()
  @IsBoolean()
  vacation: boolean;

  @IsDefined()
  @IsBoolean()
  offroad: boolean;

  @IsDefined()
  @IsBoolean()
  camp: boolean;

  @IsDefined()
  @IsBoolean()
  sports: boolean;

  @IsDefined()
  @IsBoolean()
  fish: boolean;

  @IsDefined()
  @IsString()
  etc: string;
}

export class CustomerDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: 'male' | 'female';

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  county?: string;

  @IsNumber()
  carNum: number;

  @IsArray()
  carInfo: CustomerCarInfo[];

  @IsBoolean()
  isBuyCarTwoyear: boolean;

  @IsBoolean()
  hasExperienceNewSkill: boolean;

  @IsArray()
  newSkillInfo: CustomerNewSkillInfo;

  @ValidateNested()
  @Type(() => CustomerPurpose)
  purpose: CustomerPurpose;

  @IsNumber()
  yearlyDistance: number;

  @IsNumber()
  totalDistance: number;

  @IsNumber()
  skillful: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

export class CustomerResponse {
  customers: CustomerDto[];
  pagination: {
    totalItems: number;
    totalPages: number;
  };
}

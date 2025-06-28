import { IsString, IsOptional, IsArray, IsDateString, IsEnum } from 'class-validator';
import { ProjectStatus } from '../project.schema';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsArray()
    memberIds?: string[];

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}

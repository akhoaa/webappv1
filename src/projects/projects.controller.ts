import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Post()
    create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
        return this.projectsService.create(dto, user.userId);
    }

    @Get()
    findUserProjects(@CurrentUser() user: any) {
        return this.projectsService.findUserProjects(user.userId);
    }

    @Get(':id')
    findById(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectsService.findById(id, user.userId);
    }

    @Get(':id/analytics')
    getAnalytics(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectsService.getProjectAnalytics(id, user.userId);
    }

    @Patch(':id/progress')
    updateProgress(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectsService.updateProgress(id);
    }
}
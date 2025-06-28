// src/tasks/tasks.controller.ts
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
        return this.tasksService.create(dto, user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@CurrentUser() user: any) {
        return this.tasksService.findByUser(user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getById(@Param('id') id: string, @CurrentUser() user: any) {
        return this.tasksService.getById(id, user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: CreateTaskDto, @CurrentUser() user: any) {
        return this.tasksService.update(id, dto, user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @CurrentUser() user: any) {
        return this.tasksService.delete(id, user.userId);
    }
}

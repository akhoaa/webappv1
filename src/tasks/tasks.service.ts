// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    async create(dto: CreateTaskDto, userId: string) {
        const task = new this.taskModel({
            ...dto,
            user: userId,
        });
        return task.save();
    }

    async findByUser(userId: string) {
        return this.taskModel.find({ user: userId });
    }

    async getById(id: string, userId: string) {
        const task = await this.taskModel.findOne({ _id: id, user: userId });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, dto: CreateTaskDto, userId: string) {
        const updated = await this.taskModel.findOneAndUpdate(
            { _id: id, user: userId },
            dto,
            { new: true },
        );
        if (!updated) throw new NotFoundException('Task not found or not yours');
        return updated;
    }

    async delete(id: string, userId: string) {
        const deleted = await this.taskModel.findOneAndDelete({
            _id: id,
            user: userId,
        });
        if (!deleted) throw new NotFoundException('Task not found or not yours');
        return { message: 'Deleted successfully' };
    }
}

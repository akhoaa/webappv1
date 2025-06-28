import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { Task, TaskDocument } from '../tasks/task.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) { }

    async create(dto: CreateProjectDto, ownerId: string) {
        const project = new this.projectModel({
            ...dto,
            owner: ownerId,
            members: [ownerId, ...(dto.memberIds || [])],
        });
        return project.save();
    }

    async findUserProjects(userId: string) {
        return this.projectModel
            .find({
                $or: [{ owner: userId }, { members: userId }],
            })
            .populate('owner', 'username email')
            .populate('members', 'username email')
            .sort({ updatedAt: -1 });
    }

    async findById(id: string, userId: string) {
        const project = await this.projectModel
            .findById(id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Check if user has access
        const hasAccess =
            (project.owner as any)._id.toString() === userId ||
            project.members.some(member => (member as any)._id.toString() === userId);

        if (!hasAccess) {
            throw new ForbiddenException('Access denied');
        }

        return project;
    }

    async updateProgress(projectId: string) {
        const totalTasks = await this.taskModel.countDocuments({ project: projectId });
        const completedTasks = await this.taskModel.countDocuments({
            project: projectId,
            status: 'completed',
        });

        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return this.projectModel.findByIdAndUpdate(
            projectId,
            { totalTasks, completedTasks, progress },
            { new: true },
        );
    }

    async getProjectAnalytics(projectId: string, userId: string) {
        // Verify access
        await this.findById(projectId, userId);

        const [
            tasksByStatus,
            tasksByPriority,
            overdueTasks,
            teamWorkload,
        ] = await Promise.all([
            this.getTasksByStatus(projectId),
            this.getTasksByPriority(projectId),
            this.getOverdueTasks(projectId),
            this.getTeamWorkload(projectId),
        ]);

        return {
            tasksByStatus,
            tasksByPriority,
            overdueTasks: overdueTasks.length,
            teamWorkload,
            lastUpdated: new Date(),
        };
    }

    private async getTasksByStatus(projectId: string) {
        return this.taskModel.aggregate([
            { $match: { project: projectId } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
    }

    private async getTasksByPriority(projectId: string) {
        return this.taskModel.aggregate([
            { $match: { project: projectId } },
            { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]);
    }

    private async getOverdueTasks(projectId: string) {
        return this.taskModel.find({
            project: projectId,
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' },
        });
    }

    private async getTeamWorkload(projectId: string) {
        return this.taskModel.aggregate([
            { $match: { project: projectId } },
            {
                $group: {
                    _id: '$assignee',
                    activeTasks: {
                        $sum: {
                            $cond: [{ $ne: ['$status', 'completed'] }, 1, 0]
                        }
                    },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                        }
                    },
                    totalHours: { $sum: '$estimatedHours' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    username: '$user.username',
                    activeTasks: 1,
                    completedTasks: 1,
                    totalHours: 1
                }
            }
        ]);
    }
}

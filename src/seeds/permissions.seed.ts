import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { PermissionSeederService } from './permission-seeder.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seeder = app.get(PermissionSeederService);
    await seeder.run();
    await app.close();
}
bootstrap();

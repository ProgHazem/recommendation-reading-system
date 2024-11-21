import { AppModule } from '@App/app.module';
import { seedData } from '@App/database/seeders/seed-data';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

async function runSeeder() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  try {
    const dataSource = appContext.get(DataSource);

    await seedData(dataSource);
  } finally {
    await appContext.close();
  }
}

runSeeder()
  .then(async () => {
    console.log('Seeder executed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running seeder:', error);
    process.exit(1);
  });

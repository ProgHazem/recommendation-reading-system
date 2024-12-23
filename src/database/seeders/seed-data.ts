import { DataSource } from 'typeorm';
import { admins } from '@App/database/seeders/admins_seeders';
import * as crypto from 'crypto';
import { User } from '@App/modules/auth/entities/user.entity';

export async function seedData(dataSource: DataSource): Promise<void> {
  const AdminRepository = dataSource.getRepository(User);

  // Check if PASSWORD_SALT is set in environment variables
  const salt = process.env.PASSWORD_SALT;
  if (!salt) {
    throw new Error('PASSWORD_SALT environment variable is not set.');
  }

  try {
    for (const admin of admins) {
      // Hash the password using PBKDF2
      const hash = crypto
        .pbkdf2Sync(admin.password, salt, 1000, 64, 'sha256')
        .toString('hex');

      // Assign the hashed password back to admin object
      admin.password = hash;

      // Perform the upsert operation (insert or update)
      await AdminRepository.upsert(admin, { conflictPaths: ['id'] });
    }
  } catch (error) {
    console.error('Error seeding Admins:', error.message);
    throw error; // Propagate the error after logging
  }
}

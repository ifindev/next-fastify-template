import { db, pool } from './config/drizzle.config';
import * as schema from './schemas/db';

// Export all database-related entities
export { db, pool, schema };

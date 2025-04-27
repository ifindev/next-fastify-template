# Drizzle ORM Implementation

This project uses Drizzle ORM for database access. Drizzle is a TypeScript ORM that provides a convenient way to interact with SQL databases.

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── drizzle.config.ts - Drizzle configuration and connection
│   ├── schemas/
│   │   ├── users.schema.ts - User schema definition
│   │   ├── files.schema.ts - File schema definition
│   │   └── index.ts - Exports all schemas
│   ├── repositories/
│   │   ├── interfaces/ - Repository interfaces
│   │   │   ├── user-repository.interface.ts
│   │   │   ├── file-repository.interface.ts
│   │   │   └── index.ts
│   │   ├── user.repository.ts - User repository implementation
│   │   ├── file.repository.ts - File repository implementation
│   │   └── index.ts - Exports repositories and interfaces
│   ├── services/ - Service layer that uses repositories
│   └── db.ts - Main database export file
├── drizzle/ - Generated migration files
├── scripts/
│   ├── migrate.ts - Script to run migrations
│   └── seed.ts - Script to seed the database
└── drizzle.config.ts - Drizzle CLI configuration
```

## Architecture

The application follows a layered architecture:

1. **Schema Layer**: Defines the database structure using Drizzle's schema definition syntax.
2. **Repository Layer**: Encapsulates database operations and provides a high-level API for accessing data.
3. **Service Layer**: Contains business logic and uses repositories for data access.
4. **Controller Layer**: Handles HTTP requests and uses services to perform operations.

## Usage

### Migrations

To generate and apply migrations:

```bash
# Generate migrations from schema changes
npm run drizzle:generate

# Push schema changes directly to the database (development only)
npm run drizzle:push

# Apply migrations
npm run drizzle:migrate
```

### Seeding

To seed the database with initial data:

```bash
npm run drizzle:seed
```

### Database Studio

To view and edit data using Drizzle Studio:

```bash
npm run drizzle:studio
```

## Repository Pattern

This application follows the repository pattern:

- **Repository Interfaces**: Define contracts for data access operations.
- **Repository Implementations**: Implement the interfaces using Drizzle ORM.
- **Services**: Use repositories for data access rather than directly accessing the database.

This approach provides several benefits:

1. **Separation of Concerns**: The data access layer is separate from the business logic.
2. **Testability**: Services can be tested with mock repositories.
3. **Flexibility**: The database implementation can be changed without affecting the business logic.

## Creating a New Repository

1. **Define the schema**:

    ```typescript
    // src/schemas/example.schema.ts
    import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

    export const examples = pgTable('examples', {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar('name', { length: 255 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    });

    export type Example = typeof examples.$inferSelect;
    export type NewExample = typeof examples.$inferInsert;
    ```

2. **Create the repository interface**:

    ```typescript
    // src/repositories/interfaces/example-repository.interface.ts
    import { Example, NewExample } from '../../schemas/example.schema';

    export interface IExampleRepository {
        createExample(data: NewExample): Promise<Example>;
        findById(id: string): Promise<Example | null>;
        // Add other methods as needed
    }
    ```

3. **Implement the repository**:

    ```typescript
    // src/repositories/example.repository.ts
    import { eq } from 'drizzle-orm';
    import { Example, NewExample, examples } from '../schemas';
    import { db } from '../config/drizzle.config';
    import { IExampleRepository } from './interfaces';

    export class ExampleRepository implements IExampleRepository {
        async createExample(data: NewExample): Promise<Example> {
            const result = await db.insert(examples).values(data).returning();
            return result[0];
        }

        async findById(id: string): Promise<Example | null> {
            const result = await db.select().from(examples).where(eq(examples.id, id));
            return result[0] || null;
        }

        // Implement other methods
    }
    ```

4. **Export the repository instance**:

    ```typescript
    // src/repositories/index.ts
    import { ExampleRepository } from './example.repository';

    export const exampleRepository = new ExampleRepository();
    export * from './interfaces';
    export { ExampleRepository };
    ```

5. **Create a service that uses the repository**:

    ```typescript
    // src/services/example.service.ts
    import { IExampleRepository } from '../repositories/interfaces';
    import { exampleRepository } from '../repositories';
    import { Example, NewExample } from '../schemas';

    export class ExampleService {
        private exampleRepository: IExampleRepository;

        constructor(repo: IExampleRepository = exampleRepository) {
            this.exampleRepository = repo;
        }

        async createExample(data: NewExample): Promise<Example> {
            return this.exampleRepository.createExample(data);
        }

        // Implement other methods
    }
    ```

## After Schema Changes

When you make changes to the schema:

1. Generate migrations:

    ```bash
    npm run drizzle:generate
    ```

2. Apply the migrations:
    ```bash
    npm run drizzle:migrate
    ```

## Environment Variables

Make sure to set the following environment variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

-- Migration for refresh_tokens table
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "token" varchar(500) NOT NULL UNIQUE,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx" ON "refresh_tokens" ("user_id"); 
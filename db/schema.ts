import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const searches = sqliteTable('searches', {id:text('id').primaryKey(),token:text('token').notNull(),createdAt:text('created_at').notNull(),payload:text('payload').notNull()});
export const trials = sqliteTable('trials', {id:text('id').primaryKey(),searchId:text('search_id').notNull(),createdAt:text('created_at').notNull(),payload:text('payload').notNull()});

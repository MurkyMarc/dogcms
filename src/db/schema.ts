import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
} from 'drizzle-orm/pg-core';

// Enums
export const Role = {
  CUSTOMER: 'customer',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

// Tables
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  bio: text('bio').default(''),
  city: varchar('city', { length: 255 }).default(''),
  createdAt: timestamp('created_at').defaultNow(),
  credits: integer('credits').default(0),
  emergencyPhone1: varchar('emergency_phone_1', { length: 20 }).default(''),
  emergencyPhone2: varchar('emergency_phone_2', { length: 20 }).default(''),
  fName: varchar('f_name', { length: 255 }).default(''),
  image: text('image').default(''),
  lName: varchar('l_name', { length: 255 }).default(''),
  phone: varchar('phone', { length: 20 }).default(''),
  role: text('role').default('customer').$type<RoleType>(),
  state: varchar('state', { length: 2 }).default(''),
  street: text('street').default(''),
  updatedAt: timestamp('updated_at').defaultNow(),
  zip: varchar('zip', { length: 10 }).default(''),
});

export const dogs = pgTable('dogs', {
  id: integer('id').primaryKey(),
  age: integer('age').default(0),
  bio: text('bio').default(''),
  breed: varchar('breed', { length: 255 }).default(''),
  createdAt: timestamp('created_at').defaultNow(),
  dob: timestamp('dob').notNull(),
  groupWalks: boolean('group_walks').default(true),
  image: text('image').default(''),
  name: varchar('name', { length: 255 }).default(''),
  notes: text('notes').default(''),
  owner: text('owner').references(() => profiles.id),
  sex: varchar('sex', { length: 10 }).default(''),
  updatedAt: timestamp('updated_at').defaultNow(),
  weight: integer('weight').default(0),
});

export const walks = pgTable('walks', {
  id: integer('id').primaryKey(),
  adminNotes: text('admin_notes').default(''),
  city: varchar('city', { length: 255 }).default(''),
  customer: text('customer').references(() => profiles.id),
  end: timestamp('end').notNull(),
  lat: text('lat').default(''),
  long: text('long').default(''),
  notes: text('notes').default(''),
  price: numeric('price').default('0'),
  start: timestamp('start').notNull(),
  state: varchar('state', { length: 2 }).default(''),
  status: varchar('status', { length: 50 }).default('pending'),
  street: text('street').default(''),
  walker: text('walker').references(() => profiles.id),
  zip: varchar('zip', { length: 10 }).default(''),
});

export const dogWalks = pgTable('dog_walks', {
  id: integer('id').primaryKey(),
  dog: integer('dog').references(() => dogs.id),
  walk: integer('walk').references(() => walks.id),
});

export const conversations = pgTable('conversations', {
  id: integer('id').primaryKey(),
  archived: boolean('archived').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  customer: text('customer').references(() => profiles.id),
  customerLastViewedAt: timestamp('customer_last_viewed_at').defaultNow(),
  customerUnreadCount: integer('customer_unread_count').default(0),
  employee: text('employee').references(() => profiles.id),
  employeeLastViewedAt: timestamp('employee_last_viewed_at').defaultNow(),
  employeeUnreadCount: integer('employee_unread_count').default(0),
  lastMessage: text('last_message').default(''),
  lastMessageAt: timestamp('last_message_at'),
  lastMessageSender: text('last_message_sender'),
  walkId: integer('walk_id').references(() => walks.id),
});

export const messages = pgTable('messages', {
  id: integer('id').primaryKey(),
  content: text('content').default(''),
  conversationId: integer('conversation_id').references(() => conversations.id),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
  pic: text('pic').default(''),
  senderId: text('sender_id').references(() => profiles.id),
});

export const servicePrices = pgTable('service_prices', {
  id: integer('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  creditCost: integer('credit_cost').default(0),
  description: text('description').default(''),
  durationMinutes: integer('duration_minutes').default(0),
  effectiveDate: timestamp('effective_date').defaultNow(),
  expiryDate: timestamp('expiry_date'),
  isActive: boolean('is_active').default(true),
  isDiscounted: boolean('is_discounted').default(false),
  serviceType: varchar('service_type', { length: 255 }).default(''),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  dogs: many(dogs),
  walksAsCustomer: many(walks, { relationName: 'customerWalks' }),
  walksAsWalker: many(walks, { relationName: 'walkerWalks' }),
  conversationsAsCustomer: many(conversations, { relationName: 'customerConversations' }),
  conversationsAsEmployee: many(conversations, { relationName: 'employeeConversations' }),
  messages: many(messages),
}));

export const dogsRelations = relations(dogs, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [dogs.owner],
    references: [profiles.id],
  }),
  dogWalks: many(dogWalks),
}));

export const walksRelations = relations(walks, ({ one, many }) => ({
  customer: one(profiles, {
    fields: [walks.customer],
    references: [profiles.id],
  }),
  walker: one(profiles, {
    fields: [walks.walker],
    references: [profiles.id],
  }),
  dogWalks: many(dogWalks),
  conversations: many(conversations),
}));

export const dogWalksRelations = relations(dogWalks, ({ one }) => ({
  dog: one(dogs, {
    fields: [dogWalks.dog],
    references: [dogs.id],
  }),
  walk: one(walks, {
    fields: [dogWalks.walk],
    references: [walks.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  customer: one(profiles, {
    fields: [conversations.customer],
    references: [profiles.id],
  }),
  employee: one(profiles, {
    fields: [conversations.employee],
    references: [profiles.id],
  }),
  walk: one(walks, {
    fields: [conversations.walkId],
    references: [walks.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(profiles, {
    fields: [messages.senderId],
    references: [profiles.id],
  }),
}));
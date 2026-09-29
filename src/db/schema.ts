import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  timestamp,
  jsonb,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("analyst"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  mine: varchar("mine", { length: 100 }),
  documentType: varchar("document_type", { length: 50 }),
  year: integer("year"),
  filePath: text("file_path"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  status: varchar("status", { length: 30 }).default("pending"),
  confidence: real("confidence"),
  extractedData: jsonb("extracted_data"),
  uploadedBy: integer("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentPages = pgTable("document_pages", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  pageNumber: integer("page_number").notNull(),
  content: text("content"),
  ocrText: text("ocr_text"),
});

export const entities = pgTable("entities", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  value: text("value"),
  page: integer("page"),
  section: varchar("section", { length: 255 }),
  confidence: real("confidence"),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id"),
  mine: varchar("mine", { length: 100 }),
  metricType: varchar("metric_type", { length: 50 }),
  value: real("value"),
  unit: varchar("unit", { length: 20 }),
  year: integer("year"),
  confidence: real("confidence"),
  sourceDocument: varchar("source_document", { length: 255 }),
  sourcePage: integer("source_page"),
  sourceSection: varchar("source_section", { length: 255 }),
});

export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id"),
  value: text("value"),
  sourceDocument: varchar("source_document", { length: 255 }),
  page: integer("page"),
  section: varchar("section", { length: 255 }),
  table: varchar("table", { length: 255 }),
  confidence: real("confidence"),
  context: text("context"),
});

export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  question: text("question"),
  answer: text("answer"),
  evidence: jsonb("evidence"),
  chartData: jsonb("chart_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conflicts = pgTable("conflicts", {
  id: serial("id").primaryKey(),
  metric: varchar("metric", { length: 255 }),
  mine: varchar("mine", { length: 100 }),
  year: integer("year"),
  source1Document: varchar("source1_document", { length: 255 }),
  source1Value: text("source1_value"),
  source1Page: integer("source1_page"),
  source1Confidence: real("source1_confidence"),
  source2Document: varchar("source2_document", { length: 255 }),
  source2Value: text("source2_value"),
  source2Page: integer("source2_page"),
  source2Confidence: real("source2_confidence"),
  status: varchar("status", { length: 30 }).default("pending"),
  resolvedBy: integer("resolved_by"),
  resolvedValue: text("resolved_value"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  frequency: integer("frequency"),
  relatedDocuments: jsonb("related_documents"),
  category: varchar("category", { length: 50 }),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  mine: varchar("mine", { length: 100 }),
  yearFrom: integer("year_from"),
  yearTo: integer("year_to"),
  reportType: varchar("report_type", { length: 50 }),
  content: jsonb("content"),
  status: varchar("status", { length: 30 }).default("draft"),
  generatedBy: integer("generated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull(),
  reviewerId: integer("reviewer_id"),
  sectionIndex: integer("section_index"),
  status: varchar("status", { length: 30 }).default("pending"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
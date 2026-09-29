import mongoose, { Schema, Model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 50 },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, default: 'analyst', maxlength: 20 },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', UserSchema);

const DocumentSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  mine: { type: String, maxlength: 100 },
  documentType: { type: String, maxlength: 50 },
  year: { type: Number },
  filePath: { type: String },
  fileSize: { type: Number },
  mimeType: { type: String, maxlength: 100 },
  status: { type: String, default: 'pending', maxlength: 30 },
  confidence: { type: Number },
  extractedData: { type: Schema.Types.Mixed },
  uploadedBy: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Document = mongoose.model('Document', DocumentSchema);

const DocumentPageSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId, required: true },
  pageNumber: { type: Number, required: true },
  content: { type: String },
  ocrText: { type: String },
});

export const DocumentPage = mongoose.model('DocumentPage', DocumentPageSchema);

const EntitySchema = new Schema({
  documentId: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, required: true, maxlength: 50 },
  name: { type: String, required: true, maxlength: 255 },
  value: { type: String },
  page: { type: Number },
  section: { type: String, maxlength: 255 },
  confidence: { type: Number },
});

export const Entity = mongoose.model('Entity', EntitySchema);

const MetricSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId },
  mine: { type: String, maxlength: 100 },
  metricType: { type: String, maxlength: 50 },
  value: { type: Number },
  unit: { type: String, maxlength: 20 },
  year: { type: Number },
  confidence: { type: Number },
  sourceDocument: { type: String, maxlength: 255 },
  sourcePage: { type: Number },
  sourceSection: { type: String, maxlength: 255 },
});

export const Metric = mongoose.model('Metric', MetricSchema);

const EvidenceSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId },
  value: { type: String },
  sourceDocument: { type: String, maxlength: 255 },
  page: { type: Number },
  section: { type: String, maxlength: 255 },
  table: { type: String, maxlength: 255 },
  confidence: { type: Number },
  context: { type: String },
});

export const Evidence = mongoose.model('Evidence', EvidenceSchema);

const QuerySchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  question: { type: String },
  answer: { type: String },
  evidence: { type: Schema.Types.Mixed },
  chartData: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const Query = mongoose.model('Query', QuerySchema);

const ConflictSchema = new Schema({
  metric: { type: String, maxlength: 255 },
  mine: { type: String, maxlength: 100 },
  year: { type: Number },
  source1Document: { type: String, maxlength: 255 },
  source1Value: { type: String },
  source1Page: { type: Number },
  source1Confidence: { type: Number },
  source2Document: { type: String, maxlength: 255 },
  source2Value: { type: String },
  source2Page: { type: Number },
  source2Confidence: { type: Number },
  status: { type: String, default: 'pending', maxlength: 30 },
  resolvedBy: { type: Schema.Types.ObjectId },
  resolvedValue: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Conflict = mongoose.model('Conflict', ConflictSchema);

const TopicSchema = new Schema({
  name: { type: String, maxlength: 100 },
  frequency: { type: Number },
  relatedDocuments: { type: Schema.Types.Mixed },
  category: { type: String, maxlength: 50 },
});

export const Topic = mongoose.model('Topic', TopicSchema);

const ReportSchema = new Schema({
  title: { type: String, maxlength: 255 },
  mine: { type: String, maxlength: 100 },
  yearFrom: { type: Number },
  yearTo: { type: Number },
  reportType: { type: String, maxlength: 50 },
  content: { type: Schema.Types.Mixed },
  status: { type: String, default: 'draft', maxlength: 30 },
  generatedBy: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model('Report', ReportSchema);

const ReviewSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, required: true },
  reviewerId: { type: Schema.Types.ObjectId },
  sectionIndex: { type: Number },
  status: { type: String, default: 'pending', maxlength: 30 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model('Review', ReviewSchema);
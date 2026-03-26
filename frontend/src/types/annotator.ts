// src/types/annotator.ts

export type { ServiceResponse } from "../services/authService";

export interface AnnotatorTaskSummary {
  id: string;
  projectId: string;
  dataItemId: string;
  status: string;
  assignedAt?: string | null;
}

export interface AnnotatorTaskDetail extends AnnotatorTaskSummary {}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export interface Annotation {
  id: string;
  labelId: string;
  geometryData: any; 
}

export interface AnnotatorAnnotation extends Annotation {
  taskId: string;
}

export interface AISuggestion {
  id: string;
  labelId: string;
  geometryData: any;
  confidence: number;
}

// FIX: Thêm runId và đổi predictions thành objects để khớp với code component
export interface AiAssistSuggestResponse {
  runId: string;
  objects: AISuggestion[];
}

// FIX: Thêm interface này để fix lỗi TS2305
export interface AnnotatorReviewFeedbackResponse {
  id: string;
  score: number;
  comment: string;
  categories: {
    errorTypeId: string;
    errorName: string;
  }[];
}

export interface AnnotatorTaskItem {
  id: string;
  taskId: string;
  content: string;
  contentType: string;
}

// FIX: Thêm yoloClassId
export interface LabelResponse {
  id: string;
  name: string;
  color: string;
  projectId: string;
  yoloClassId: number; 
}

export interface ProjectGuideline {
  projectId: string;
  guideline: string;
}

export interface UpsertTaskAnnotationsPayload {
  annotations: Partial<Annotation>[];
}
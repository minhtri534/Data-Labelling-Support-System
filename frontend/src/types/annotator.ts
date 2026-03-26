import type { ServiceResponse } from "../services/authService";

export { type ServiceResponse };

export interface AnnotatorTaskSummary {
  id: string;
  projectId: string;
  dataItemId: string;
  status: string;
  assignedAt?: string | null;
}

export interface AnnotatorTaskDetail extends AnnotatorTaskSummary {
  // Add any additional detail fields if necessary
}

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

export interface AiAssistSuggestResponse {
  predictions: AISuggestion[];
}

export interface ReviewFeedback {
  id: string;
  comment: string;
  createdAt: string;
  errorCategories: {
    id: string;
    name: string;
  }[];
}

export interface AnnotatorTaskItem {
  id: string;
  taskId: string;
  content: string;
  contentType: string;
}

export interface LabelResponse {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface ProjectGuideline {
  projectId: string;
  guideline: string;
}

export interface UpsertTaskAnnotationsPayload {
  annotations: Partial<Annotation>[];
}

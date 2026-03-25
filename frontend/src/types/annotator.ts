export interface ServiceResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  errors: string[];
}

export interface AnnotatorTaskSummary {
  id: string;
  projectId: string;
  dataItemId: string;
  status: string;
  assignedAt?: string | null;
  completedAt?: string | null;
}

export interface AnnotatorTaskItem {
  taskId: string;
  dataItemId: string;
  storageProvider: string;
  objectKey: string;
  originalWidth: number;
  originalHeight: number;
}

export interface LabelResponse {
  id: string;
  name: string;
  yoloClassId: number;
}

export interface AnnotatorAnnotation {
  id: string;
  labelId: string;
  geometryData: any; // Can be string or object
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
}

export interface AnnotatorReviewErrorCategoryResponse {
  errorTypeId: string;
  errorName: string;
  description?: string | null;
}

export interface AnnotatorReviewFeedbackResponse {
  id: string;
  annotationSetId: string;
  result: string;
  score: number;
  comment?: string | null;
  reviewedAt: string;
  categories: AnnotatorReviewErrorCategoryResponse[];
}

export interface AddReviewerCommentRequest {
  comment: string;
}

export interface RejectAiSuggestionRequest {
  reason: string;
}

export interface ProjectGuideline {
  projectId: string;
  guideline?: string | null;
}

export interface AnnotationObjectPayload {
  labelId: string;
  geometryData: {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface UpsertTaskAnnotationsPayload {
  objects: AnnotationObjectPayload[];
  predictionId?: string;
}

export interface AiAssistSuggestionObject {
  labelId: string;
  confidence: number;
  geometryData: string;
}

export interface AiAssistSuggestResponse {
  runId: string;
  provider: string;
  model: string;
  confidenceThreshold: number;
  originalWidth: number;
  originalHeight: number;
  objects: AiAssistSuggestionObject[];
}
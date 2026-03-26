export interface ReviewTaskSummary {
  id: string;
  projectId: string;
  dataItemId: string;
  status: string;
  submittedAt?: string | null;
}

export interface ReviewAnnotation {
  id: string;
  labelId: string;
  geometryData: any;
}

export interface SubmitReviewRequest {
  isApproved: boolean;
  errorTypeIds?: string[];
  comment?: string;
}

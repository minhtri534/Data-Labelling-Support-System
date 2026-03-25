export interface ServiceResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// Project Types
export interface ProjectResponse {
  id: string;
  name: string;
  guideline?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  guideline?: string;
  status?: number;
}

export interface UpdateProjectRequest {
  name: string;
  guideline?: string;
  status?: number;
}

// Dataset Types
export interface DatasetResponse {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface DataItemResponse {
  id: string;
  datasetId: string;
  objectKey: string;
  dataType: string;
  originalWidth: number;
  originalHeight: number;
  status: string;
  createdAt: string;
}

export interface CreateDatasetRequest {
  projectId: string;
  name: string;
}

export interface UpdateDatasetRequest {
  name: string;
}

export interface UploadDatasetItemDto {
  objectKey: string;
  originalWidth: number;
  originalHeight: number;
  dataType?: string;
  checksum?: string;
  storageProvider?: string;
}

export interface UploadDatasetItemsRequest {
  datasetId: string;
  items: UploadDatasetItemDto[];
}

export interface UploadDatasetItemsResponse {
  datasetId: string;
  createdCount: number;
}

export interface ImportDatasetFromExternalRequest {
  datasetId: string;
  sourceName: string;
  items: UploadDatasetItemDto[];
}

// Dataset Version Types
export interface DatasetVersionResponse {
  id: string;
  datasetId: string;
  versionNumber: number;
  createdAt: string;
  createdByUserId: string;
}

export interface CreateDatasetVersionRequest {
  datasetId: string;
}

// Label Types
export interface LabelResponse {
  id: string;
  projectId: string;
  name: string;
  yoloClassId: number;
  categoryId?: string;
  annotationTypeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabelRequest {
  projectId: string;
  name: string;
  yoloClassId: number;
  categoryId?: string;
  annotationTypeId?: string;
}

export interface UpdateLabelRequest {
  name: string;
  yoloClassId: number;
  categoryId?: string;
  annotationTypeId?: string;
}

// Label Category Types
export interface LabelCategoryResponse {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabelCategoryRequest {
  projectId: string;
  name: string;
  description?: string;
}

export interface UpdateLabelCategoryRequest {
  name: string;
  description?: string;
}

// Annotation Type Types
export interface AnnotationTypeResponse {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnotationTypeRequest {
  projectId: string;
  name: string;
  description?: string;
}

export interface UpdateAnnotationTypeRequest {
  name: string;
  description?: string;
}

// Task Types
export interface TaskResponse {
  id: string;
  projectId: string;
  dataItemId: string;
  annotatorId: string;
  assignedByUserId?: string;
  status: string;
  assignedAt?: string;
  completedAt?: string;
}

export interface CreateTaskRequest {
  projectId: string;
  dataItemId: string;
  annotatorId: string;
}

export interface AssignTaskRequest {
  annotatorId: string;
}

export interface BulkAssignTasksRequest {
  taskIds: string[];
  annotatorId: string;
}

export interface RequestRelabelingRequest {
  reason: string;
}

// Task Monitoring Types
export interface TaskProgressResponse {
  projectId: string;
  total: number;
  assigned: number;
  inProgress: number;
  submitted: number;
  completed: number;
  paused: number;
  cancelled: number;
  rework: number;
}

export interface TaskHistoryResponse {
  id: string;
  taskId: string;
  oldStatus?: string;
  newStatus?: string;
  changedByUserId: string;
  changedAt: string;
}

// Monitoring & QA Types
export interface LabelingProgressOverviewResponse {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  submittedTasks: number;
  activeTasks: number;
}

export interface AnnotatorPerformanceResponse {
  annotatorId: string;
  annotatorEmail: string;
  assignedTasks: number;
  submittedTasks: number;
  completedTasks: number;
}

export interface ReviewStatisticsResponse {
  projectId: string;
  totalReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageScore: number;
}

export interface InconsistentLabelResponse {
  annotationId: string;
  taskId: string;
  labelId: string;
  issue: string;
}

export interface QualityReportResponse {
  progress: LabelingProgressOverviewResponse;
  reviewStats: ReviewStatisticsResponse;
  inconsistentLabelsCount: number;
}

export interface ExportValidationResponse {
  projectId: string;
  submittedAnnotationSets: number;
  reviewedAnnotationSets: number;
  isValid: boolean;
}

// Export Types
export interface ExportConfigResponse {
  parameters?: unknown;
}

export interface ExportResponse {
  id: string;
  projectId: string;
  projectName: string;
  format: string;
  exportedByUserId: string;
  exportedByEmail: string;
  exportPath: string;
  createdAt: string;
  config: ExportConfigResponse;
}

export interface CreateExportRequest {
  projectId: string;
  format: string;
  config?: ExportConfigResponse;
}

export interface ExportDownloadInfoResponse {
  exportId: string;
  storageProvider: string;
  objectKey: string;
  fileName: string;
}

// Project Role Types
export interface UserProjectRoleResponse {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  assignedAt: string;
}

export interface AssignUserProjectRoleRequest {
  projectId: string;
  userId: string;
  role: string;
}

// Project Guideline Types
export interface UpdateProjectGuidelineRequest {
  guideline?: string;
}

// Activity Log Types
export interface ActivityLogResponse {
  id: string;
  projectId?: string;
  userId: string;
  action: string;
  description?: string;
  createdAt: string;
}

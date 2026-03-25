import api from '../lib/axios';
<<<<<<< Updated upstream
import type // Project
{
    // Project
    ProjectResponse,
    CreateProjectRequest,
    UpdateProjectRequest,
    UserProjectRoleResponse,
    AssignUserProjectRoleRequest,
    // Dataset
    DatasetResponse,
    DataItemResponse,
    CreateDatasetRequest,
    UpdateDatasetRequest,
    UploadDatasetItemsRequest,
    UploadDatasetItemsResponse,
    ImportDatasetFromExternalRequest,
    DatasetVersionResponse,
    CreateDatasetVersionRequest,
    // Label
    LabelResponse,
    CreateLabelRequest,
    UpdateLabelRequest,
    LabelCategoryResponse,
    CreateLabelCategoryRequest,
    UpdateLabelCategoryRequest,
    AnnotationTypeResponse,
    CreateAnnotationTypeRequest,
    UpdateAnnotationTypeRequest,
    // Task
    TaskResponse,
    CreateTaskRequest,
    AssignTaskRequest,
    BulkAssignTasksRequest,
    RequestRelabelingRequest,
    TaskProgressResponse,
    TaskHistoryResponse,
    UpdateProjectGuidelineRequest,
    // Monitoring
    LabelingProgressOverviewResponse,
    AnnotatorPerformanceResponse,
    ReviewStatisticsResponse,
    InconsistentLabelResponse,
    QualityReportResponse,
    ExportValidationResponse,
    // Export
    ExportResponse,
    CreateExportRequest,
    // Activity
    ActivityLogResponse,
    ServiceResponse,
} from '../types/manager';

const API_BASE = '/manager';

// ==================== PROJECT ENDPOINTS ====================

export const projectService = {
  // Get all projects
  getProjects: async (): Promise<ServiceResponse<ProjectResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects`);
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId: string): Promise<ServiceResponse<ProjectResponse>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}`);
    return response.data;
  },

  // Create project
  createProject: async (request: CreateProjectRequest): Promise<ServiceResponse<ProjectResponse>> => {
    const response = await api.post(`${API_BASE}/projects`, request);
    return response.data;
  },

  // Update project
  updateProject: async (projectId: string, request: UpdateProjectRequest): Promise<ServiceResponse<ProjectResponse>> => {
    const response = await api.put(`${API_BASE}/projects/${projectId}`, request);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<ServiceResponse<boolean>> => {
    const response = await api.delete(`${API_BASE}/projects/${projectId}`);
    return response.data;
  },

  // Change project status
  changeProjectStatus: async (projectId: string, request: UpdateProjectRequest): Promise<ServiceResponse<ProjectResponse>> => {
    const response = await api.patch(`${API_BASE}/projects/${projectId}/status`, request);
    return response.data;
  },

  // Archive project
  archiveProject: async (projectId: string): Promise<ServiceResponse<ProjectResponse>> => {
    const response = await api.post(`${API_BASE}/projects/${projectId}/archive`);
    return response.data;
  },

  // Update project guideline
  updateGuideline: async (projectId: string, request: UpdateProjectGuidelineRequest): Promise<ServiceResponse<ProjectResponse>> => {
    const response = await api.patch(`${API_BASE}/projects/${projectId}/guideline`, request);
    return response.data;
  },
};

// ==================== PROJECT ROLE ENDPOINTS ====================

export const projectRoleService = {
  // Assign user to project with role
  assignUserProjectRole: async (request: AssignUserProjectRoleRequest): Promise<ServiceResponse<UserProjectRoleResponse>> => {
    const response = await api.post(`${API_BASE}/project-roles`, request);
    return response.data;
  },

  // Get all project roles
  getProjectRoles: async (projectId: string): Promise<ServiceResponse<UserProjectRoleResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/project-roles`);
    return response.data;
  },
};

// ==================== DATASET ENDPOINTS ====================

export const datasetService = {
  // Create dataset
  createDataset: async (request: CreateDatasetRequest): Promise<ServiceResponse<DatasetResponse>> => {
    const response = await api.post(`${API_BASE}/datasets`, request);
    return response.data;
  },

  // Get all datasets in a project
  getDatasets: async (projectId: string): Promise<ServiceResponse<DatasetResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/datasets`);
    return response.data;
  },

  // Get dataset by ID
  getDatasetById: async (datasetId: string): Promise<ServiceResponse<DatasetResponse>> => {
    const response = await api.get(`${API_BASE}/datasets/${datasetId}`);
    return response.data;
  },

  // Update dataset
  updateDataset: async (datasetId: string, request: UpdateDatasetRequest): Promise<ServiceResponse<DatasetResponse>> => {
    const response = await api.put(`${API_BASE}/datasets/${datasetId}`, request);
    return response.data;
  },

  // Delete dataset
  deleteDataset: async (datasetId: string): Promise<ServiceResponse<boolean>> => {
    const response = await api.delete(`${API_BASE}/datasets/${datasetId}`);
    return response.data;
  },

  // Upload dataset items (JSON data)
  uploadDataset: async (request: UploadDatasetItemsRequest): Promise<ServiceResponse<UploadDatasetItemsResponse>> => {
    const response = await api.post(`${API_BASE}/datasets/upload`, request);
    return response.data;
  },

  // Upload dataset files (multipart form data)
  uploadDatasetFiles: async (datasetId: string, files: File[]): Promise<ServiceResponse<UploadDatasetItemsResponse>> => {
    const formData = new FormData();
    formData.append('datasetId', datasetId);
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post(`${API_BASE}/datasets/upload-files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Import dataset from external source
  importDatasetExternal: async (request: ImportDatasetFromExternalRequest): Promise<ServiceResponse<UploadDatasetItemsResponse>> => {
    const response = await api.post(`${API_BASE}/datasets/import-external`, request);
    return response.data;
  },
};

// ==================== DATASET VERSION ENDPOINTS ====================

export const datasetVersionService = {
  // Create dataset version
  createDatasetVersion: async (request: CreateDatasetVersionRequest): Promise<ServiceResponse<DatasetVersionResponse>> => {
    const response = await api.post(`${API_BASE}/dataset-versions`, request);
    return response.data;
  },

  // Get dataset versions
  getDatasetVersions: async (datasetId: string): Promise<ServiceResponse<DatasetVersionResponse[]>> => {
    const response = await api.get(`${API_BASE}/datasets/${datasetId}/versions`);
    return response.data;
  },

  // Restore dataset version
  restoreDatasetVersion: async (versionId: string): Promise<ServiceResponse<DatasetVersionResponse>> => {
    const response = await api.post(`${API_BASE}/dataset-versions/${versionId}/restore`);
    return response.data;
  },
};

// ==================== LABEL ENDPOINTS ====================

export const labelService = {
  // Create label
  createLabel: async (request: CreateLabelRequest): Promise<ServiceResponse<LabelResponse>> => {
    const response = await api.post(`${API_BASE}/labels`, request);
    return response.data;
  },

  // Get all labels in a project
  getLabels: async (projectId: string): Promise<ServiceResponse<LabelResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/labels`);
    return response.data;
  },

  // Update label
  updateLabel: async (labelId: string, request: UpdateLabelRequest): Promise<ServiceResponse<LabelResponse>> => {
    const response = await api.put(`${API_BASE}/labels/${labelId}`, request);
    return response.data;
  },

  // Delete label
  deleteLabel: async (labelId: string): Promise<ServiceResponse<boolean>> => {
    const response = await api.delete(`${API_BASE}/labels/${labelId}`);
    return response.data;
  },
};

// ==================== LABEL CATEGORY ENDPOINTS ====================

export const labelCategoryService = {
  // Create label category
  createLabelCategory: async (request: CreateLabelCategoryRequest): Promise<ServiceResponse<LabelCategoryResponse>> => {
    const response = await api.post(`${API_BASE}/label-categories`, request);
    return response.data;
  },

  // Get all label categories in a project
  getLabelCategories: async (projectId: string): Promise<ServiceResponse<LabelCategoryResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/label-categories`);
    return response.data;
  },

  // Update label category
  updateLabelCategory: async (categoryId: string, request: UpdateLabelCategoryRequest): Promise<ServiceResponse<LabelCategoryResponse>> => {
    const response = await api.put(`${API_BASE}/label-categories/${categoryId}`, request);
    return response.data;
  },

  // Delete label category
  deleteLabelCategory: async (categoryId: string): Promise<ServiceResponse<boolean>> => {
    const response = await api.delete(`${API_BASE}/label-categories/${categoryId}`);
    return response.data;
  },
};

// ==================== ANNOTATION TYPE ENDPOINTS ====================

export const annotationTypeService = {
  // Create annotation type
  createAnnotationType: async (request: CreateAnnotationTypeRequest): Promise<ServiceResponse<AnnotationTypeResponse>> => {
    const response = await api.post(`${API_BASE}/annotation-types`, request);
    return response.data;
  },

  // Get all annotation types in a project
  getAnnotationTypes: async (projectId: string): Promise<ServiceResponse<AnnotationTypeResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/annotation-types`);
    return response.data;
  },

  // Update annotation type
  updateAnnotationType: async (annotationTypeId: string, request: UpdateAnnotationTypeRequest): Promise<ServiceResponse<AnnotationTypeResponse>> => {
    const response = await api.put(`${API_BASE}/annotation-types/${annotationTypeId}`, request);
    return response.data;
  },

  // Delete annotation type
  deleteAnnotationType: async (annotationTypeId: string): Promise<ServiceResponse<boolean>> => {
    const response = await api.delete(`${API_BASE}/annotation-types/${annotationTypeId}`);
    return response.data;
  },
};

// ==================== TASK ENDPOINTS ====================

export const taskService = {
  // Create task
  createTask: async (request: CreateTaskRequest): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks`, request);
    return response.data;
  },

  // Assign task (single)
  assignTask: async (taskId: string, request: AssignTaskRequest): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks/${taskId}/assign`, request);
    return response.data;
  },

  // Assign tasks (bulk)
  bulkAssignTasks: async (request: BulkAssignTasksRequest): Promise<ServiceResponse<number>> => {
    const response = await api.post(`${API_BASE}/tasks/bulk-assign`, request);
    return response.data;
  },

  // Reassign task
  reassignTask: async (taskId: string, request: AssignTaskRequest): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks/${taskId}/reassign`, request);
    return response.data;
  },

  // Pause task
  pauseTask: async (taskId: string): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks/${taskId}/pause`);
    return response.data;
  },

  // Resume task
  resumeTask: async (taskId: string): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks/${taskId}/resume`);
    return response.data;
  },

  // Cancel task
  cancelTask: async (taskId: string): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks/${taskId}/cancel`);
    return response.data;
  },

  // Request relabeling
  requestRelabeling: async (taskId: string, request: RequestRelabelingRequest): Promise<ServiceResponse<TaskResponse>> => {
    const response = await api.post(`${API_BASE}/tasks/${taskId}/relabel`, request);
    return response.data;
  },

  // Get task progress
  getTaskProgress: async (projectId: string): Promise<ServiceResponse<TaskProgressResponse>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/tasks/progress`);
    return response.data;
  },

  // Get task history
  getTaskHistory: async (taskId: string): Promise<ServiceResponse<TaskHistoryResponse[]>> => {
    const response = await api.get(`${API_BASE}/tasks/${taskId}/history`);
    return response.data;
  },
};

// ==================== MONITORING ENDPOINTS ====================

export const monitoringService = {
  // Get labeling progress overview
  getLabelingOverview: async (projectId: string): Promise<ServiceResponse<LabelingProgressOverviewResponse>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/monitoring/overview`);
    return response.data;
  },

  // Get annotator performance
  getAnnotatorPerformance: async (projectId: string): Promise<ServiceResponse<AnnotatorPerformanceResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/monitoring/annotator-performance`);
    return response.data;
  },

  // Get review statistics
  getReviewStats: async (projectId: string): Promise<ServiceResponse<ReviewStatisticsResponse>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/monitoring/review-stats`);
    return response.data;
  },

  // Get inconsistent labels
  getInconsistentLabels: async (projectId: string): Promise<ServiceResponse<InconsistentLabelResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/monitoring/inconsistent-labels`);
    return response.data;
  },

  // Get quality report
  getQualityReport: async (projectId: string): Promise<ServiceResponse<QualityReportResponse>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/monitoring/quality-report`);
    return response.data;
  },
};

// ==================== EXPORT ENDPOINTS ====================

export const exportService = {
  // Create export
  createExport: async (request: CreateExportRequest): Promise<ServiceResponse<ExportResponse>> => {
    const response = await api.post(`${API_BASE}/exports`, request);
    return response.data;
  },

  // Get project exports
  getProjectExports: async (projectId: string): Promise<ServiceResponse<ExportResponse[]>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/exports`);
    return response.data;
  },

  // Validate approved data
  validateApprovedData: async (projectId: string): Promise<ServiceResponse<ExportValidationResponse>> => {
    const response = await api.get(`${API_BASE}/projects/${projectId}/exports/validate`);
    return response.data;
  },

  // Download export file
  downloadExport: async (exportId: string) => {
    const response = await api.get(`${API_BASE}/exports/${exportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ==================== ACTIVITY LOG ENDPOINTS ====================

export const activityLogService = {
  // Get activity logs
  getActivityLogs: async (
    projectId?: string,
    userId?: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ServiceResponse<ActivityLogResponse[]>> => {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (userId) params.append('userId', userId);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await api.get(`${API_BASE}/activity-logs?${params.toString()}`);
    return response.data;
  },
};

// ==================== COMBINED EXPORTS ====================

export const managerService = {
  // Projects
  project: projectService,
  projectRole: projectRoleService,
  // Datasets
  dataset: datasetService,
  datasetVersion: datasetVersionService,
  // Labels
  label: labelService,
  labelCategory: labelCategoryService,
  annotationType: annotationTypeService,
  // Tasks
  task: taskService,
  // Monitoring
  monitoring: monitoringService,
  // Exports
  export: exportService,
  // Activity
  activityLog: activityLogService,
=======
import type { ServiceResponse } from './authService';

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
}

export interface UpdateProjectRequest {
  name: string;
  guideline?: string;
  status?: number;
}

export interface DatasetResponse {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDatasetRequest {
  projectId: string;
  name: string;
}

export interface ManagerLabelResponse {
  id: string;
  projectId: string;
  name: string;
  yoloClassId: number;
  createdAt: string;
}

export interface CreateLabelRequest {
  projectId: string;
  name: string;
  yoloClassId: number;
}

export interface CreateTaskRequest {
  projectId: string;
  datasetId: string;
  dataItemId: string;
  annotatorId: string;
}

export const managerService = {
  // Projects
  async getProjects(): Promise<ServiceResponse<ProjectResponse[]>> {
    const response = await api.get<ServiceResponse<ProjectResponse[]>>('/manager/projects');
    return response.data;
  },

  async getProjectById(projectId: string): Promise<ServiceResponse<ProjectResponse>> {
    const response = await api.get<ServiceResponse<ProjectResponse>>(`/manager/projects/${projectId}`);
    return response.data;
  },

  async createProject(data: CreateProjectRequest): Promise<ServiceResponse<ProjectResponse>> {
    const response = await api.post<ServiceResponse<ProjectResponse>>('/manager/projects', data);
    return response.data;
  },

  async updateProject(projectId: string, data: UpdateProjectRequest): Promise<ServiceResponse<ProjectResponse>> {
    const response = await api.put<ServiceResponse<ProjectResponse>>(`/manager/projects/${projectId}`, data);
    return response.data;
  },

  async deleteProject(projectId: string): Promise<ServiceResponse<boolean>> {
    const response = await api.delete<ServiceResponse<boolean>>(`/manager/projects/${projectId}`);
    return response.data;
  },

  async archiveProject(projectId: string): Promise<ServiceResponse<ProjectResponse>> {
    const response = await api.post<ServiceResponse<ProjectResponse>>(`/manager/projects/${projectId}/archive`);
    return response.data;
  },

  // Project Roles
  async getProjectRoles(projectId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/projects/${projectId}/project-roles`);
    return response.data;
  },

  async assignProjectRole(data: { projectId: string; userId: string; roleName: string }): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/project-roles', data);
    return response.data;
  },

  // Datasets
  async getDatasets(projectId: string): Promise<ServiceResponse<DatasetResponse[]>> {
    const response = await api.get<ServiceResponse<DatasetResponse[]>>(`/manager/projects/${projectId}/datasets`);
    return response.data;
  },

  async getDatasetById(datasetId: string): Promise<ServiceResponse<DatasetResponse>> {
    const response = await api.get<ServiceResponse<DatasetResponse>>(`/manager/datasets/${datasetId}`);
    return response.data;
  },

  async createDataset(data: CreateDatasetRequest): Promise<ServiceResponse<DatasetResponse>> {
    const response = await api.post<ServiceResponse<DatasetResponse>>('/manager/datasets', data);
    return response.data;
  },

  async updateDataset(datasetId: string, data: { name: string }): Promise<ServiceResponse<DatasetResponse>> {
    const response = await api.put<ServiceResponse<DatasetResponse>>(`/manager/datasets/${datasetId}`, data);
    return response.data;
  },

  async deleteDataset(datasetId: string): Promise<ServiceResponse<boolean>> {
    const response = await api.delete<ServiceResponse<boolean>>(`/manager/datasets/${datasetId}`);
    return response.data;
  },

  async uploadDatasetFiles(datasetId: string, files: File[]): Promise<ServiceResponse<any>> {
    const formData = new FormData();
    formData.append('datasetId', datasetId);
    files.forEach(file => formData.append('files', file));

    const response = await api.post<ServiceResponse<any>>('/manager/datasets/upload-files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async uploadDatasetItems(data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/datasets/upload', data);
    return response.data;
  },

  async importDatasetExternal(data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/datasets/import-external', data);
    return response.data;
  },

  async restoreDatasetVersion(versionId: string): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/dataset-versions/${versionId}/restore`);
    return response.data;
  },

  // Labels
  async getLabels(projectId: string): Promise<ServiceResponse<ManagerLabelResponse[]>> {
    const response = await api.get<ServiceResponse<ManagerLabelResponse[]>>(`/manager/projects/${projectId}/labels`);
    return response.data;
  },

  async createLabel(data: CreateLabelRequest): Promise<ServiceResponse<ManagerLabelResponse>> {
    const response = await api.post<ServiceResponse<ManagerLabelResponse>>('/manager/labels', data);
    return response.data;
  },

  async updateLabel(labelId: string, data: any): Promise<ServiceResponse<ManagerLabelResponse>> {
    const response = await api.put<ServiceResponse<ManagerLabelResponse>>(`/manager/labels/${labelId}`, data);
    return response.data;
  },

  async deleteLabel(labelId: string): Promise<ServiceResponse<boolean>> {
    const response = await api.delete<ServiceResponse<boolean>>(`/manager/labels/${labelId}`);
    return response.data;
  },

  // Label Categories
  async createLabelCategory(data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/label-categories', data);
    return response.data;
  },

  async getLabelCategories(projectId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/projects/${projectId}/label-categories`);
    return response.data;
  },

  async updateLabelCategory(categoryId: string, data: any): Promise<ServiceResponse<any>> {
    const response = await api.put<ServiceResponse<any>>(`/manager/label-categories/${categoryId}`, data);
    return response.data;
  },

  async deleteLabelCategory(categoryId: string): Promise<ServiceResponse<boolean>> {
    const response = await api.delete<ServiceResponse<boolean>>(`/manager/label-categories/${categoryId}`);
    return response.data;
  },

  // Annotation Types
  async createAnnotationType(data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/annotation-types', data);
    return response.data;
  },

  async getAnnotationTypes(projectId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/projects/${projectId}/annotation-types`);
    return response.data;
  },

  async updateAnnotationType(annotationTypeId: string, data: any): Promise<ServiceResponse<any>> {
    const response = await api.put<ServiceResponse<any>>(`/manager/annotation-types/${annotationTypeId}`, data);
    return response.data;
  },

  async deleteAnnotationType(annotationTypeId: string): Promise<ServiceResponse<boolean>> {
    const response = await api.delete<ServiceResponse<boolean>>(`/manager/annotation-types/${annotationTypeId}`);
    return response.data;
  },

  // Guideline
  async updateGuideline(projectId: string, guideline: string): Promise<ServiceResponse<ProjectResponse>> {
    const response = await api.patch<ServiceResponse<ProjectResponse>>(`/manager/projects/${projectId}/guideline`, { guideline });
    return response.data;
  },

  // Tasks
  async createTask(data: CreateTaskRequest): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/tasks', data);
    return response.data;
  },

  async assignTask(taskId: string, data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/tasks/${taskId}/assign`, data);
    return response.data;
  },

  async bulkAssignTasks(data: any): Promise<ServiceResponse<number>> {
    const response = await api.post<ServiceResponse<number>>('/manager/tasks/bulk-assign', data);
    return response.data;
  },

  async reassignTask(taskId: string, data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/tasks/${taskId}/reassign`, data);
    return response.data;
  },

  async pauseTask(taskId: string): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/tasks/${taskId}/pause`);
    return response.data;
  },

  async resumeTask(taskId: string): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/tasks/${taskId}/resume`);
    return response.data;
  },

  async cancelTask(taskId: string): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/tasks/${taskId}/cancel`);
    return response.data;
  },

  async requestRelabeling(taskId: string, data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>(`/manager/tasks/${taskId}/relabel`, data);
    return response.data;
  },

  async getTaskProgress(projectId: string): Promise<ServiceResponse<any>> {
    const response = await api.get<ServiceResponse<any>>(`/manager/projects/${projectId}/tasks/progress`);
    return response.data;
  },

  async getTaskHistory(taskId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/tasks/${taskId}/history`);
    return response.data;
  },

  // Monitoring
  async getLabelingOverview(projectId: string): Promise<ServiceResponse<any>> {
    const response = await api.get<ServiceResponse<any>>(`/manager/projects/${projectId}/monitoring/overview`);
    return response.data;
  },

  async getAnnotatorPerformance(projectId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/projects/${projectId}/monitoring/annotator-performance`);
    return response.data;
  },

  async getReviewStats(projectId: string): Promise<ServiceResponse<any>> {
    const response = await api.get<ServiceResponse<any>>(`/manager/projects/${projectId}/monitoring/review-stats`);
    return response.data;
  },

  async getInconsistentLabels(projectId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/projects/${projectId}/monitoring/inconsistent-labels`);
    return response.data;
  },

  async getQualityReport(projectId: string): Promise<ServiceResponse<any>> {
    const response = await api.get<ServiceResponse<any>>(`/manager/projects/${projectId}/monitoring/quality-report`);
    return response.data;
  },

  // Dataset Versions
  async getDatasetVersions(datasetId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/datasets/${datasetId}/versions`);
    return response.data;
  },

  // Exports
  async createExport(data: any): Promise<ServiceResponse<any>> {
    const response = await api.post<ServiceResponse<any>>('/manager/exports', data);
    return response.data;
  },

  async getProjectExports(projectId: string): Promise<ServiceResponse<any[]>> {
    const response = await api.get<ServiceResponse<any[]>>(`/manager/projects/${projectId}/exports`);
    return response.data;
  },

  async validateApprovedData(projectId: string): Promise<ServiceResponse<any>> {
    const response = await api.get<ServiceResponse<any>>(`/manager/projects/${projectId}/exports/validate`);
    return response.data;
  },

  async downloadExport(exportId: string): Promise<void> {
    const response = await api.get(`/manager/exports/${exportId}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export-${exportId}.zip`); // Default filename
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  },

  // Activity Logs
  async getActivityLogs(projectId?: string, userId?: string, page = 1, pageSize = 50): Promise<ServiceResponse<any[]>> {
    const params = { projectId, userId, page, pageSize };
    const response = await api.get<ServiceResponse<any[]>>('/manager/activity-logs', { params });
    return response.data;
  }
>>>>>>> Stashed changes
};

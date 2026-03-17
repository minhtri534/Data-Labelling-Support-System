import api from "../lib/axios";
import type {
  AiAssistSuggestResponse,
  AnnotatorAnnotation,
  AnnotatorTaskItem,
  AnnotatorTaskSummary,
  LabelResponse,
  ProjectGuideline,
  ServiceResponse,
  UpsertTaskAnnotationsPayload,
} from "../types/annotator";

export const annotatorService = {
  async getMyTasks() {
    const res = await api.get<ServiceResponse<AnnotatorTaskSummary[]>>("/annotator/tasks");
    return res.data;
  },

  async startTask(taskId: string) {
    const res = await api.post<ServiceResponse<boolean>>(`/annotator/tasks/${taskId}/start`);
    return res.data;
  },

  async getTaskItems(taskId: string) {
    const res = await api.get<ServiceResponse<AnnotatorTaskItem[]>>(`/annotator/tasks/${taskId}/items`);
    return res.data;
  },

  async getLabels(taskId: string) {
    const res = await api.get<ServiceResponse<LabelResponse[]>>(`/annotator/tasks/${taskId}/labels`);
    return res.data;
  },

  async getGuideline(taskId: string) {
    const res = await api.get<ServiceResponse<ProjectGuideline>>(`/annotator/tasks/${taskId}/guideline`);
    return res.data;
  },

  async getAnnotations(taskId: string) {
    const res = await api.get<ServiceResponse<AnnotatorAnnotation[]>>(`/annotator/tasks/${taskId}/annotations`);
    return res.data;
  },

  async saveDraft(taskId: string, data: UpsertTaskAnnotationsPayload) {
    const res = await api.put<ServiceResponse<boolean>>(`/annotator/tasks/${taskId}/annotations/draft`, data);
    return res.data;
  },

  async submit(taskId: string, data: UpsertTaskAnnotationsPayload) {
    const res = await api.post<ServiceResponse<boolean>>(`/annotator/tasks/${taskId}/annotations/submit`, data);
    return res.data;
  },

  async suggestAi(taskId: string, apply = false) {
    const res = await api.post<ServiceResponse<AiAssistSuggestResponse>>(
      `/annotator/tasks/${taskId}/ai-suggest?apply=${apply}`
    );
    return res.data;
  },

  async getImageSecure(taskId: string): Promise<Blob> {
    const res = await api.get(`/annotator/tasks/${taskId}/data-item/content`, { responseType: "blob" });
    return res.data as Blob;
  },
};
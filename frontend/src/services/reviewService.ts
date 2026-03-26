import api from "../lib/axios";
import type { ServiceResponse } from "./authService";
import type { 
  ReviewTaskSummary, 
  ReviewAnnotation, 
  SubmitReviewRequest 
} from "../types/review";

export const reviewService = {
  async getTasks() {
    const res = await api.get<ServiceResponse<ReviewTaskSummary[]>>("/reviews/tasks");
    return res.data;
  },

  async getAnnotations(taskId: string) {
    const res = await api.get<ServiceResponse<ReviewAnnotation[]>>(`/reviews/tasks/${taskId}/annotations`);
    return res.data;
  },

  async submitReview(taskId: string, data: SubmitReviewRequest) {
    const res = await api.post<ServiceResponse<boolean>>(`/reviews/tasks/${taskId}/submit`, data);
    return res.data;
  },
};

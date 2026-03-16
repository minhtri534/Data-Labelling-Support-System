import api from "../lib/axios"

export const annotatorService = {
  async getMyTasks() {
    const res = await api.get('/annotator/tasks')
    return res.data
  },

  async getTaskItems(taskId: string) {
    const res = await api.get(`/annotator/tasks/${taskId}/items`)
    return res.data
  },

  async getAnnotations(taskItemId: string) {
    const res = await api.get(`/annotator/task-items/${taskItemId}/annotations`)
    return res.data
  },

  async getLabels(taskId: string) {
    const res = await api.get(`/annotator/tasks/${taskId}/labels`)
    return res.data
  },

  async saveDraft(taskItemId: string, data: any) {
    const res = await api.put(`/annotator/task-items/${taskItemId}/annotations/draft`, data)
    return res.data
  },

  async submit(taskItemId: string, data: any) {
    const res = await api.post(`/annotator/task-items/${taskItemId}/annotations/submit`, data)
    return res.data
  },

  getImageUrl(taskItemId: string) {
    return `${api.defaults.baseURL}/annotator/task-items/${taskItemId}/data-item/content`; 
  },

  async getImageSecure(taskItemId: string): Promise<Blob> {
    const url = `/annotator/task-items/${taskItemId}/data-item/content`; 
    try {
        const res = await api.get(url, { responseType: 'blob' });
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.error(`Lỗi 404: Không tìm thấy file cho Item ${taskItemId}. Kiểm tra folder lưu trữ trên Backend!`);
        }
        throw error;
    }
  }
};
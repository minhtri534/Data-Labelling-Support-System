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

  async getAnnotations(taskId: string) {
    const res = await api.get(`/annotator/tasks/${taskId}/annotations`)
    return res.data
  },

  async getLabels(taskId: string) {
    const res = await api.get(`/annotator/tasks/${taskId}/labels`)
    return res.data
  },

  async saveDraft(taskId: string, data: any) {
    const res = await api.put(`/annotator/tasks/${taskId}/annotations/draft`, data)
    return res.data
  },

  async submit(taskId: string, data: any) {
    const res = await api.post(`/annotator/tasks/${taskId}/annotations/submit`, data)
    return res.data
  },

  async getImageSecure(itemId: string): Promise<Blob> {
    const url = `/annotator/items/${itemId}/content`; 
    const res = await api.get(url, { responseType: 'blob' });
    return res.data;
  }
};
// Sau này chỉ cần thay bằng axios call

export type ReviewTask = {
  id: string;
  project: string;
  annotator: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Returned";
};

export const reviewService = {
  async getTasks(): Promise<ReviewTask[]> {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve([
          {
            id: "TASK-1001",
            project: "Vehicle Detection",
            annotator: "Alice",
            submittedAt: "2 hours ago",
            status: "Pending"
          },
          {
            id: "TASK-1002",
            project: "Medical Segmentation",
            annotator: "Bob",
            submittedAt: "3 hours ago",
            status: "Pending"
          }
        ]);
      }, 500)
    );
  },

  async getTaskById(id: string) {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve({
          id,
          imageUrl:
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
          guideline: [
            "Bounding boxes must tightly fit object",
            "Label must match category list",
            "No duplicate overlapping labels"
          ]
        });
      }, 500)
    );
  },

  async approveTask(id: string) {
    return new Promise(resolve =>
      setTimeout(() => resolve(true), 500)
    );
  },

  async returnTask(id: string, feedback: string) {
    return new Promise(resolve =>
      setTimeout(() => resolve(true), 500)
    );
  }
};

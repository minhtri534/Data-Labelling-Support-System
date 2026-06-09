/// Environment configuration for the mobile app
class Environment {
  // Android Emulator: Use 10.0.2.2 to reach the host machine's localhost
  // Physical Device: Replace with your machine's IP address (e.g., 192.168.x.x)
  // Production: Use your deployed backend URL
  
  static const String baseUrl = 'http://10.0.2.2:5000/api';
  
  static const String apiPath = '/api';
  
  // Auth endpoints
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String logoutEndpoint = '/auth/logout';
  static const String refreshTokenEndpoint = '/auth/refresh-token';
  
  // Annotator endpoints
  static const String getTasksEndpoint = '/annotator/tasks';
  static const String getTaskItemsEndpoint = '/annotator/tasks/{taskId}/items';
  static const String getTaskLabelsEndpoint = '/annotator/tasks/{taskId}/labels';
  static const String getTaskGuidelineEndpoint = '/annotator/tasks/{taskId}/guideline';
  static const String getTaskDataItemEndpoint = '/annotator/tasks/{taskId}/data-item/content';
  static const String acceptTaskEndpoint = '/annotator/tasks/{taskId}/accept';
  static const String startTaskEndpoint = '/annotator/tasks/{taskId}/start';
  static const String getTaskAnnotationsEndpoint = '/annotator/tasks/{taskId}/annotations';
  static const String submitTaskEndpoint = '/annotator/tasks/{taskId}/annotations/submit';
  
  // Full endpoint builders
  static String getFullUrl(String endpoint) => '$baseUrl$apiPath$endpoint';
}

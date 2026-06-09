import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';
import '../constants/environment.dart';
import '../utils/logger.dart';
import '../../models/common/api_error.dart';

/// HTTP client using Dio for all API communications
class DioClient {
  late Dio _dio;
  final FlutterSecureStorage _secureStorage;

  DioClient({FlutterSecureStorage? secureStorage})
      : _secureStorage = secureStorage ?? const FlutterSecureStorage() {
    _initializeDio();
  }

  void _initializeDio() {
    _dio = Dio(
      BaseOptions(
        baseUrl: Environment.baseUrl,
        connectTimeout: AppConstants.httpTimeout,
        receiveTimeout: AppConstants.httpTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onResponse: _onResponse,
        onError: _onError,
      ),
    );
  }

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    Logger.debug('🔗 Request: ${options.method} ${options.path}');
    
    // Add authorization token if available
    final token = await _secureStorage.read(key: AppConstants.tokenKey);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  Future<void> _onResponse(
    Response response,
    ResponseInterceptorHandler handler,
  ) async {
    Logger.debug(
      '✅ Response: ${response.statusCode} from ${response.requestOptions.path}',
    );
    return handler.next(response);
  }

  Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    Logger.error(
      'ℹ️ Error: ${error.type} - ${error.message}',
      error,
      error.stackTrace,
    );
    return handler.next(error);
  }

  /// Generic GET request
  Future<Response<dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  /// Generic POST request
  Future<Response<dynamic>> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  /// Generic PUT request
  Future<Response<dynamic>> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  /// Generic DELETE request
  Future<Response<dynamic>> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  /// Handle DioException and convert to ApiError
  ApiError _handleDioException(DioException error) {
    String message = AppConstants.errorGeneric;
    String? code;

    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout) {
      message = 'Connection timeout. Please check your network.';
      code = 'TIMEOUT';
    } else if (error.type == DioExceptionType.badResponse) {
      final statusCode = error.response?.statusCode;
      code = 'HTTP_$statusCode';

      switch (statusCode) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = AppConstants.errorUnauthorized;
          break;
        case 403:
          message = 'Access forbidden.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = AppConstants.errorServerError;
          break;
        default:
          message = error.response?.data?['message'] ??
              AppConstants.errorGeneric;
      }
    } else if (error.type == DioExceptionType.unknown) {
      message = AppConstants.errorNetworkConnection;
      code = 'NETWORK_ERROR';
    }

    return ApiError(
      message: message,
      code: code,
      originalError: error,
    );
  }

  /// Update authorization token
  Future<void> setAuthToken(String token) async {
    await _secureStorage.write(key: AppConstants.tokenKey, value: token);
  }

  /// Clear authorization token
  Future<void> clearAuthToken() async {
    await _secureStorage.delete(key: AppConstants.tokenKey);
  }

  /// Check if token exists
  Future<bool> hasAuthToken() async {
    final token = await _secureStorage.read(key: AppConstants.tokenKey);
    return token != null;
  }
}

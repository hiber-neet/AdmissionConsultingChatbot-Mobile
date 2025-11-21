import { Alert } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  details?: string;
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const ErrorMessages = {
  [ErrorCodes.NETWORK_ERROR]: 'Không thể kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  [ErrorCodes.AUTH_ERROR]: 'Lỗi xác thực. Vui lòng đăng nhập lại.',
  [ErrorCodes.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ.',
  [ErrorCodes.SERVER_ERROR]: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  [ErrorCodes.UNKNOWN_ERROR]: 'Đã xảy ra lỗi không xác định.',
} as const;

export class AppErrorHandler {
  static createError(code: keyof typeof ErrorCodes, details?: string): AppError {
    return {
      code,
      message: ErrorMessages[code],
      details,
    };
  }

  static handleError(error: any): AppError {
    console.error('Error occurred:', error);

    if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
      return this.createError(ErrorCodes.NETWORK_ERROR, error.message);
    }

    if (error?.message?.includes('auth') || error?.code === 'AUTH_ERROR') {
      return this.createError(ErrorCodes.AUTH_ERROR, error.message);
    }

    if (error?.status >= 500) {
      return this.createError(ErrorCodes.SERVER_ERROR, error.message);
    }

    if (error?.status >= 400) {
      return this.createError(ErrorCodes.VALIDATION_ERROR, error.message);
    }

    return this.createError(ErrorCodes.UNKNOWN_ERROR, error?.message || String(error));
  }

  static showAlert(error: AppError) {
    Alert.alert('Lỗi', error.message, [{ text: 'Đóng' }]);
  }

  static showErrorAlert(error: any) {
    const appError = this.handleError(error);
    this.showAlert(appError);
  }
}

export const isNetworkError = (error: any): boolean => {
  return error?.message?.toLowerCase().includes('network') || 
         error?.code === 'NETWORK_ERROR' ||
         !navigator?.onLine;
};
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 8 ký tự"
    };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      isValid: false,
      message: "Mật khẩu phải có chữ hoa, chữ thường và số"
    };
  }
  
  return {
    isValid: true,
    message: "Mật khẩu hợp lệ"
  };
};

export const validateEmailDomain = (email: string): boolean => {
  const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'fpt.edu.vn', 'student.fpt.edu.vn'];
  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(domain);
};

export const getValidationErrors = (email: string, password: string, confirmPassword?: string) => {
  const errors: string[] = [];
  
  if (!validateRequired(email)) {
    errors.push("Email không được để trống");
  } else if (!validateEmail(email)) {
    errors.push("Email không hợp lệ");
  }
  
  if (!validateRequired(password)) {
    errors.push("Mật khẩu không được để trống");
  } else {
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      errors.push(passwordCheck.message);
    }
  }
  
  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push("Mật khẩu nhập lại không trùng khớp");
  }
  
  return errors;
};

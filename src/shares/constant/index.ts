export const ERROR_MESSAGE_CODE = {
  // user error
  ACCOUNT_NOT_FOUND: {
    message: 'Account not found.',
    code: 'USER_00000',
  },
  ACCOUNT_EXISTED: {
    message: 'Account already existed.',
    code: 'USER_00001',
  },
  ACCOUNT_HASH_NOT_MATCH: {
    message: 'Account adress and hash message are not matched.',
    code: 'USER_00002',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized user.',
    code: 'USER_00003',
  },
  LOCKED_USER: {
    message: 'User has been locked.',
    code: 'USER_00004',
  },
  VERIFY_SIGNATURE_FAIL: {
    message: 'System has been failed to verify signture.',
    code: 'USER_00005',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00006',
  },
  ACCESS_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00007',
  },
  FORBIDDEN: {
    message: 'You are not authorized to access this resource.',
    code: 'USER_00008',
  },
  USER_EMAIL_EXISTED: {
    message: 'Email has been associted with an other account.',
    code: 'USER_0009',
  },
  USER_EMAIL_VERIFY_FAIL: {
    message: 'Failed to verify this email.',
    code: 'USER_0010',
  },
  NO_RECORD_DELETED: {
    message: 'Deleted 0 record',
    code: '0011',
  },
};
export const SUCCESS_MESSAGE_CODE = {
  UPDATED_SUCCESS: {
    message: 'Updated Successfully',
    code: 'Success_001',
  },
  DELETED_SUCCESS: {
    message: 'Deleted Successfully',
    code: 'Success_002',
  },
  CREATED_SUCCESS: {
    message: 'Created Successfully',
    code: 'Success_003',
  },
  CHANGED_PASS: {
    message: 'Change Password Successfully, Please login again!!!',
    code: 'success_005',
  },
};

export const USER_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  NAME_LENGTH_MUST_BE_3_TO_100: 'Name length must be from 3 to 100',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_IS_STRING: 'Name must be a string',
  EMAIL_IS_REQUIRED: `Email is required`,
  EMAIL_ALREADY_EXIT: `Email already exit`,
  EMAIL_IS_INVALID: `Email is invaild`,
  EMAIL_LENGTH_MUST_BE_6_TO_255: `Email length must be from 6 to 255`,
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_IS_NOT_STRONG:
    'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.',
  PASSWORD_LENGTH_MUST_BE_6_255: 'Password length must be from 6 to 255',
  PASSWORD_AND_PASSWORD_CONFIRM_NOT_MATCH: 'Password confirmation does not match password',
  COMFIRM_PASSWORD_IS_REQUIRED: 'Confirm passowrd must be required',
  CONFIRM_PASSWORD_IS_NOT_STRONG:
    'Confirm password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_6_255: 'Confirm password lenth must be from 6 to 255',
  DATE_OF_BIRTH_MUST_BE_ISO8601_FORMAT: 'Date of birth must be iso8601 format',
  INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_NOT_EXITS: 'Refresh token is not exits',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  FOLLOWED_USER_ID_IS_INVALID: `Followed userid is invalid`,
  LOGIN_SUCCESS: 'Login user successfully!',
  REGISTER_SUCCESS: 'Register user successfully!',
  LOGOUT_SUCCESS: 'Log out user successfully!',
  GET_ME_SUCCESS: `Get me successfully`,
  LOCATION_MUST_BE_A_STRING: `Location must be a string`,
  WEBSITE_MUST_BE_A_STRING: `Website must be a string`,
  USER_NAME_MUST_BE_A_STRING: `Username must be a string`,
  AVATAR_MUST_BE_A_STRING: 'Avatar must be a string',
  COVER_PHOTO_MUST_BE_A_STRING: `Cover photo must be a string`,
  BIO_MUST_BA_A_STRING: 'Bio must be a string',
  UPDATE_ME_SUCCESS: `Update me sucessfully`,
  GET_PROFILE_SUCCESS: `Get profile successfully`,
  FOLLOW_SUCCESSFULLY: `Follow user successfully`,
  ALREADY_FOLLOWED_USER: 'You already followed this user',
  FOLLOWER_USER_NOT_FOUND: 'Follower user not found',
  FOLLOWED_USER_NOT_FOUND: 'Follwed user not found',
  USER_NOT_FOUND: 'User not found',
  NOT_FOLLOW_USER: 'You not follow this user',
  UN_FOLLOW_SUCCESS: 'Unfollow user success',
  USER_NAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers and underscores, not only numbers',
  USER_NAME_ALREADY_EXITS: 'Username already exits',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match with password',
  UPDATE_PASSWORD_SUCCESS: `Update password successfully`,
  UPLOAD_FILE_SUCCESS: 'Upload file successfully',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully'
}

export const TWEET_MESSAGE = {
  INVALID_TWEET_TYPE: 'Invalid tweet type',
  INVALID_TWEET_AUDIENCE: 'Invalid tweet audience',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: `Parent id must be a valid tweet id`,
  PARENT_ID_MUST_BE_NULL: `Parent id must be null`,
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: `Content must be a non empty string`,
  COTENT_MUST_BE_EMPTY_STRING: 'Content must be a empty string',
  HASHTAG_MUST_BE_AN_ARRAY_STRING: 'Hashtags must be an array string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIA_MSUT_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Media must be an array of media object',
  CREATE_TWEET_SUCCESS: 'Create tweet successfully',
  TWEET_ID_CANNOT_EMPTY: 'Tweet id cannot empty',
  TWEET_WITH_TWEET_ID_NOT_FOUND: 'Tweet with tweet id not found'
}

export const BOOKMARK_MESSAGE = {
  ADD_TWEET_TO_BOOKMARK_SUCCESS: 'Add tweet to bookmark successfully',
  UN_BOOKMARK_SUCCESS: 'Unbookmark twwet successfully'
}

/**
 * 上传附件的业务类型
 * <p>
 * 一个表，拥有多个附件时，为每个业务类型定义一个业务类型
 *
 * @author henhen6
 * @since 2025/10/20 23:46
 */
export const FileObjectType = {
  open: {
    app: {
      logo: 'APP_LOGO',
    },
    appApply: {
      logo: 'APP_APPLY_LOGO',
      certificateFile: 'APP_APPLY_CREDENTIAL_FILE',
    },
  },
  console: {
    user: {
      avatar: 'USER_AVATAR',
    },
  },
};

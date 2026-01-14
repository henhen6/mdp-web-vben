import type { VbenFormSchema } from '@vben/common-ui';

import { cloneDeep } from '@vben/utils';

/**
 * 编辑表单组件 与 详情表单组件 映射
 */
const formDetailMap = {
  Divider: 'Divider',
  Input: 'Text',
  ApiCascader: 'TextApiCascader',
  ApiCheckboxGroup: 'TextApiCheckboxGroup',
  ApiDict: 'TextApiDict',
  ApiRadioGroup: 'TextApiRadioGroup',
  ApiSelect: 'TextApiSelect',
  ApiTreeSelect: 'TextApiTreeSelect',
  FileUpload: 'TextFileUpload',
  IconPicker: 'TextIconPicker',
  ImageUpload: 'TextImageUpload',
  RadioGroup: 'TextRadioGroup',
  Select: 'TextSelect',
  Switch: 'TextSwitch',
};

export const formToDetailBySchema = (
  formSchemas: VbenFormSchema[],
): VbenFormSchema[] => {
  const detailSchemas: Array<VbenFormSchema> = [];
  if (!Array.isArray(formSchemas)) {
    return detailSchemas;
  }
  for (const item of formSchemas) {
    const newItem = cloneDeep(item);
    // 将 编辑表单组件 映射为 详情表单组件，若没有映射，则使用编辑表单组件
    newItem.component =
      formDetailMap[item?.component as keyof typeof formDetailMap] ||
      item?.component;
    detailSchemas.push(newItem);
  }
  return detailSchemas;
};

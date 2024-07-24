import { ElMessageBox } from "element-plus";
import ResultPromptComponent from "./ResultPrompt.vue";

/**
 * 结果提示框
 */
export const useResultAlertBox = (options: {
  title: string;
  /**
   * 结果类型
   * * basic-success 成功
   * * basic-error 失败
   * * device-info-gb 国标设备信息
   * * device-info-senrigan 千里眼设备信息
   */
  resultType:
    | "basic-success"
    | "basic-error"
    | "device-info-gb"
    | "device-info-senrigan";
  /**
   * 提示内容设置
   * 成功/失败 内容
   */
  auxiliaryText?: string;
  /**
   * 提示内容配置
   * 国标设备信息/千里眼设备信息时可传递
   */
  auxiliaryConfog?: any;
}) => {
  const { title, resultType, auxiliaryConfog, auxiliaryText } = options;

  return ElMessageBox({
    title,
    customClass: 'message_box_custom',
    message: h(ResultPromptComponent, {
      resultType,
      auxiliaryConfog,
      auxiliaryText,
    }),
  });
};

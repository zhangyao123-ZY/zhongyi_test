/**
 * 消息类型
 */
export enum MessageTypeEnum {
  /**
   * 告警消息
   */
  ALARM = 1,
  /**
   * 设备在离线消息
   */
  DEVICE_ONLINESTATUS,
  /**
   * 设备绑定/解绑消息
   */
  DEVICE_BIND,
  /**
   * 1400图片消息
   */
  IMAGE1400,
  /**
   * AI事件消息
   */
  AI_EVENT,
  /**
   * 归档云存储解冻状
   * 态消息
   */
  ARCHIVE_UNFREEZE,
  /**
   * 下级域消息
   */
  DOMAIN,
  /**
   * 设备通道变更消息
   */
  CHANNEL,
  /**
   * 设备状态校验消息
   */
  DEVICE_STATUS,
  /**
   * 设备底座接入信息
   */
  DEVICE_BASE = 11,
  /**
   * 设备分享任务消息
   */
  SHARE_TASK,
  /**
   * 视频质量诊断消息
   */
  VIDEO_DIAGNOSTIC,
  /**
   * 录像完整性结果消
   * 息
   */
  RECORD_INTEGRITY,
}

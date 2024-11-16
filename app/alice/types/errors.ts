import { ActionResultErrorCode } from './ActionResultErrorCode';
import { ActionResultStatus } from './ActionResultStatus';

export class ActionResultError extends Error {
  constructor(
    public code: ActionResultErrorCode = ActionResultErrorCode.INTERNAL_ERROR,
    message?: string,
  ) {
    super(message || String(code));
  }

  toJson() {
    return {
      status: ActionResultStatus.ERROR,
      error_code: this.code,
      error_message: this.message,
    };
  }
}

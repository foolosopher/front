import { BaseIncomingMessage, DispatchResult } from "@app/types";
import { STATUS_TEMP_REDIR, STATUS_BAD_REQUEST } from "@app/constants";

export const baseRedirect = async (key:string, msg: BaseIncomingMessage): Promise<DispatchResult> => {
  if (msg.data.to) {
    return { location: msg.data.to }
  } else {
    return {
      errorCode: STATUS_BAD_REQUEST,
      error: 'Parameter "to" is required'
    }
  }
}

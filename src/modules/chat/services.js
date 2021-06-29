import { baseApi } from "@common/baseApi";

const LIMIT_MESSAGES = 10;
const LIMIT_MESSAGE_LIST = 100;

export function fetchMessageApi(data) {
  return baseApi.get(`/chat/message`, {
    offset: data?.offset || 0,
    limit: LIMIT_MESSAGES,
  });
}

import { baseApi } from "@common/baseApi";

export function createPostApi({ title, image }) {
  return baseApi.postFormData("/post", {
    title,
    image,
  });
}

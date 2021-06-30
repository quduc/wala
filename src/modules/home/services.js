import { baseApi } from "@common/baseApi";

export function createPostApi({ title, image }) {
  return baseApi.post("/post", {
    title,
    image,
  });
}

import { baseApi } from "@common/baseApi";

export function createPostApi({ title, image }) {
  return baseApi.postFormData("/post", {
    title,
    image,
  });
}

export function fetchPostApi() {
  return baseApi.get("/post");
}

export function addLikeApi({ postId }) {
  return baseApi.put(`/post/${postId}/like`);
}

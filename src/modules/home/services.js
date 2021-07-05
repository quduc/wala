import { baseApi } from "@common/baseApi";

const LIMIT_POST = 10;

export function createPostApi({ title, image }) {
  return baseApi.postFormData("/post", {
    title,
    image,
  });
}

export function fetchPostApi(data) {
  return baseApi.get("/post", {
    offset: data?.offset || 0,
    limit: LIMIT_POST,
  });
}

export function addLikeApi({ postId }) {
  return baseApi.put(`/post/${postId}/like`);
}

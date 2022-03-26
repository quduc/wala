import { baseApi } from "@common/baseApi";

const LIMIT_POST = 10;

export function createPostApi({ title, image, description, category }) {
  console.log({ image });
  return baseApi.postFormData("/post", {
    title,
    image,
    category,
    description
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

export function addCommentApi({ postId, content }) {
  return baseApi.post(`/post/comment`, {
    content,
    postId,
  });
}

export function getPostDetailApi({ postId }) {
  return baseApi.get(`/post/postDetail`, {
    postId,
  });
}

export function deleteCommentApi({ postId }) {
  return baseApi.delete(`/post/comment`, {
    postId,
  });
}

export function getListLikeApi({ postId }) {
  return baseApi.get(`/post/like`, {
    postId,
  });
}

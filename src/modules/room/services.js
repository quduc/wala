import { baseApi } from '@common/baseApi';

const LIMIT_ROOMS = 10;
const LIMIT_MESSAGE_LIST = 100;

export function fetchRoomsApi({ keyword = '' }) {
  return baseApi.get('/room', {
    keyword,
    offset: 0,
    limit: LIMIT_ROOMS,
  });
}

export function loadmoreRoomsApi({ keyword = '', offset }) {
  return baseApi.get('/room', {
    keyword,
    offset,
    limit: LIMIT_ROOMS,
  });
}

export function createRoomApi({
  roomName,
  aboutRoom,
  maxMember,
  targetMember,
  cover,
  skipRule,
  listenerIds,
}) {
  return baseApi.post('/room', {
    name: roomName,
    number: maxMember,
    description: aboutRoom,
    cover,
    type: targetMember,
    userIds: listenerIds,
    skipRule,
  });
}

export function updateRoomApi({
  roomId,
  roomName,
  aboutRoom,
  maxMember,
  targetMember,
  cover,
  skipRule,
}) {
  return baseApi.put(`/room/${roomId}`, {
    name: roomName,
    number: maxMember,
    description: aboutRoom,
    cover,
    type: targetMember,
    skipRule,
  });
}

export function userJoinRoomApi({ roomId }) {
  return baseApi.get(`room/${roomId}/join`);
}

export function getRoomDetailApi({ roomId }) {
  return baseApi.get(`/room/${roomId}`);
}

export function suggestSongApi({ roomId, youtubeId, type }) {
  return baseApi.post(`/room/${roomId}/suggest-song`, {
    youtubeId,
    type,
  });
}

export function sendMessageApi({ roomId, content, metadata, receiverId }) {
  return baseApi.post('/chat/send', {
    roomId,
    content,
    metadata,
    receiverId,
  });
}

export function fetchMessagesApi({ roomId, receiverId = '', lastId = '' }) {
  return baseApi.get('/chat/history', {
    roomId,
    receiverId,
    lastId,
    limit: LIMIT_MESSAGE_LIST,
  });
}

export function loadmoreMessagesApi({ roomId, receiverId = '', lastId }) {
  return baseApi.get('/chat/history', {
    roomId,
    receiverId,
    lastId,
    limit: LIMIT_MESSAGE_LIST,
  });
}

export function inviteFriendJoinRoomApi({ roomId, userIds }) {
  return baseApi.post(`/room/${roomId}/invite`, {
    roomId,
    userIds,
  });
}

export function acceptInviteRoomApi({ invitationId }) {
  return baseApi.put(`/invitation/${invitationId}/accept`);
}

export function fetchInviteListApi({ roomId }) {
  return baseApi.get(`/room/${roomId}/invite-list`, {
    roomId,
  });
}

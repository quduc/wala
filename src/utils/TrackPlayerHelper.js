import TrackPlayer from 'react-native-track-player';
import { HOST_DEV } from '@common/config/';

export const createTrackPlayer = async () => {
  await TrackPlayer.setupPlayer({});
  await TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_STOP,
      TrackPlayer.CAPABILITY_SEEK_TO,
    ],
    compactCapabilities: [
      // TrackPlayer.CAPABILITY_PLAY,
      // TrackPlayer.CAPABILITY_PAUSE,
      // TrackPlayer.CAPABILITY_SEEK_TO,
    ],
  });
};

export const addMusic = async nowPlaying => {
  console.log('ytb ', nowPlaying.youtubeId);
  await TrackPlayer.add({
    id: nowPlaying?.song?.id,
    // url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`,
    url: `${HOST_DEV.DEV}/music/${nowPlaying?.youtubeId}.mp4`,
    title: nowPlaying.song.title,
    artist: nowPlaying.song.title,
    artwork: nowPlaying.song.thumbnail,
  });
};

export const playMusic = async () => {
  await TrackPlayer.play();
};

export const destroyMusic = async () => {
  TrackPlayer.destroy();
};

export const pauseMusic = async () => {
  await TrackPlayer.pause();
};

export const resetMusic = async () => {
  await TrackPlayer.reset();
};

export const seekToPosition = async position => {
  await TrackPlayer.seekTo(position);
};

export const convertPositionToTime = value => {
  const duration = +value.toFixed(0);
  const min = Math.floor(duration / 60);
  let second = duration % 60;
  second = second < 10 ? `0${second}` : second;
  return `${min}:${second}`;
};

export const convertDurationToTime = duration => {
  if (!duration) return '00:00';
  const min = Math.floor(duration / 60);
  let second = duration % 60;
  second = second < 10 ? `0${second}` : second;
  return `${min}:${second}`;
};

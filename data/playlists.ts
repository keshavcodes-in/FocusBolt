import { Playlist } from '@/components/music/ExpandedPlayer';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/keshavcodes-in/focusbolt-audio@main';

export const samplePlaylists: Playlist[] = [
  {
    id: 'focus-music',
    name: '🎵 Focus Music',
    category: 'focus',
    tracks: [
     
      {
        id: '1',
        title: 'Coding Flow',
        artist: 'Productivity Beats',
        url: `${CDN_BASE}/focus/coding-flow.mp3`,
        duration: '1:40'
      },
       {
        id: '2',
         title: 'Deep Focus',
       artist: 'Study Music',
        url: `${CDN_BASE}/focus/deep-focus.mp3`,
        duration: '5:42'
      },
      {
        id: '3',
        title: 'Mind Palace',
        artist: 'Concentration',
        url: `${CDN_BASE}/focus/mind-palace.mp3`,
        duration: '4:41'
      },
     
    ],
  },
  {
    id: 'nature-sounds',
    name: '🌿 Nature Sounds',
    category: 'nature',
    tracks: [
     
      {
        id: '4',
        title: 'Jungle Nature',
        artist: 'Relaxing Nature',
        url: `${CDN_BASE}/nature/jungle-nature.mp3`,
        duration: '2:34'
      },
      {
        id: '5',
        title: 'Thunderstorm',
        artist: 'Storm Sounds',
        url: `${CDN_BASE}/nature/thunderstorm.mp3`,
        duration: '2:01'
      },
      {
        id: '6',
        title: 'Morning',
        artist: 'Morning Nature',
        url: `${CDN_BASE}/nature/birds.mp3`,
        duration: '2:36'
      },
       {
        id: '7',
        title: 'Forest Rain',
        artist: 'Nature Audio',
        url: `${CDN_BASE}/nature/forest-rain.mp3`,
        duration: '1:48'
      },
    ],
  },
];

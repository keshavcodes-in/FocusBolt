"use client";
import React from 'react';
import { ColorTheme } from '@/lib/theme';
import { getThemeStyles } from '@/lib/themeStyles'; 

export interface Track {
  id: string; title: string; artist: string; duration?: string; url: string;
}
export interface Playlist {
  id: string; name: string; tracks: Track[]; category: 'focus' | 'nature' | 'user';
}
interface ExpandedPlayerProps {
  isExpanded: boolean;
  currentTheme: ColorTheme;
  playlists: Playlist[];
  currentTrack: Track | null;
  onSelectTrack: (track: Track) => void;
  onClose: () => void;
}

export function ExpandedPlayer({
  isExpanded,
  currentTheme,
  playlists,
  currentTrack,
  onSelectTrack,
  onClose,
}: ExpandedPlayerProps) {
  if (!isExpanded) return null;


  const theme = getThemeStyles(currentTheme);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />
      
      {/* Popup Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[80vh] border animate-in zoom-in-95 duration-300"
          style={theme.container} // Handles background, blur, and border
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-6 py-5 border-b"
            style={{ borderBottomColor: theme.isImage ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                style={{
                  backgroundColor: theme.isImage ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255,255,255,0.05)',
                  borderColor: theme.isImage ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
                  Music Library
                </h2>
                <p className="text-sm" style={{ color: theme.text.secondary }}>
                  Choose your focus soundtrack
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
              style={{ color: theme.text.accent, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Playlists Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="space-y-8">
              {playlists.map((playlist) => (
                <div key={playlist.id}>
                  <h4 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
                    {playlist.name}
                  </h4>
                  
                  <div className="grid gap-3">
                    {playlist.tracks.map((track, index) => {
                      const isActive = currentTrack?.id === track.id;
                      return (
                        <button
                          key={track.id}
                          onClick={() => onSelectTrack(track)}
                          className="w-full text-left p-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] border group shadow-sm"
                          style={{
                            // Use theme.item for background/border, but override for Active state
                            backgroundColor: isActive ? (theme.isImage ? '#ffffff' : `${theme.text.accent}20`) : theme.item.background,
                            borderColor: isActive ? theme.text.accent : theme.item.border.split('1px solid ')[1],
                            cursor: 'pointer'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                              <div className="text-sm font-mono opacity-50" style={{ color: theme.text.secondary }}>
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-base font-semibold truncate" style={{ color: theme.text.primary }}>
                                  {track.title}
                                </div>
                                <div className="text-sm truncate" style={{ color: theme.text.secondary }}>
                                  {track.artist}
                                </div>
                              </div>
                            </div>
                            
                            {isActive && (
                              <div 
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: theme.text.accent,
                                  boxShadow: `0 0 10px ${theme.text.accent}80`
                                }}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${theme.isImage ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}; 
          border-radius: 10px; 
        }
      `}</style>
    </>
  );
}
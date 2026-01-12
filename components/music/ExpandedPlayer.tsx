"use client";
import React from 'react';
import { ColorTheme } from '@/lib/theme';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  url: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  category: 'focus' | 'nature' | 'user';
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

  const isImageTheme = currentTheme.backgroundImage;

  return (
    <>
      {/* Subtle Backdrop */}
      <div 
        className="fixed inset-0 z-40 backdrop-blur-[2px]"
        style={{
          backgroundColor: isImageTheme 
            ? 'rgba(0, 0, 0, 0.15)' 
            : 'rgba(0, 0, 0, 0.25)'  
        }}
        onClick={onClose}
      />
      
      {/* Popup Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[80vh] border animate-in zoom-in-95 duration-300"
          style={{
            background: isImageTheme 
              ? 'rgba(0, 0, 0, 0.85)' 
                :currentTheme.background, 
            borderColor: isImageTheme ? 'rgba(255, 255, 255, 0.25)' : `${currentTheme.cardBorder}80`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isImageTheme 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15)' 
              : `0 25px 50px -12px ${currentTheme.cardBorder}40`,
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-6 py-5 border-b"
            style={{
              borderBottomColor: isImageTheme ? 'rgba(255, 255, 255, 0.15)' : currentTheme.cardBorder,
              background: isImageTheme 
                ? 'rgba(0, 0, 0, 0.2)' //light header background
                : 'transparent',
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: isImageTheme 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : `${currentTheme.cardBorder}40`,
                  border: `1px solid ${isImageTheme ? 'rgba(255, 255, 255, 0.3)' : currentTheme.cardBorder}`,
                }}
              >
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <h2 
                  className="text-xl font-bold"
                  style={{ 
                    color: isImageTheme 
                      ? 'rgba(255, 255, 255, 0.95)' 
                      : currentTheme.digitColor 
                  }}
                >
                  Music Library
                </h2>
                <p 
                  className="text-sm"
                  style={{ 
                    color: isImageTheme 
                      ? 'rgba(255, 255, 255, 0.8)' 
                      : currentTheme.separatorColor 
                  }}
                >
                  Choose your focus soundtrack
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 border"
              style={{
                color: isImageTheme 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : currentTheme.separatorColor,
                backgroundColor: isImageTheme 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'transparent',
                borderColor: isImageTheme ? 'rgba(255, 255, 255, 0.3)' : currentTheme.cardBorder,
                cursor:'pointer'
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Playlists Content */}
          <div 
            className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar"
            style={{
              background: isImageTheme 
                ? 'rgba(0, 0, 0, 0.1)' // Very light background 
                : 'transparent',
            }}
          >
            <div className="space-y-8">
              {playlists.map((playlist) => (
                <div key={playlist.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 
                      className="text-lg font-semibold flex items-center space-x-3"
                      style={{ 
                        color: isImageTheme 
                          ? 'rgba(255, 255, 255, 0.95)' 
                          : currentTheme.digitColor 
                      }}
                    >
                      <span>{playlist.name}</span>
                    </h4>
                    <span 
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ 
                        color: isImageTheme 
                          ? 'rgba(255, 255, 255, 0.85)' 
                          : currentTheme.separatorColor,
                        backgroundColor: isImageTheme 
                          ? 'rgba(255, 255, 255, 0.15)' 
                          : `${currentTheme.cardBorder}30`,
                        border: `1px solid ${isImageTheme ? 'rgba(255, 255, 255, 0.3)' : currentTheme.cardBorder}`,
                      }}
                    >
                      {playlist.tracks.length} tracks
                    </span>
                  </div>
                  
                  <div className="grid gap-3">
                    {playlist.tracks.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => onSelectTrack(track)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] group border ${
                          currentTrack?.id === track.id ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: currentTrack?.id === track.id 
                            ? (isImageTheme ? 'rgba(255, 255, 255, 0.2)' : `${currentTheme.digitColor}15`)
                            : (isImageTheme ? 'rgba(255, 255, 255, 0.08)' : `${currentTheme.background}20`),
                          borderColor: currentTrack?.id === track.id 
                            ? (isImageTheme ? 'rgba(255, 255, 255, 0.5)' : currentTheme.digitColor)
                            : (isImageTheme ? 'rgba(255, 255, 255, 0.2)' : currentTheme.cardBorder),
                          ...(currentTrack?.id === track.id && {
                            ringColor: isImageTheme 
                              ? 'rgba(255, 255, 255, 0.4)' 
                              : currentTheme.digitColor + '40',
                          }),
                          cursor:'pointer'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                              style={{
                                backgroundColor: currentTrack?.id === track.id 
                                  ? (isImageTheme ? 'rgba(255, 255, 255, 0.25)' : `${currentTheme.digitColor}20`)
                                  : (isImageTheme ? 'rgba(255, 255, 255, 0.15)' : `${currentTheme.cardBorder}30`),
                                borderColor: isImageTheme ? 'rgba(255, 255, 255, 0.3)' : currentTheme.cardBorder,
                                color: isImageTheme 
                                  ? 'rgba(255, 255, 255, 0.9)' 
                                  : currentTheme.separatorColor,
                              }}
                            >
                              <span className="text-xs font-mono">{index + 1}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div 
                                className="text-base font-semibold truncate group-hover:text-opacity-90"
                                style={{ 
                                  color: currentTrack?.id === track.id 
                                    ? (isImageTheme ? 'rgba(255, 255, 255, 0.95)' : currentTheme.digitColor)
                                    : (isImageTheme ? 'rgba(255, 255, 255, 0.9)' : currentTheme.digitColor + 'DD')
                                }}
                              >
                                {track.title}
                              </div>
                              <div 
                                className="text-sm truncate mt-1"
                                style={{ 
                                  color: isImageTheme 
                                    ? 'rgba(255, 255, 255, 0.7)' 
                                    : currentTheme.separatorColor 
                                }}
                              >
                                {track.artist}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div 
                              className="text-sm font-mono"
                              style={{ 
                                color: isImageTheme 
                                  ? 'rgba(255, 255, 255, 0.7)' 
                                  : currentTheme.separatorColor 
                              }}
                            >
                              {track.duration}
                            </div>
                            {currentTrack?.id === track.id && (
                              <div 
                                className="w-3 h-3 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: isImageTheme 
                                    ? 'rgba(255, 255, 255, 0.9)' 
                                    : currentTheme.digitColor,
                                  boxShadow: isImageTheme 
                                    ? '0 0 8px rgba(255, 255, 255, 0.5)' 
                                    : `0 0 8px ${currentTheme.digitColor}50`,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isImageTheme ? 'rgba(255, 255, 255, 0.1)' : currentTheme.cardBorder + '20'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isImageTheme ? 'rgba(255, 255, 255, 0.4)' : currentTheme.cardBorder};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isImageTheme ? 'rgba(255, 255, 255, 0.6)' : currentTheme.digitColor + '80'};
        }
        
        @keyframes zoom-in-95 {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
        .duration-300 {
          animation-duration: 300ms;
        }
      `}</style>
    </>
  );
}

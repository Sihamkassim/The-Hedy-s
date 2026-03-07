import React from 'react';
import { X } from 'lucide-react';

export default function VideoCallModal({ roomUrl, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#D4DBC8] bg-white">
          <h2 className="text-xl font-bold text-[#2C3E1E]">Video Consultation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <iframe
          title="Jitsi video call"
          src={roomUrl}
          className="flex-1 w-full"
          allow="camera; microphone; fullscreen; display-capture; speaker"
        />
      </div>
    </div>
  );
}

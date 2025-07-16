import React from "react";

import { Message } from "./InteractiveAvatar";

interface TranscriptProps {
  messages: Message[];
}

export const Transcript: React.FC<TranscriptProps> = ({ messages }) => {
  return (
    <div className="w-full h-full bg-zinc-800 p-4 rounded-lg overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 ${message.isUser ? "text-right" : "text-left"}`}
        >
          <span
            className={`inline-block p-2 rounded-lg ${
              message.isUser
                ? "bg-blue-500 text-white"
                : "bg-zinc-700 text-white"
            }`}
          >
            {message.text}
          </span>
        </div>
      ))}
    </div>
  );
};

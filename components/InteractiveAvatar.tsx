// ----- IMPORTS (always at the top!) -----
import React, { useEffect, useRef, useState } from "react";
import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useMemoizedFn, useUnmount } from "ahooks";
import { CameraIcon } from "lucide-react";
import { Button } from "./Button";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { Input } from "./Input";
import { Transcript } from "./Transcript";
import { AVATARS } from "@/app/lib/constants";
// ----- END IMPORTS -----

export interface Message {
  text: string;
  isUser: boolean;
}

interface InteractiveAvatarProps {
  knowledgeBaseId?: string;
}

function InteractiveAvatar({ knowledgeBaseId }: InteractiveAvatarProps) {
  const {
    initAvatar,
    startAvatar,
    stopAvatar,
    sessionState,
    stream,
    sendMessage,
  } = useStreamingAvatarSession();
  const { startVoiceChat, stopVoiceChat, isMuted, toggleMute } = useVoiceChat();

  // Create config with knowledge base ID
  const [config, setConfig] = useState<StartAvatarRequest>({
    quality: AvatarQuality.Low,
    avatarName: AVATARS[0].avatar_id,
    knowledgeId: knowledgeBaseId || undefined,
    voice: {
      rate: 1.5,
      emotion: VoiceEmotion.EXCITED,
      model: ElevenLabsModel.eleven_flash_v2_5,
    },
    language: "en",
    voiceChatTransport: VoiceChatTransport.WEBSOCKET,
    sttSettings: {
      provider: STTProvider.DEEPGRAM,
    },
  });

  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const mediaStream = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);

  // Update config when knowledgeBaseId changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      knowledgeId: knowledgeBaseId || undefined
    }));
  }, [knowledgeBaseId]);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setMessages((prev) => [...prev, { text: chatInput, isUser: true }]);
      setChatInput("");
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setUserStream(stream);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = useMemoizedFn(() => {
    userStream?.getTracks().forEach((track) => track.stop());
    setUserStream(null);
  });

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    await startWebcam();
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_TEXT_RECEIVED, (text: string) => {
        setMessages((prev) => [...prev, { text, isUser: false }]);
      });

      await startAvatar(config);
      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
    stopWebcam();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    if (userStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream]);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div className="flex-1 flex flex-row">
        <div className="w-1/2 h-full flex items-center justify-center bg-zinc-900 border-r border-zinc-700">
          {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
            <AvatarVideo ref={mediaStream} />
          ) : (
            <div className="w-full h-full p-4">
              <AvatarConfig config={config} onConfigChange={setConfig} />
            </div>
          )}
        </div>

        <div className="w-1/2 h-full flex items-center justify-center bg-zinc-900">
          {showTranscript ? (
            <Transcript messages={messages} />
          ) : userStream ? (
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col gap-2 items-center text-zinc-400">
              <CameraIcon size={40} />
              Your camera is off
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-20 bg-zinc-800 flex flex-row items-center justify-center px-6 border-t border-zinc-700">
        {sessionState === StreamingAvatarSessionState.CONNECTED ? (
          <div className="flex flex-row gap-4 w-full">
            <Button onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? "Show Video" : "Show Transcript"}
            </Button>
            <Input
              value={chatInput}
              onChange={setChatInput}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>Send</Button>
            <Button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</Button>
            <AvatarControls />
          </div>
        ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
          <div className="flex flex-row gap-4">
            <Button onClick={() => startSessionV2(true)}>
              Start Voice Chat
            </Button>
            <Button onClick={() => startSessionV2(false)}>
              Start Text Chat
            </Button>
          </div>
        ) : (
          <LoadingIcon />
        )}
      </div>
    </div>
  );
}

export default function InteractiveAvatarWrapper({ knowledgeBaseId }: InteractiveAvatarProps) {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar knowledgeBaseId={knowledgeBaseId} />
    </StreamingAvatarProvider>
  );
}
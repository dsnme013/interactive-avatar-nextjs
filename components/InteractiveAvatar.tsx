import React, { useState, useEffect, useRef } from "react";
import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
  TaskType,
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

export interface Message {
  text: string;
  isUser: boolean;
}

interface InteractiveAvatarProps {
  knowledgeBaseId?: string;
}

function InteractiveAvatar({ knowledgeBaseId }: InteractiveAvatarProps) {
  const {
    avatarRef,
    initAvatar,
    startAvatar,
    stopAvatar,
    sessionState,
    stream,
  } = useStreamingAvatarSession();
  const {
    startVoiceChat,
    stopVoiceChat,
    isMuted,
    muteInputAudio,
    unmuteInputAudio,
  } = useVoiceChat();

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
  const [isInterviewMode, setIsInterviewMode] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [candidateResume, setCandidateResume] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);

  const mediaStream = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      knowledgeId: knowledgeBaseId || undefined,
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

  const startInterview = () => {
    if (avatarRef.current && jobDescription && candidateResume) {
      const initialMessage = `Hello! I'm your interviewer today. I've reviewed your resume and the job description. Let me start by asking you to tell me a bit about yourself and why you're interested in this position.`;

      avatarRef.current
        .speak({
          text: initialMessage,
          taskType: TaskType.REPEAT,
        })
        .then(() => {
          setMessages((prev) => [
            ...prev,
            { text: initialMessage, isUser: false },
          ]);
          setInterviewStarted(true);
        })
        .catch((error) => {
          console.error("Error starting interview:", error);
        });
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() && avatarRef.current) {
      // Add user message to transcript
      setMessages((prev) => [...prev, { text: chatInput, isUser: true }]);

      // In interview mode, generate a contextual response
      if (isInterviewMode && interviewStarted) {
        // This would typically call an AI service to generate the next interview question
        // For now, we'll use a simple response
        const interviewerResponse = generateInterviewResponse(chatInput);

        avatarRef.current
          .speak({
            text: interviewerResponse,
            taskType: TaskType.REPEAT,
          })
          .then(() => {
            setMessages((prev) => [
              ...prev,
              { text: interviewerResponse, isUser: false },
            ]);
          })
          .catch((error) => {
            console.error("Error sending interviewer response:", error);
          });
      } else {
        // Regular chat mode - use TALK mode if knowledgeId is provided
        avatarRef.current
          .speak({
            text: chatInput,
            taskType: knowledgeBaseId ? TaskType.TALK : TaskType.REPEAT,
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
      }

      setChatInput("");
    }
  };

  // Simple interview response generator (replace with AI service)
  const generateInterviewResponse = (candidateAnswer: string) => {
    const responses = [
      "That's interesting. Can you provide a specific example of when you demonstrated this skill?",
      "Thank you for sharing that. Now, let's talk about your technical experience. What technologies are you most proficient in?",
      "I see. How do you handle challenging situations or conflicts in a team environment?",
      "Great. What makes you uniquely qualified for this position compared to other candidates?",
      "Excellent. Do you have any questions about the role or our company?",
    ];

    // Return a random follow-up question (in production, use AI to generate contextual questions)
    return responses[Math.floor(Math.random() * responses.length)];
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

      // Listen for avatar messages
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (message: string) => {
        console.log("Avatar talking message:", message);
        // In interview mode, this would be the avatar's response
        if (!isInterviewMode || !interviewStarted) {
          setMessages((prev) => [...prev, { text: message, isUser: false }]);
        }
      });

      // Listen for when avatar starts talking
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        console.log("Avatar started talking");
      });

      // Listen for when avatar stops talking
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log("Avatar stopped talking");
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

  // Pre-session setup for interview mode
  if (
    sessionState === StreamingAvatarSessionState.INACTIVE &&
    isInterviewMode &&
    (!jobDescription || !candidateResume)
  ) {
    return (
      <div className="w-full h-full flex flex-col bg-black p-8">
        <div className="max-w-2xl mx-auto w-full space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            Interview Setup
          </h2>

          <div>
            <label className="block text-white mb-2">Job Description</label>
            <textarea
              className="w-full h-32 p-3 bg-zinc-800 text-white rounded border border-zinc-700"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-white mb-2">Candidate Resume</label>
            <textarea
              className="w-full h-32 p-3 bg-zinc-800 text-white rounded border border-zinc-700"
              placeholder="Paste the candidate's resume here..."
              value={candidateResume}
              onChange={(e) => setCandidateResume(e.target.value)}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              disabled={!jobDescription || !candidateResume}
              onClick={() => startSessionV2(true)}
            >
              Start Interview (Voice)
            </Button>
            <Button
              disabled={!jobDescription || !candidateResume}
              onClick={() => startSessionV2(false)}
            >
              Start Interview (Text)
            </Button>
            <Button onClick={() => setIsInterviewMode(false)}>
              Regular Chat Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              muted
              playsInline
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
            {isInterviewMode && !interviewStarted && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={startInterview}
              >
                Start Interview
              </Button>
            )}
            <Button onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? "Show Video" : "Show Transcript"}
            </Button>
            <Input
              className="flex-1"
              placeholder={
                isInterviewMode ? "Your answer..." : "Type your message..."
              }
              value={chatInput}
              onChange={setChatInput}
            />
            <Button onClick={handleSendMessage}>Send</Button>
            <Button
              onClick={() => (isMuted ? unmuteInputAudio() : muteInputAudio())}
            >
              {isMuted ? "Unmute" : "Mute"}
            </Button>
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

export default function InteractiveAvatarWrapper({
  knowledgeBaseId,
}: InteractiveAvatarProps) {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar knowledgeBaseId={knowledgeBaseId} />
    </StreamingAvatarProvider>
  );
}

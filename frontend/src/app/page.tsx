"use client";

import AudioChat from "@/components/AudioChat";
import { ChatHistory } from "@/components/ChatDialog";
import { Composer } from "@/components/Composer";
import { Header } from "@/components/Header";
import { useAudio } from "@/hooks/useAudio";
import { useWebsocket } from "@/hooks/useWebsocket";
import { useState } from "react";

import "./styles.css";
import TaskSidebar, { Task } from "@/components/TaskSidebar";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const {
    isReady: audioIsReady,
    playAudio,
    startRecording,
    stopRecording,
    stopPlaying,
    frequencies,
    playbackFrequencies,
  } = useAudio();
  const {
    isReady: websocketReady,
    sendAudioMessage,
    sendTextMessage,
    history: messages,
    resetHistory,
    isLoading,
    agentName,
  } = useWebsocket({
    onNewAudio: playAudio,
    onWsMessage: (message) => {
      const data = JSON.parse(message);
      if (data.type && data.type.includes("task")) {
        handleTaskUpdate(data);
      }
    },
  });

  function handleSubmit() {
    setPrompt("");
    sendTextMessage(prompt);
  }

  async function handleStopPlaying() {
    await stopPlaying();
  }

  function handleTaskUpdate(data: any) {
    if (data.type === "task.updated") {
      const updatedTask = data.task;
      if (updatedTask) {
        setTasks((prevTasks) => {
          const existingTask = prevTasks.find((t) => t.id === updatedTask.id);
          if (existingTask) {
            // Merge fields: set all set fields, append any new messages
            const mergedMessages = [
              ...existingTask.messages,
              ...updatedTask.messages.filter(
                (msg: string) => !existingTask.messages.includes(msg)
              ),
            ];
            return prevTasks.map((t) =>
              t.id === updatedTask.id
                ? {
                    ...t,
                    ...updatedTask,
                    messages: mergedMessages,
                  }
                : t
            );
          } else {
            // No task found, create one
            return [...prevTasks, updatedTask];
          }
        });
      }
    }
  }

  return (
    <div className="w-full h-dvh flex">
      {/* Left sidebar for tasks */}
      <TaskSidebar tasks={tasks} setTasks={setTasks} />
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center">
        <Header
          agentName={agentName ?? ""}
          playbackFrequencies={playbackFrequencies}
          stopPlaying={handleStopPlaying}
          resetConversation={resetHistory}
        />
        <ChatHistory messages={messages} isLoading={isLoading} />
        <Composer
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          audioChat={
            <AudioChat
              frequencies={frequencies}
              isReady={websocketReady && audioIsReady}
              startRecording={startRecording}
              stopRecording={stopRecording}
              sendAudioMessage={sendAudioMessage}
            />
          }
        />
      </div>
    </div>
  );
}

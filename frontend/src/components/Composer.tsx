import { useEffect, useRef } from "react";

import ArrowUpIcon from "@/components/icons/ArrowUpIcon";
import { Button } from "@/components/ui/Button";

interface ComposerProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  audioChat?: React.ReactNode;
}

export function Composer({
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
  audioChat,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="flex flex-row relative px-5 py-6 w-full max-w-2xl">
      <div className="flex flex-row gap-2 w-full relative border-2 border-gray-100 rounded-[32px] focus:outline-none pl-6 pr-1 bg-white dark:bg-gray-900 dark:border-gray-700">
        <textarea
          ref={textareaRef}
          value={prompt}
          rows={1}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question"
          className="py-3 flex-grow resize-none overflow-hidden focus:outline-none bg-white text-black dark:bg-gray-900 dark:text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (prompt.trim() === "") {
                return;
              }
              onSubmit();
            }
          }}
        />
        <div className="flex flex-shrink-0 min-w-20 flex-row gap-2 items-center mt-1">
          {audioChat}
          <Button
            size="iconSmall"
            className="mb-1 me-1"
            variant="primary"
            onClick={onSubmit}
            disabled={isLoading || prompt.trim() === ""}
          >
            <ArrowUpIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

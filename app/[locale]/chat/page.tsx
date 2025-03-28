"use client";
import { useChat } from "ai/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import InputForm from "../../components/inputForm";
import Messages from "../../components/messages";
import PageLayout from "../../components/PageLayout";
import ChatResponseRobot from "../../components/robots/ChatResponseRobot";

export default function ChatPage() {
  const t = useTranslations("chat");
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/genai",
    });

  const [responding, setResponding] = useState(false);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      setResponding(true);
      const timer = setTimeout(() => {
        setResponding(false);
      }, 2000); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold mb-8 text-[#FF6B9D]">{t("title")}</h1>
      <ChatResponseRobot responding={responding} />
      <InputForm
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        placeholder={t("placeholder")}
      />
      <Messages messages={messages} isLoading={isLoading} />
    </PageLayout>
  );
}

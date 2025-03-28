"use client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DailyChallenge from "../../components/DailyChallenge";
import PageLayout from "../../components/PageLayout";
import EmotionalRobot from "../../components/robots/EmotionalRobot";
import WelcomeProgress from "../../components/WelcomeProgress";

interface Question {
  question: string;
  answer: number;
  options: number[];
}

type Operation = "add" | "subtract" | "multiply";

export default function MathGame() {
  const t = useTranslations("math");
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setDailyChallengeCompleted] = useState(false);
  const [robotEmotion, setRobotEmotion] = useState<
    "neutral" | "happy" | "sad" | "angry" | "afraid" | "surprise"
  >("neutral");

  const generateQuestion = () => {
    setIsLoading(true);
    setShowResult(false);
    setRobotEmotion("neutral");

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    let answer: number;
    let operator: string;
    let questionNum1 = num1;
    let questionNum2 = num2;

    switch (selectedOperation) {
      case "add":
        answer = num1 + num2;
        operator = "+";
        break;
      case "subtract":
        answer = num1 - num2;
        operator = "-";
        break;
      case "multiply":
        questionNum1 = Math.floor(Math.random() * 3) + 1;
        questionNum2 = Math.floor(Math.random() * 3) + 1;
        answer = questionNum1 * questionNum2;
        operator = "×";
        break;
      default:
        answer = 0;
        operator = "";
    }

    const questionText = t("question", {
      num1: selectedOperation === "multiply" ? questionNum1 : num1,
      num2: selectedOperation === "multiply" ? questionNum2 : num2,
      operator,
    });

    let options = [answer];
    while (options.length < 4) {
      const wrongAnswer =
        answer + Math.floor(Math.random() * 5) * (Math.random() < 0.5 ? 1 : -1);
      if (!options.includes(wrongAnswer) && wrongAnswer > 0) {
        options.push(wrongAnswer);
      }
    }

    options = options.sort(() => Math.random() - 0.5);

    setQuestion({
      question: questionText,
      answer: answer,
      options: options,
    });

    setIsLoading(false);
  };

  const checkAnswer = (selectedAnswer: number) => {
    if (!question) return;

    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setRobotEmotion("happy");
      setScore(score + 1);
    } else {
      setRobotEmotion("sad");
    }
  };

  const selectOperation = (operation: Operation) => {
    setSelectedOperation(operation);
    generateQuestion();
  };

  useEffect(() => {
    if (selectedOperation) {
      generateQuestion();
    }
  }, [selectedOperation]);

  // Get robot message based on emotion
  const getRobotMessage = () => {
    if (!showResult) return t("robotMessages.thinking");

    if (isCorrect) {
      return t("robotMessages.correct");
    } else {
      return t("robotMessages.incorrect");
    }
  };

  return (
    <PageLayout>
      <WelcomeProgress progress={65} />

      <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">{t("title")}</h1>

      {!selectedOperation ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-6xl">
          <div className="text-2xl font-semibold mb-6 text-[#1a1a1a]">
            {t("chooseOperation")}
          </div>
          <div className="w-full flex flex-col gap-4 mb-8">
            <button
              onClick={() => selectOperation("add")}
              className="w-full h-20 rounded-xl bg-[#4ADE80] text-white p-6 flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="text-4xl mr-4">+</span>
              <span className="text-2xl font-semibold">
                {t("operations.addition")}
              </span>
            </button>
            <button
              onClick={() => selectOperation("subtract")}
              className="w-full h-20 rounded-xl bg-[#EAB308] text-white p-6 flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="text-4xl mr-4">−</span>
              <span className="text-2xl font-semibold">
                {t("operations.subtraction")}
              </span>
            </button>
            <button
              onClick={() => selectOperation("multiply")}
              className="w-full h-20 rounded-xl bg-[#EF4444] text-white p-6 flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="text-4xl mr-4">×</span>
              <span className="text-2xl font-semibold">
                {t("operations.multiplication")}
              </span>
            </button>
          </div>
          <div className="mt-8">
            <DailyChallenge
              onAnswerSubmit={(correct) => setDailyChallengeCompleted(correct)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="text-xl mb-4 text-[#FF6B9D]">
            {t("score", { score })}
          </div>
          <button
            onClick={() => setSelectedOperation(null)}
            className="mb-6 px-6 py-3 text-lg bg-[#FF8FB1] text-white rounded-lg hover:bg-[#FF8FB1]/90 transition-colors font-semibold"
          >
            {t("changeOperation")}
          </button>

          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B9D]" />
          ) : (
            <div className="flex flex-col items-center gap-6">
              {/* Robot with emotion and speech bubble */}
              <div className="relative mb-8">
                <div className="mb-4 transition-all duration-300">
                  <EmotionalRobot emotion={robotEmotion} size={180} />
                </div>

                {/* Speech bubble */}
                <div className="absolute right-[-200px] top-16 bg-white p-4 rounded-xl shadow-md max-w-[200px] border-2 border-[#FFB6C1] before:content-[''] before:absolute before:left-[-10px] before:top-[20px] before:border-t-[10px] before:border-r-[10px] before:border-b-[10px] before:border-t-transparent before:border-r-white before:border-b-transparent">
                  <p className="text-[#1a1a1a] text-sm font-medium">
                    {getRobotMessage()}
                  </p>
                </div>
              </div>

              {question && (
                <>
                  <div className="text-2xl font-semibold mb-4 text-[#FF6B9D]">
                    {question.question}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => checkAnswer(option)}
                        disabled={showResult}
                        className="px-6 py-3 text-xl bg-[#FF6B9D] text-white rounded-lg hover:bg-[#FF6B9D]/90 disabled:opacity-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {showResult && isCorrect && (
                <div className="text-xl font-bold text-green-500">
                  {t("correct")}
                </div>
              )}

              {showResult && !isCorrect && (
                <div className="text-xl font-bold text-red-500">
                  {t("incorrect")}
                </div>
              )}

              {showResult && (
                <button
                  onClick={
                    isCorrect ? generateQuestion : () => setShowResult(false)
                  }
                  className="mt-4 px-6 py-3 bg-[#FF6B9D] text-white rounded-lg hover:bg-[#FF6B9D]/90"
                >
                  {isCorrect ? t("nextQuestion") : t("tryAgain")}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}

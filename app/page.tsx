"use client";

import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractTextFromFile } from "@/utils/fileParser";
import { generateContent } from "@/utils/geminiClient";
import { Quiz } from "./components/Quiz";
import { Flashcard } from "./components/Flashcard";
import { PracticeQuestions } from "./components/PracticeQuestions";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface FlashcardItem {
  front: string;
  back: string;
}

interface PracticeQuestion {
  question: string;
  answer: string;
}

export default function Home() {
  const [fileContent, setFileContent] = useState("");
  const [quizzes, setQuizzes] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<
    PracticeQuestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const text = await extractTextFromFile(file);
    setFileContent(text);
    setIsLoading(false);
  };

  const generateExamPrep = async () => {
    if (fileContent) {
      setIsLoading(true);
      try {
        const quizContent = await generateContent(
          "Generate a quiz with 10 multiple-choice questions based on this content. Format the response as a JSON array of objects, each with 'question', 'options' (array of strings), and 'correctAnswer' fields.",
          fileContent
        );
        const parsedQuizContent = JSON.parse(quizContent);
        setQuizzes(parsedQuizContent);
      } catch (error) {
        console.error("Failed to parse quiz content:", error);
        setQuizzes([]);
      }

      try {
        const flashcardContent = await generateContent(
          "Create 10 flashcards based on this content. Format the response as a JSON array of objects, each with 'front' and 'back' fields.",
          fileContent
        );
        const parsedFlashcardContent = JSON.parse(flashcardContent);
        setFlashcards(parsedFlashcardContent);
      } catch (error) {
        console.error("Failed to parse flashcard content:", error);
        setFlashcards([]);
      }

      try {
        const practiceQuestionsContent = await generateContent(
          "Generate 5 practice questions based on this content. Format the response as a JSON array of objects, each with 'question' and 'answer' fields.",
          fileContent
        );
        const parsedPracticeQuestionsContent = JSON.parse(
          practiceQuestionsContent
        );
        setPracticeQuestions(parsedPracticeQuestionsContent);
      } catch (error) {
        console.error("Failed to parse practice questions content:", error);
        setPracticeQuestions([]);
      }

      setIsLoading(false);
    }
  };

  const fetchMoreQuestions = async (
    type: "quiz" | "flashcard" | "practice"
  ) => {
    if (fileContent) {
      setIsLoading(true);
      try {
        let content;
        switch (type) {
          case "quiz":
            content = await generateContent(
              "Generate 5 more multiple-choice questions based on this content. Format the response as a JSON array of objects, each with 'question', 'options' (array of strings), and 'correctAnswer' fields.",
              fileContent
            );
            const parsedQuizContent = JSON.parse(content);
            setQuizzes((prev) => [...prev, ...parsedQuizContent]);
            break;
          case "flashcard":
            content = await generateContent(
              "Create 5 more flashcards based on this content. Format the response as a JSON array of objects, each with 'front' and 'back' fields.",
              fileContent
            );
            const parsedFlashcardContent = JSON.parse(content);
            setFlashcards((prev) => [...prev, ...parsedFlashcardContent]);
            break;
          case "practice":
            content = await generateContent(
              "Generate 3 more practice questions based on this content. Format the response as a JSON array of objects, each with 'question' and 'answer' fields.",
              fileContent
            );
            const parsedPracticeQuestionsContent = JSON.parse(content);
            setPracticeQuestions((prev) => [
              ...prev,
              ...parsedPracticeQuestionsContent,
            ]);
            break;
        }
      } catch (error) {
        console.error(`Failed to fetch more ${type} questions:`, error);
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Exam Preparation App
      </h1>
      <div className="max-w-2xl mx-auto mb-8">
        <FileUpload onFileUpload={handleFileUpload} />
        <Button
          className="mt-4 w-full"
          onClick={generateExamPrep}
          disabled={!fileContent || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Exam Prep"}
        </Button>
      </div>

      {(quizzes.length > 0 ||
        flashcards.length > 0 ||
        practiceQuestions.length > 0) && (
        <Tabs defaultValue="quiz" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="practice">Practice Questions</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            {quizzes.length > 0 && <Quiz questions={quizzes} />}
            <Button
              onClick={() => fetchMoreQuestions("quiz")}
              className="mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Fetch More Quiz Questions"}
            </Button>
          </TabsContent>
          <TabsContent value="flashcards">
            {flashcards.length > 0 && <Flashcard flashcards={flashcards} />}
            <Button
              onClick={() => fetchMoreQuestions("flashcard")}
              className="mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Fetch More Flashcards"}
            </Button>
          </TabsContent>
          <TabsContent value="practice">
            {practiceQuestions.length > 0 && (
              <PracticeQuestions questions={practiceQuestions} />
            )}
            <Button
              onClick={() => fetchMoreQuestions("practice")}
              className="mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Fetch More Practice Questions"}
            </Button>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  question: string;
  answer: string;
}

interface PracticeQuestionsProps {
  questions: Question[];
}

export function PracticeQuestions({ questions }: PracticeQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setUserAnswer("");
    setShowAnswer(false);
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  const question = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Practice Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-lg">{question.question}</p>
        <Textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="mb-4"
        />
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} className="mr-2">
            Show Answer
          </Button>
        ) : (
          <>
            <p className="mb-4 font-semibold">Suggested Answer:</p>
            <p className="mb-4">{question.answer}</p>
          </>
        )}
        <Button onClick={handleNext}>Next Question</Button>
      </CardContent>
    </Card>
  );
}

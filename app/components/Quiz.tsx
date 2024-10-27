import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: Question[];
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    setSelectedAnswer("");
    setShowResult(false);
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  const question = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Quiz</CardTitle>
        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-lg">{question.question}</p>
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {!showResult ? (
          <Button
            onClick={handleAnswer}
            className="mt-4"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        ) : (
          <div className="mt-4">
            <p
              className={`font-bold ${
                selectedAnswer === question.correctAnswer
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {selectedAnswer === question.correctAnswer
                ? "Correct!"
                : "Incorrect. The correct answer is: " + question.correctAnswer}
            </p>
            <Button onClick={handleNext} className="mt-2">
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

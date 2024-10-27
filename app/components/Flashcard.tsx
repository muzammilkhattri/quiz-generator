import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FlashcardItem {
  front: string;
  back: string;
}

interface FlashcardProps {
  flashcards: FlashcardItem[];
}

export function Flashcard({ flashcards }: FlashcardProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-64 w-full [perspective:1000px]">
        <div
          className={`absolute w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute w-full h-full flex items-center justify-center p-6 bg-white rounded-lg shadow [backface-visibility:hidden]">
            <p className="text-xl font-semibold text-center text-black">
              {flashcards[currentCard].front}
            </p>
          </div>
          <div className="absolute w-full h-full flex items-center justify-center p-6 bg-gray-100 rounded-lg shadow [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-xl text-center text-black">
              {flashcards[currentCard].back}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrevious}>Previous</Button>
        <Button onClick={() => setIsFlipped(!isFlipped)}>
          {isFlipped ? "Show Question" : "Show Answer"}
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
      <p className="text-center mt-2">
        Card {currentCard + 1} of {flashcards.length}
      </p>
    </div>
  );
}

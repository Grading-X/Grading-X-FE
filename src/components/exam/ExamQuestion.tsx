import {Question} from "@/api/question/question.response.ts";
import {Input} from "@/components/ui/input.tsx";

interface Props {
  questions: Question;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

export default function ExamQuestion({questions, answer, onAnswerChange}: Props) {
  return (
    <div className="border rounded pt-6 pb-4 pl-4 mb-4">
      <h3 className="font-medium text-[20px]"> {questions.index}. {questions.query}</h3>
      <h4 className="mb-4">{questions.weightage}점</h4>
      <Input value={answer} onChange={(e) => onAnswerChange(e.target.value)}/>
    </div>
  );

}
import {Question} from "@/api/question/question.response.ts";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ChevronDown, ChevronUp, Trash} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

interface Props {
  question: Question;
  onQuestionChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
  onChangeUp : (id:number) => void;
  onChangeDown : (id:number) => void;
  onDelete : (id:number) => void;
  isLast: boolean;
}
export default function ExamQuestionEditItem({question, onQuestionChange, onChangeUp, onChangeDown, onDelete, isLast}: Props) {

  return (
    <div className="flex flex-col border m-2 p-4 w-80">
      <div className="flex flex-row">
        <div className="flex-1">
          문제 {question.index}
        </div>

        <Button disabled={question.index === 1}
          variant="outline" size="icon"
          onClick={()=> onChangeUp(question.id)}
        >
          <ChevronUp className="h-4 w-4"  />
        </Button>

        <Button disabled={isLast}
          variant="outline" size="icon"
          onClick={()=> onChangeDown(question.id)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline" size="icon"
          onClick={()=> onDelete(question.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="weightage" className="text-left">
          배점
        </Label>
        <Input
          name="weightage" placeholder="배점"
          value={question.weightage}
          onChange={onQuestionChange}
          className="col-span-3"
        />
      </div>
      <div className="mt-2 flex flex-col space-y-1.5">
        <Label htmlFor="query" className="text-left">
          문제
        </Label>
        <Input
          name="query" placeholder="문제"
          value={question.query}
          onChange={onQuestionChange}
          className="col-span-3"
        />
      </div>
    </div>
  );
}
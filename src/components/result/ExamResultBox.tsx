import {useQuery} from "@tanstack/react-query";
import {DASHBOARD, RESULT} from "@/const/data.ts";
import {Result, ResultForInstructorResponse} from "@/api/result/result.response.ts";
import {getResultForInstructorByExamId} from "@/api/result/resut.api.ts";
import {useEffect, useState} from "react";

interface Props {
  examId: number;
  forceUpdateFlag: boolean;
}

export default function ExamResultBox({examId, forceUpdateFlag}: Props) {

  const {data, refetch} = useQuery<ResultForInstructorResponse, Object, ResultForInstructorResponse, [_1: string, _2: string, _3: number]>({
    queryKey: [DASHBOARD, RESULT, examId],
    queryFn: getResultForInstructorByExamId,
    staleTime: 1000,
  });

  const results = data?.resultInstructorResponses ?? [];

  useEffect(() => {
    refetch();
  }, [forceUpdateFlag]);


  return (
    <div
      className="flex flex-col items-start justify-start
      w-full h-full overflow-y-auto"
    >
      {results.length === 0 ?
        <div>
          결과가 없습니다.
        </div> :
        <>
          <div className="border rounded w-full p-1 my-4">
            <h1 className="mt-2 ml-2 text-2xl font-medium mb-4">결과 {results.length}개</h1>
            <div className="flex flex-row pr-20 pl-20 w-full">
              <div className="flex-[2]">
                이메일
              </div>
              <div className="flex-[1]">
                점수
              </div>
              <div className="flex-[1]">
                총점
              </div>
              <div className="flex-[1]"/>
            </div>

          </div>
          {
            results.map((result) => (
              <AnswerItem key={result.email} result={result}/>
            ))
          }
        </>

      }

    </div>
  );
}


interface AnswerItemProps {
  result: Result;
}

function AnswerItem({result}: AnswerItemProps) {


  const [selected, setSelected] = useState<boolean>(false);

  const onClick = () => {
    setSelected(!selected);
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between pr-20 pl-20 w-full border rounded py-1 my-1 bg-gray-50">
        <div className="flex-[2]">{result.email}</div>
        <div className="flex-[1]">{result.totalScore}</div>
        <div className="flex-[1]">{result.totalWeightage}</div>
        <button className="flex-[1]" onClick={onClick}>답안 보기</button>

      </div>

      {selected && result.gradingResponseList.map((grading) => (
        <div key={grading.answerId} className="p-2 pl-4 border rounded m-1">
          <div className="font-medium text-[20px] mb-4">{grading.query}</div>
          <div className="font-normal  text-gray-500 underline">{grading.answer}</div>
          <div>점수 : {grading.score}</div>
        </div>
      ))}
    </div>
  );
}
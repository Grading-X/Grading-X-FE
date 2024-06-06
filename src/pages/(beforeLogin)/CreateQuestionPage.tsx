import {useState} from "react";
import {createQuestionByAI, QuestionAnswerResponse} from "@/api/question/question.api.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Oval} from "react-loader-spinner";

interface QuestionPageState {
  selectedFile: File | null;
  response: QuestionAnswerResponse | null;
  error: string | null;
  loading: boolean;
}

export const CreateQuestionPage = () => {

  const [questionState, setQuestionState] = useState<QuestionPageState>({
    selectedFile: null,
    response: null,
    error: null,
    loading: false,
  });


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setQuestionState({
        ...questionState,
        selectedFile: event.target.files[0],
      });
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!questionState.selectedFile) {
      setQuestionState({
        ...questionState,
        error: '업로드할 파일을 선택해주세요.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', questionState.selectedFile);

    try {
      setQuestionState({
        ...questionState,
        loading: true,
      });
      const result = await createQuestionByAI(formData);
      setQuestionState({
        ...questionState,
        response: result,
        error: null,
        loading: false,
      });
    } catch (error) {
      setQuestionState({
        ...questionState,
        error: '파일 업로드 중 오류가 발생했습니다.',
        loading: false,
      });
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <h1>Upload a File</h1>
      <div className="flex flex-row items-stretch">
        <form onSubmit={handleSubmit} encType="mult-part/form-data" className="border p-4 w-[600px]">

          <Input type="file" onChange={handleFileChange}/>
          <Button disabled={questionState.selectedFile === null} type="submit" className="mt-10 w-full border-buttonGreenBorder bg-buttonGreen
         text-white hover:text-white hover:bg-[#38996b]/80 focus:ring-[#3ecf8e]">업로드</Button>
        </form>
      </div>
      {questionState.error && <p style={{color: 'red'}}>{questionState.error}</p>}
      {questionState.loading &&
          <Oval/>
      }
      <div className="h-20"/>
      {questionState.response && (
        questionState.response.questions_answers.map((qa, index) => (
          <div key={index} className="border rounded-md p-4 mb-4 w-[600px] flex flex-col justify-between">

            <p>문제: {qa.문제}</p>
            <div className="h-12" />
            <p>답안: {qa.답안}</p>
          </div>
        ))
      )}
    </div>
  );

}
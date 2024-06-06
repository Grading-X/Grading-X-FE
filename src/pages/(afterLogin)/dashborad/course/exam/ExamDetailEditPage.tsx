import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getExamDetailById, updateExamDetail} from "@/api/exam/exam.api.ts";
import {COURSES, DASHBOARD, EXAMS, MINUTE_5} from "@/const/data.ts";
import {ExamDetail} from "@/api/exam/exam.response.ts";
import {ExamUpdateRequest} from "@/api/exam/exam.request.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import CalendarWithTimePicker from "@/components/common/CalendarWithTimePicker.tsx";
import {GreenButton} from "@/components/ui/GreenButton.tsx";

function parseUrl(url: string) {
  const examId = parseInt(url.split("/")[5] || "0");
  const courseId = parseInt(url.split("/")[3] || "0");
  return [examId, courseId];
}

export default function ExamDetailEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // /dashboard/course/3/exam/4/edit 에서 4을 추출

  const currentUrl = location.pathname;
  const prevUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
  const [examId, courseId] = parseUrl(currentUrl);


  const {data} = useQuery<ExamDetail, Object, ExamDetail, [_1: string, _2:string, _3: number]>({
    queryKey: [DASHBOARD, EXAMS, examId],
    queryFn: getExamDetailById,
    staleTime: MINUTE_5,
  });

  const [updateExamDto, setUpdateExamDto] = useState<ExamUpdateRequest>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setUpdateExamDto({
        name: data.name,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUpdateExamDto((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const changeStartDate = (date: Date | undefined) => {
    if (!date) return;
    setUpdateExamDto({
      ...updateExamDto,
      startTime: date.toISOString(),
    });
  }
  const changeEndDate = (date: Date | undefined) => {
    if (!date) return;
    setUpdateExamDto({
      ...updateExamDto,
      endTime:  date.toISOString(),
    });
  }

  const queryClient = useQueryClient();

  const handleSaveClick = async () => {
    if (!updateExamDto.name || !updateExamDto.description || !updateExamDto.startTime || !updateExamDto.endTime) {
      alert('입력 값을 확인해주세요.');
    }
    //2024-04-08T00:00:00.000Z 형식으로 변환
    const converted = {
      ...updateExamDto,
      startTime: new Date(updateExamDto.startTime).toISOString(),
      endTime: new Date(updateExamDto.endTime).toISOString(),
    }

    await updateExamDetail(examId, converted);

    await queryClient.invalidateQueries({
      queryKey: [DASHBOARD, COURSES, courseId, EXAMS],
    });
    await queryClient.invalidateQueries({
      queryKey: [DASHBOARD, EXAMS, examId],
    });

    navigate(prevUrl, {replace: true});
  }
  const startDate = updateExamDto.startTime ? new Date(updateExamDto.startTime) : undefined;
  const endDate = updateExamDto.endTime ? new Date(updateExamDto.endTime) : undefined;
  const cancelClick = () => {
    console.log('cancel');
    navigate(prevUrl, {replace: true});
  }

  const isEdited = (a: ExamUpdateRequest, b? : ExamDetail) => {
    if (!b) return true;
    return !(a.name === b.name && a.description === b.description && a.startTime === b.startTime && a.endTime === b.endTime);
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Card className="mt-32 w-[350px]">
        <CardHeader>
          <CardTitle>
            시험 정보 수정
          </CardTitle>
          <CardDescription>
            시험 정보를 수정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-left">
                  시험 이름
                </Label>
                <Input
                  name="name" placeholder="시험 이름"
                  value={updateExamDto.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description" className="text-left">
                  설명
                </Label>
                <Input
                  name="description" placeholder="설명"
                  value={updateExamDto.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-left">
                  시작일
                </Label>
                <CalendarWithTimePicker
                  date={startDate}
                  onSelect={changeStartDate}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-left">
                  종료일
                </Label>
                <CalendarWithTimePicker
                  date={endDate}
                  onSelect={changeEndDate}
                />
              </div>

            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={cancelClick}>취소</Button>
          <GreenButton
            onClick={handleSaveClick}
            disabled={!isEdited(updateExamDto, data)}
          >
            저장
          </GreenButton>
        </CardFooter>
      </Card>
    </div>
  );
}
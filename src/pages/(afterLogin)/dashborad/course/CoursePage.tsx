import {getCourses} from "@/api/course/course.api.ts";
import {useQuery} from "@tanstack/react-query";
import {CoursesResponse} from "@/api/course/course.response.ts";
import {Link, useNavigate} from "react-router-dom";
import CourseItem from "../../../../components/course/CourseItem.tsx";
import {COURSES, DASHBOARD, MEMBER, MINUTE_5} from "@/const/data.ts";
import {Button} from "@/components/ui/button.tsx";

export default function CoursePage() {

  const {data} = useQuery<CoursesResponse>({
    queryKey: [MEMBER, DASHBOARD, COURSES],
    queryFn: getCourses,
    staleTime: MINUTE_5, // 5 minutes 동안 fresh data를 유지(fresh -> stale)
  });

  const nav = useNavigate();

  const onClick = (id: number) => {
    console.log('click');
    nav(`/dashboard/course/${id}/exam`);
  }


  return (
    <div className="w-full h-screen flex flex-col p-8 items-center overflow-y-auto">
      <div className="grid grid-cols-4 gap-5">
        {
          data?.courseResponses.map((course) => (
            <div className="" key={course.id}>
              <CourseItem course={course} onClick={() => onClick(course.id)}/>
            </div>
          ))
        }
      </div>

      <div className="w-full border rounded flex flex-col items-center mt-6">
        <p className="mt-6 mb-4">create a new course</p>

        <Button className="" size={"default"} asChild>
          <Link to="/dashboard/course/create">Create a new course</Link>
        </Button>
        <div className="mb-12"/>
      </div>

    </div>
  );
}
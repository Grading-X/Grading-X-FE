import style from "@/app/(afterLogin)/dashboard/course/_component/courseItem.module.css";

type Props = {
  onClick: () => void;
}

export default function CourseItem({onClick}: Props) {

  return (
    <div className={style.container} onClick={onClick}>
      <div>
        <h2>클래스 이름</h2>
        <p>클래스 설명</p>
      </div>

      <div>
        <h2>시작일</h2>
        <h2>종료일</h2>
      </div>
      <div>
        <h2>수강생</h2>
        <p>수강생 수</p>
      </div>
    </div>
  );
}
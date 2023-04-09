import { CircularProgress, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export function InfoPage() {
  const loading = useSelector(
    (state: RootState) => state.visitLogSlice.isLoading
  );
  const studentsCount = useSelector(
    (state: RootState) => state.visitLogSlice.students.length
  );
  const lessons = useSelector(
    (state: RootState) => state.visitLogSlice.lessons
  );

  const biggestLessonsCount = useMemo(() => {
    let biggestCount = 0;
    let result = {};

    lessons.forEach((i) => {
      const countArray = i.Title.split("/");
      const count = Number(countArray[0]) + Number(countArray[1]);

      if (count > biggestCount) {
        result = i;
        biggestCount = count;
      }
    });

    return JSON.stringify(result);
  }, [lessons]);

  if (loading) {
    return (
      <CircularProgress
        sx={{ position: "absolute", left: "50%", top: "50%" }}
      />
    );
  }

  return (
    <>
      <Typography>Кількість учнів: {studentsCount}</Typography>
      <Typography>
        Урок з найбільшим складеним тайтлом: {biggestLessonsCount}
      </Typography>
    </>
  );
}

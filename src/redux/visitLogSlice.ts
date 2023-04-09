import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../api/service";

export interface ILesson {
  Id: number;
  Title: string;
}

export interface IStudent {
  index: number;
  name: string;
  id: number;
  absence: { [key: number]: boolean };
}

export interface IVisitLogState {
  isLoading: boolean;
  students: IStudent[];
  lessons: ILesson[];
}

const initialState: IVisitLogState = {
  students: [],
  lessons: [],
  isLoading: false,
};

export const fetchVisitLogData = createAsyncThunk(
  "visitLog/fetchData",
  async () => {
    const data = await Promise.all([
      apiService.getStudentsList(),
      apiService.getLessonsList(),
      apiService.getRateList(),
    ]);

    return data;
  }
);

export const optimisticRateAbsence = createAsyncThunk(
  "visitLog/optimisticRateAbsence",
  async ({
    schoolboyId,
    columnId,
  }: {
    schoolboyId: number;
    columnId: number;
  }) => {
    await apiService.postAbsence(schoolboyId, columnId);
  }
);

export const optimisticUnRateAbsence = createAsyncThunk(
  "visitLog/optimisticUnRateAbsence",
  async ({
    schoolboyId,
    columnId,
  }: {
    schoolboyId: number;
    columnId: number;
  }) => {
    await apiService.postUnAbsence(schoolboyId, columnId);
  }
);

export const visitLogSlice = createSlice({
  name: "visitLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVisitLogData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchVisitLogData.fulfilled, (state, action) => {
      const data = action.payload;
      state.isLoading = false;
      state.lessons = data[1].Items;
      state.students = data[0].Items.map(
        (
          i: {
            LastName: string;
            FirstName: string;
            SecondName: string;
            Id: number;
          },
          index: number
        ) => {
          return {
            index,
            name: `${i.LastName || "-"} ${i.FirstName || "-"} ${
              i.SecondName || "-"
            }`,
            id: i.Id,
            absence: data[2].Items.filter(
              (item: { SchoolboyId: number }) => item.SchoolboyId === i.Id
            ).reduce((accum: any, { ColumnId }: { ColumnId: number }) => {
              return {
                ...accum,
                [ColumnId]: true,
              };
            }, {}),
          };
        }
      );
    });
    builder.addCase(optimisticRateAbsence.pending, (state, action) => {
      const { schoolboyId, columnId } = action.meta.arg;
      const student = state.students.find(
        (student) => student.id === schoolboyId
      );
      if (student) {
        student.absence = { ...student.absence, [columnId]: true };
      }
    });
    builder.addCase(optimisticRateAbsence.rejected, (state, action) => {
      const { schoolboyId, columnId } = action.meta.arg;
      const student = state.students.find(
        (student) => student.id === schoolboyId
      );
      if (student) {
        student.absence = { ...student.absence, [columnId]: false };
      }
    });
    builder.addCase(optimisticUnRateAbsence.pending, (state, action) => {
      const { schoolboyId, columnId } = action.meta.arg;
      const student = state.students.find(
        (student) => student.id === schoolboyId
      );
      if (student) {
        student.absence = { ...student.absence, [columnId]: false };
      }
    });
    builder.addCase(optimisticUnRateAbsence.rejected, (state, action) => {
      const { schoolboyId, columnId } = action.meta.arg;
      const student = state.students.find(
        (student) => student.id === schoolboyId
      );
      if (student) {
        student.absence = { ...student.absence, [columnId]: true };
      }
    });
  },
});

export const {} = visitLogSlice.actions;

export default visitLogSlice.reducer;

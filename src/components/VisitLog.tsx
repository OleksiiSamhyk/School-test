import { Checkbox } from "@mui/material";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  IStudent,
  optimisticRateAbsence,
  optimisticUnRateAbsence,
} from "../redux/visitLogSlice";

export const VisitLog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const lessons = useSelector(
    (state: RootState) => state.visitLogSlice.lessons
  );
  const students: IStudent[] = useSelector(
    (state: RootState) => state.visitLogSlice.students
  );
  const loading = useSelector(
    (state: RootState) => state.visitLogSlice.isLoading
  );

  const columns: GridColDef[] = useMemo(() => {
    const lessonsFields = lessons.map(
      (lesson) =>
        ({
          field: String(lesson.Id),
          headerName: lesson.Title,
          width: 150,
          renderCell: (params: GridRenderCellParams) => {
            return (
              <strong>
                <Checkbox
                  checked={Boolean(params.value)}
                  onChange={(_, newValue) => {
                    dispatch(
                      newValue
                        ? optimisticRateAbsence({
                            schoolboyId: params.row.id,
                            columnId: Number(params.field),
                          })
                        : optimisticUnRateAbsence({
                            schoolboyId: params.row.id,
                            columnId: Number(params.field),
                          })
                    );
                  }}
                />
              </strong>
            );
          },
        } as GridColDef)
    );

    return [
      { field: "index", headerName: "№", width: 50, align: "center" },
      { field: "name", headerName: "Ім'я", width: 400 },
      ...lessonsFields,
    ];
  }, [lessons]);

  const rows: GridRowsProp = useMemo(() => {
    return students.map((i) => ({ ...i, ...i.absence }));
  }, [students]);

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <DataGrid loading={loading} rows={rows} columns={columns} />
    </div>
  );
};

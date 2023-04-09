import { toast } from "react-toastify";

const BASE_URL = "http://94.131.246.109:5555/v1/2";

class Service {
  private baseRequest(
    url: string,
    method: string = "GET",
    body?: { [key: string]: any }
  ) {
    return fetch(`${BASE_URL}/${url}`, {
      method,
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) {
        return method === "POST" ? "ok" : res.json();
      } else {
        res
          .text()
          .then((e) => {
            toast.error(e);
          })
          .catch(() => {
            toast.error("Unhandled error");
          });
      }
    });
  }

  getStudentsList() {
    return this.baseRequest("Schoolboy");
  }

  getLessonsList() {
    return this.baseRequest("Column");
  }

  getRateList() {
    return this.baseRequest("Rate");
  }

  postAbsence(schoolboyId: number, columnId: number) {
    return this.baseRequest("Rate", "POST", {
      ColumnId: columnId,
      SchoolboyId: schoolboyId,
      Title: "H",
    });
  }
  postUnAbsence(schoolboyId: number, columnId: number) {
    return this.baseRequest("UnRate", "POST", {
      ColumnId: columnId,
      SchoolboyId: schoolboyId,
    });
  }
}

export const apiService = new Service();

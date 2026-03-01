import axios from "axios";
import { getFilenameFromDisposition } from "./stockmovement-file";
export const downloadSalesReport = async () => {
  const res = await axios.get(
    "http://localhost:8000/api-dashboard/sales-report/?period=12months",
    { responseType: "blob" },
  );
  const filename = getFilenameFromDisposition(
    res.headers["content-disposition"],
  );
  const blob = new Blob([res.data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = filename;
  a.href = url;

  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};

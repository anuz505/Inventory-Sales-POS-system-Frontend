import axios from "axios";
function getFilenameFromDisposition(disposition?: string) {
  if (!disposition) return "download.csv";

  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? "download.csv";
}
export const downloadStockMovementCSV = async () => {
  const res = await axios.get(
    "http://localhost:8000/api-dashboard/stock-movement?period=12months",
    {
      responseType: "blob",
    },
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

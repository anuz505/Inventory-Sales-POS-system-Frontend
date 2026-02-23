export function buildApiUrl(
  base: string,
  params: { period?: string; from?: string; to?: string },
) {
  const url = new URL(base);
  if (params.period) {
    url.searchParams.append("period", params.period);
  } else if (params.from) {
    url.searchParams.append("from", params.from);
    url.searchParams.append(
      "to",
      params.to ?? new Date().toISOString().slice(0, 10),
    );
  } else {
    url.searchParams.append("period", "12months");
  }
  return url.toString();
}

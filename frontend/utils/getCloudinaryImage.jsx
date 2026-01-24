export const getCloudinaryImage = (
  url,
  { width = 400, quality = 40 } = {}
) => {
  if (!url) return "";

  return url.replace(
    "/upload/",
    `/upload/w_${width},q_${quality},f_auto/`
  );
};

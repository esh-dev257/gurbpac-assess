export default function FilePreview({
  fileUrl,
  alt = "Preview",
  className = "",
}) {
  if (!fileUrl) return null;
  return (
    <img
      src={fileUrl}
      alt={alt}
      className={`rounded shadow max-h-32 ${className}`}
    />
  );
}

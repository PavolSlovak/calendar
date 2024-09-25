export default function ErrorBlock({ error }: { error: any }) {
  const title = error?.title || "Error";
  const message = error?.message || "An error occurred";
  return (
    <div className="error-block">
      <div className="error-block-icon">!</div>
      <div className="error-block-text">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

import { ExclamationCircleIcon, StopIcon } from "@heroicons/react/outline";

export default function ErrorBlock({ error }: { error: any }) {
  const title = error?.title || "Error";
  const message = error?.message || "An error occurred";
  return (
    <div className="error-block">
      <ExclamationCircleIcon className="w-10 h-10" />
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

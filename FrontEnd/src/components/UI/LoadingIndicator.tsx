import "./LoadingIndicator.css";
export default function LoadingIndicator({ label }: { label: string }) {
  return (
    <div className="flex flex-col w-full justify-center items-center ">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="text-gray-500 text-sm mt-4">{label}</p>
    </div>
  );
}

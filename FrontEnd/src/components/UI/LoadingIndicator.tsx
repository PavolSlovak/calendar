import "./LoadingIndicator.css";
export default function LoadingIndicator() {
  return (
    <div className="flex flex-col w-full justify-center items-center ">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

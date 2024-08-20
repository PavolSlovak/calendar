function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center w-screen bg-slate-200">
      <div className="flex items-center justify-center py-2 w-full">
        &copy; Pavol Slovak
      </div>
      <div className="flex w-full justify-end  py-2 ">
        <div className="ml-10">2024</div>
        <div className="grow"></div>
        <div className="flex mr-10 ">
          <span className="flex-1 px-2 border text-center ">Item</span>
          <span className="flex-1 px-2 text-center border-r-2">Item</span>
          <span className="flex-1 px-2 text-center border-r-2">Item</span>
          <span className="flex-1 px-2 text-center">logo</span>
          <span className="flex-1 px-2 text-center">logo</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

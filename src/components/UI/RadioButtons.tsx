function RadioButtons({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="flex space-x-4 pt-1">
      <label className="relative">
        <input
          type="radio"
          className="appearance-none w-4 h-4 border-2 border-white rounded-full checked:bg-white"
          checked={currentSlide < 1}
          readOnly
          onFocus={(e) => e.preventDefault()}
        />
      </label>

      <label className="relative">
        <input
          type="radio"
          className="appearance-none w-4 h-4 border-2 border-white rounded-full checked:bg-white"
          checked={currentSlide < 2}
          readOnly
          onFocus={(e) => e.preventDefault()}
        />
      </label>
      <label className="relative">
        <input
          type="radio"
          className="appearance-none w-4 h-4 border-2 border-white rounded-full checked:bg-white "
          checked={currentSlide < 3}
          readOnly
          onFocus={(e) => e.preventDefault()} // Prevents the radio button from being focused
        />
      </label>
    </div>
  );
}

export default RadioButtons;

const SecondaryCard = ({ pill, content, gradient }) => {
  return (
    <div
      className={`w-full md:w-[15rem] h-[12rem] relative mt-5 md:mt-10 bg-gradient-to-b ${gradient} rounded-lg shadow-lg mx-2`}
    >
      <div
        className={`absolute -top-4 left-1/2 -translate-x-1/2 border bg-gradient-to-b ${gradient} rounded-full py-2 px-5 text-sm text-gray-800 font-semibold`}
      >
        {pill}
      </div>

      <div className="flex items-center justify-center h-full">
        <h2 className="text-3xl md:text-5xl font-bold text-white">{content}</h2>
      </div>
    </div>
  );
};

export default SecondaryCard;

import { RotatingLines } from "react-loader-spinner";

const LLLoadingSpinner = () => {
  return (
    <div className="w-full h-full flex flex-col flex-nowrap justify-center items-center">
      <RotatingLines
        strokeColor="cyan"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
};

export default LLLoadingSpinner;

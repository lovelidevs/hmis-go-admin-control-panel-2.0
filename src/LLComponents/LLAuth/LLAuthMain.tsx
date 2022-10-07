import { ReactNode } from "react";

const LLAuthMain = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col flex-nowrap justify-center items-center w-screen h-screen bg-gray-800">
      {children}
    </main>
  );
};

export default LLAuthMain;

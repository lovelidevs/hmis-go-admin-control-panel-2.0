const LLTableHeader = ({ children }: { children: string }) => {
  return <th className="p-2 bg-purple-300 text-lg text-left">{children}</th>;
};

export default LLTableHeader;

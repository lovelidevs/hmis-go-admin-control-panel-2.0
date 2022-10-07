const LLTableData = ({
  children,
  textWrap,
}: {
  children: string;
  textWrap?: boolean;
}) => {
  const whitespace = textWrap ? "whitespace-normal" : "whitespace-nowrap";
  return (
    <td className={whitespace + " text-base border-x-2 border-gray-400 p-2"}>
      {children}
    </td>
  );
};

export default LLTableData;

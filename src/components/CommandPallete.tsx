import { FilePlus } from "lucide-react";
import { ReactNode } from "react";

export const commandData: {
  name: string;
  Icon: ReactNode;
  action: () => void;
}[] = [
    {
      name: "Create File",
      Icon: <FilePlus />,
      action: () => console.log("done"),
    },
  ];

export default function CommandPallete({ selectedFileIdx }) {
  return (
    <div className="text-white">
      {commandData.map(({ name, Icon, action }, idx) => (
        <Command
          name={name}
          Icon={Icon}
          action={action}
          selectedFileIdx={selectedFileIdx}
          idx={idx}
        />
      ))}
    </div>
  );
}

function Command({ name, Icon, action, idx, selectedFileIdx }) {
  return (
    <div
      className={`flex cursor-pointer items-center border-b-2 border-gray-500 p-2 text-white hover:bg-gray-700 ${selectedFileIdx === idx
          ? "border-t-4 border-b-4 !border-blue-500"
          : null
        }`}
      onClick={action}
    >
      {Icon} <span className="ml-2">{name}</span>
    </div>
  );
}

import { SettingsActions } from "@/screens/Home";
import { Keyboard } from "lucide-react";
import { ReactNode } from "react";

export const settingsData: {
  name: string;
  Icon: ReactNode;
  action: SettingsActions;
}[] = [
  {
    name: "Vim Settings",
    Icon: <Keyboard className="h-6 w-6" />,
    action: "SHOW_VIM_SETTINGS",
  },
];

interface SettingsProps {
  selectedSettingIdx: number;
}

export default function Settings({ selectedSettingIdx }: SettingsProps) {
  return (
    <div className="h-full w-35 border-r border-b border-white text-white">
      {settingsData.map(({ name, Icon, action }, idx: number) => (
        <Setting
          name={name}
          Icon={Icon}
          action={action}
          selectedSetting={selectedSettingIdx}
          idx={idx}
        />
      ))}
    </div>
  );
}

//TODO: Fix this
function Setting({ name, Icon, action, idx, selectedSetting }: any) {
  return (
    <div
      className={`flex h-8 cursor-pointer scroll-m-8 items-center border-x-1 border-b border-gray-500 text-xs ${
        selectedSetting === idx
          ? "border-blue-500! bg-gray-700 md:border-y-0"
          : null
      } hover:bg-gray-700`}
      onClick={action}
    >
      {Icon} <span className="ml-2">{name}</span>
    </div>
  );
}

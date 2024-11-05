import * as React from "react";
import { CheckIcon } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded ${
        checked ? "bg-blue-500" : "bg-white"
      }`}
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && <CheckIcon className="w-4 h-4 text-white" />}
    </button>
  );
};

export default CustomCheckbox;
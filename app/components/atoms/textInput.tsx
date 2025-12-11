import { Input } from "antd";

interface TextInputProps {
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  placeholder,
  type = "text",
  value,
  onChange,
}: TextInputProps) {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}

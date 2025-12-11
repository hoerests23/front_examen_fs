import { Button } from "antd";

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({ text, onClick, disabled = false, loading = false }: PrimaryButtonProps) {
  return (
    <Button
      type="primary"
      block
      onClick={onClick}
      htmlType="submit"
      disabled={disabled}
      loading={loading}
    >
      {text}
    </Button>
  );
}

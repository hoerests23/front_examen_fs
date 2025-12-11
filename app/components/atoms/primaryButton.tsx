import { Button } from "antd";

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
}

export default function PrimaryButton({ text, onClick }: PrimaryButtonProps) {
  return (
    <Button type="primary"
        block
        onClick={onClick}
        htmlType="submit"
      >
        
      {text}
    </Button>
  );
}

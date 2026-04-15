import { CloseOutlined } from '@ant-design/icons';
import type { ButtonProps } from './ButtonProps';
import { Button } from 'antd';

export const CloseButton = ({ text = 'Đóng', onClick, size }: ButtonProps) => {
    return (
        <Button icon={<CloseOutlined />} color="red" variant="solid" onClick={onClick} size={size}>
            {text}
        </Button>
    );
};
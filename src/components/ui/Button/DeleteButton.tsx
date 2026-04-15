import { Button } from 'antd';
import type { ButtonProps } from './ButtonProps';
import { DeleteOutlined } from '@ant-design/icons';

export const DeleteButton = ({ text = 'Xóa', onClick, size }: ButtonProps) => {
    return (
        <Button icon={<DeleteOutlined />} color="red" variant="solid" onClick={onClick} size={size}>
            {text}
        </Button>
    );
};
import { Button } from 'antd';
import type { ButtonProps } from './ButtonProps';
import { EditOutlined } from '@ant-design/icons';

export const EditButton = ({ text = 'Chỉnh sửa', onClick, size }: ButtonProps) => {
    return (
        <Button icon={<EditOutlined />} color="cyan" variant="solid" onClick={onClick} size={size}>
            {text}
        </Button>
    );
};
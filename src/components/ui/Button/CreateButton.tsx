import { Button } from 'antd';
import type { ButtonProps } from './ButtonProps';
import { PlusOutlined } from '@ant-design/icons';

export const CreateButton = ({ text = 'Thêm mới', onClick, size }: ButtonProps) => {
    return (
        <Button icon={<PlusOutlined />} color="orange" variant="solid" onClick={onClick} size={size}>
            {text}
        </Button>
    );
};
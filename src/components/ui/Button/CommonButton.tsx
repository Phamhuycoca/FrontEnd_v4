import { Button } from 'antd';
import type { CommonButtonProps } from './ButtonProps';
import { Conify } from '../Icon';

export const CommonButton = ({ icon, text, ...rest }: CommonButtonProps) => {
    const renderIcon = typeof icon === 'string' ? <Conify icon={icon} /> : icon;
    return (
        <Button icon={renderIcon} {...rest}>
            {text}
        </Button>
    );
};
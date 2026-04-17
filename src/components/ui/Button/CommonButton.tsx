import { Button } from 'antd';
import type { CommonButtonProps } from './ButtonProps';
import { Icon } from '../Icon';

export const CommonButton = ({ icon, text, ...rest }: CommonButtonProps) => {
    const renderIcon = typeof icon === 'string' ? <Icon icon={icon} /> : icon;
    return (
        <Button icon={renderIcon} {...rest}>
            {text}
        </Button>
    );
};
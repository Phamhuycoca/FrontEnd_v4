import { Icon } from '@iconify/react';
import type { ConifyProps } from '../Button/ButtonProps';

export const Conify = ({ icon, width = 16, height = 16 }: ConifyProps) => {
    return <Icon icon={icon} width={width} height={height} />;
};
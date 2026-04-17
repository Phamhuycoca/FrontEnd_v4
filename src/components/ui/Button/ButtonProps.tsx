import type { ButtonProps as AntButtonProps } from 'antd';
import type { ReactNode } from 'react';

export type ButtonProps = AntButtonProps & {
    text?: string;
};
export type CommonButtonProps = ButtonProps & {
    text: string;
    icon?: string | ReactNode;
};

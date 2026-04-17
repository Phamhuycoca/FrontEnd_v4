import { Icon as Iconify } from '@iconify/react';
import { isValidElement } from 'react';
import * as AntIcons from '@ant-design/icons';

export const Icon = ({ icon, width = 16, height = 16 }: any) => {

    if (isValidElement(icon)) {
        return icon;
    }

    if (typeof icon === 'string') {

        // ✅ remove < />
        const cleanIcon = icon
            .replace(/<|\/>/g, '')   // bỏ < và />
            .trim();

        // ✅ thử AntD
        const AntIcon = (AntIcons as any)[cleanIcon];
        if (AntIcon) {
            return <AntIcon style={{ fontSize: width }} />;
        }

        // ✅ fallback Iconify
        return <Iconify icon={cleanIcon} width={width} height={height} />;
    }

    return null;
};
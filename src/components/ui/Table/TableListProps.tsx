import type { TableProps } from 'antd';

export type TableListProps = TableProps & {
    key?: string;
    page?: number;
    page_size?: number;
    sort?: string;
    filters?: string;
    search?: string;
    isSearch?: boolean;
    total?: number;
    loading?: boolean;
    acctionButton?: React.ReactNode;
    arrFilterForm?: FilterForm[];
    sizeFilter?: 6 | 8 | 12 | 24;
    onChange?: (params: {
        page: number;
        pageSize: number;
        sort?: {};
        filters?: Record<string, any>;
        search?: string;
    }) => void;
};
interface FilterForm {
    label: string;
    name: string;
    type: 'text' | 'select' | 'date' | 'checkbox' | 'treeselect';
    data?: { label: string; value: any; children?: any[] }[];
}
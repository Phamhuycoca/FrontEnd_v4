import type { ItemSelect } from "../interfaces";

export const ConvertSelect = (arr: ItemSelect[]) => {
    return arr.map((x) => ({
        value: x.id,
        label: x.ten,
    }));
};
type TreeNode = {
    value: string;
    label: string;
    children?: TreeNode[];
};
export const ConvertTreeSelect = (arr?: any[]): TreeNode[] => {
    if (!arr?.length) return [];
    return arr.map((x) => ({
        value: x.id,
        label: x.ten,
        children: ConvertTreeSelect(x.children || []),
    }));
};
export interface DanhMucType {
    id: string;
    ten: string;
    icon: string;
    mo_ta: string;
    duong_dan: string;
    so_thu_tu: string;
    cap_cha_id: string;
    children?: DanhMucType[];
}
export interface VaiTroDanhMucTroType {
    vai_tro_id: string;
    list_danh_muc_id: [];
}   
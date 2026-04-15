import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MetaState } from '../../utils/interfaces';
import type { DanhMucType } from '../../modules/dm-danh-muc/danh-muc';
const initialState = {
    meta: {} as MetaState,
    data: [] as DanhMucType[],
};
const danhMucSlice = createSlice({
    name: 'danhMuc',
    initialState: initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setMeta(state, action: PayloadAction<Partial<MetaState>>) {
            state.meta = { ...state.meta, ...action.payload };
        },
    },
});
export const { setData, setMeta } = danhMucSlice.actions;
export default danhMucSlice.reducer;
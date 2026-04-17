import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MetaState } from '../../utils/interfaces';
import type { NguoiDungType } from '../../modules/dm-nguoi-dung/nguoi-dung';
const initialState = {
    meta: {} as MetaState,
    data: [] as NguoiDungType[],
};
const nguoiDungSlice = createSlice({
    name: 'nguoiDung',
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
export const { setData, setMeta } = nguoiDungSlice.actions;
export default nguoiDungSlice.reducer;
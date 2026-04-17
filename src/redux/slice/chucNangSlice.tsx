import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MetaState } from '../../utils/interfaces';
import type { ChucNangType } from '../../modules/dm-chuc-nang/chuc-nang';
const initialState = {
    meta: {} as MetaState,
    data: [] as ChucNangType[],
};
const chucNangSlice = createSlice({
    name: 'chucNang',
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
export const { setData, setMeta } = chucNangSlice.actions;
export default chucNangSlice.reducer;
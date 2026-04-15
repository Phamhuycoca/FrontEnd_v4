import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MetaState } from '../../utils/interfaces';
import type { VaiTroType } from '../../modules/dm-vai-tro/vai-tro';
const initialState = {
    meta: {} as MetaState,
    data: [] as VaiTroType[],
};
const vaiTroSlice = createSlice({
    name: 'vaiTro',
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
export const { setData, setMeta } = vaiTroSlice.actions;
export default vaiTroSlice.reducer;
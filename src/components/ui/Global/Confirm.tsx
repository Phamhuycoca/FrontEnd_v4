import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import type { ConfirmModalState } from '../../../utils/services/confirm-service';
import confirmService from '../../../utils/services/confirm-service';

export const GlobalConfirm = () => {
    const [state, setState] = useState<ConfirmModalState | null>(null);

    useEffect(() => {
        const sub = confirmService.modal$.subscribe((res) => {
            setState(res);
        });
        return () => sub.unsubscribe();
    }, []);

    if (!state) return null;

    return (
        <Modal
            title={state.title || 'Xác nhận'}
            open={state.open}
            okText="Xóa"
            cancelText="Đóng"
            onOk={() => {
                state.resolve(true);
                confirmService.close();
            }}
            onCancel={() => {
                state.resolve(false);
                confirmService.close();
            }}
        >
            <p>{state.content || 'Bạn có chắc chắn muốn xóa?'}</p>
        </Modal>
    );
};
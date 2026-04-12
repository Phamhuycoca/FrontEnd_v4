import { useEffect, useState } from 'react';
import { Button, Form, Modal, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';

export type ModalMode =
    | 'create'
    | 'update'
    | 'delete'
    | 'view'
    | 'close';

export interface BaseModalProps<T> {
    title?: string;
    service: {
        modal$: any;
        closeModal: () => void;
    };
    onSubmit: (values: T, mode: ModalMode, record?: T) => Promise<void> | void;
    children: (
        form: FormInstance<T>,
        mode: ModalMode,
        record?: T
    ) => React.ReactNode;
    width?: number;
}

export function BaseModal<T>({
    title,
    service,
    onSubmit,
    children,
    width = 800,
}: BaseModalProps<T>) {
    const [form] = Form.useForm<T>();

    const [state, setState] = useState<{
        open: boolean;
        mode: ModalMode;
        record?: T;
    }>({
        open: false,
        mode: 'close',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const sub = service.modal$.subscribe((res: any) => {
            setState(res);

            if (res?.record) {
                form.setFieldsValue(res.record);
            } else {
                form.resetFields();
            }
        });

        return () => sub.unsubscribe();
    }, [service, form]);

    const handleCancel = () => {
        form.resetFields();
        service.closeModal();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            await onSubmit(values, state.mode, state.record);

            handleCancel();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={title}
            open={state.open}
            onCancel={handleCancel}
            width={width}
            footer={
                state.mode === 'view'
                    ? null
                    : [
                        <Space key="actions">
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={handleOk}
                            >
                                Lưu
                            </Button>
                        </Space>,
                    ]
            }
        >
            <Form form={form} layout="vertical">
                {children(form, state.mode, state.record)}
            </Form>
        </Modal>
    );
}
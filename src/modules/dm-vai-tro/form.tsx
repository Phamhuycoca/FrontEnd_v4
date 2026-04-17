import { Form, Input, Row, Space, Spin } from "antd";
import { CloseButton, CommonButton, DeleteButton, EditButton, SaveButton } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import vaiTroService from "../../utils/services/vai-tro-service";
import type { VaiTroType } from "./vai-tro";
import confirmService from "../../utils/services/confirm-service";
import { PhanQuyenVaiTroModal } from "./modal";
export const EpsForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const onFinish = (values: VaiTroType) => {
        if (id && id !== 'new') {
            setIsLoading(true);
            const data = { ...values, id };
            vaiTroService.update(id, data).subscribe(
                (res) => {
                    if (res) {
                        setEditMode(true);
                        setIsLoading(false);
                        vaiTroService.refreshList('update');
                    }
                },
                (err) => {
                    console.log(err);
                    setIsLoading(false);
                },
            );
        } else {
            setIsLoading(true);
            vaiTroService.create(values).subscribe(
                (res) => {
                    if (res) {
                        setIsLoading(false);
                        setEditMode(true);
                        navigate(`../${res.data.id}`);
                        vaiTroService.refreshList('create');
                    }
                },
                (err) => {
                    console.log(err);
                    setIsLoading(false);
                },
            );
        }
    };
    useEffect(() => {
        if (id && id !== 'new') {
            setIsLoading(true);
            vaiTroService.getById(id).subscribe(
                (res) => {
                    form.setFieldsValue(res.data);
                    setEditMode(true);
                    setIsLoading(false);
                },
                (err) => {
                    console.log(err);
                    setIsLoading(false);
                },
            );
        } else {
            form.resetFields();
            setEditMode(false);
        }
    }, [id]);
    return (
        <>
            <Spin spinning={isLoading}>
                <Row justify={'end'}>
                    <Space>
                        {editMode ? (
                            <Space>
                                <CommonButton
                                    text="Phân quyền vai trò"
                                    onClick={() => {
                                        vaiTroService.openModal("create", id);
                                    }}
                                />
                                <EditButton
                                    onClick={() => {
                                        setEditMode(false);
                                    }}
                                />
                                <DeleteButton
                                    onClick={async () => {
                                        const confirm = await confirmService.confirm();
                                        if (confirm) {
                                            vaiTroService.delete(id).subscribe(
                                                (res) => {
                                                    if (res) {
                                                        setIsLoading(false);
                                                        setEditMode(true);
                                                        navigate(`../`, { replace: true });
                                                        vaiTroService.refreshList('delete');
                                                    }
                                                },
                                                (err) => {
                                                    console.log(err);
                                                    setIsLoading(false);
                                                },
                                            );
                                        }
                                    }}
                                />
                            </Space>
                        ) : (
                            <SaveButton
                                onClick={() => {
                                    form.submit();
                                }}
                            />
                        )}
                        <CloseButton
                            onClick={() => {
                                navigate('..', { replace: true });
                            }}
                        />
                    </Space>
                </Row>
                <Form form={form} onFinish={onFinish} className="mt-4">
                    <Form.Item name={'ma'} label="Mã">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item name={'ten'} label="Tên">
                        <Input disabled={editMode} />
                    </Form.Item>
                </Form>
            </Spin>
            <PhanQuyenVaiTroModal />
        </>
    )
}
import { Form, Input, Row, Select, Space, Spin } from "antd";
import { CloseButton, DeleteButton, EditButton, SaveButton } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confirmService from "../../utils/services/confirm-service";
import type { NguoiDungType } from "./nguoi-dung";
import nguoiDungService from "../../utils/services/nguoi-dung-service";
import { listTrangThai } from "./const";
import messageService from "../../utils/services/message-service";
export const EpsForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    useEffect(() => {
        if (id && id !== 'new') {
            setIsLoading(true);
            nguoiDungService.getById(id).subscribe(
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
    const onFinish = (values: NguoiDungType) => {
        if (id && id !== 'new') {
            setIsLoading(true);
            const data = { ...values, id };
            nguoiDungService.update(id, data).subscribe(
                (res) => {
                    if (res) {
                        messageService.success(res?.message);
                        setEditMode(true);
                        setIsLoading(false);
                        nguoiDungService.refreshList('update');
                    }
                },
                (err) => {
                    messageService.error(err?.response.data.Message);
                    console.log(err);
                    setIsLoading(false);
                },
            );
        } else {
            setIsLoading(true);
            nguoiDungService.create(values).subscribe(
                (res) => {
                    if (res) {
                        messageService.success(res?.message);
                        setIsLoading(false);
                        setEditMode(true);
                        navigate(`../${res.data.id}`);
                        nguoiDungService.refreshList('create');
                    }
                },
                (err) => {
                    messageService.error(err?.response.data.Message);
                    console.log(err);
                    setIsLoading(false);
                },
            );
        }
    };
    return (
        <>
            <Spin spinning={isLoading}>
                <Row justify={'end'}>
                    <Space>
                        {editMode ? (
                            <Space>
                                <EditButton
                                    onClick={() => {
                                        setEditMode(false);
                                    }}
                                />
                                <DeleteButton
                                    onClick={async () => {
                                        const confirm = await confirmService.confirm();
                                        if (confirm) {
                                            nguoiDungService.delete(id).subscribe(
                                                (res) => {

                                                    if (res) {
                                                        messageService.success(res.message)
                                                        setIsLoading(false);
                                                        setEditMode(true);
                                                        navigate(`..`, { replace: true });
                                                        nguoiDungService.refreshList('delete');
                                                    }
                                                },
                                                (err) => {
                                                    messageService.error(err?.response.data.Message);
                                                    console.log(err?.response.data.Message);
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
                <Form
                    className="mt-4"
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    layout="horizontal"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item label="Họ" name="ho">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Tên" name="ten">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Tên đăng nhập" name="ten_dang_nhap">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Khóa tài khoản" name="khoa_tai_khoan" initialValue={false}>
                        <Select disabled={editMode} allowClear options={listTrangThai} />
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
}
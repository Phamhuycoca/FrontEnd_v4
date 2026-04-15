import { Form, Input, InputNumber, message, Row, Space, Spin, TreeSelect } from "antd";
import { CloseButton, CommonButton, DeleteButton, EditButton, SaveButton } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confirmService from "../../services/confirm-service";
import type { DanhMucType } from "./danh-muc";
import danhMucService from "../../services/danh-muc-service";
import { ConvertTreeSelect } from "../../utils/helpers/Convert";

export const EpsForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [danhMucList, setDanhMucList] = useState<any[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        fetchDanhMucList();
        if (id && id !== 'new') {
            setIsLoading(true);
            danhMucService.getById(id).subscribe(
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
    const onFinish = (values: DanhMucType) => {
        if (id && id !== 'new') {
            setIsLoading(true);
            const data = { ...values, id };
            danhMucService.update(id, data).subscribe(
                (res) => {
                    if (res) {
                        messageApi.open({
                            type: 'success',
                            content: res?.message,
                        });
                        setEditMode(true);
                        setIsLoading(false);
                        danhMucService.refreshList('update');
                    }
                },
                (err) => {
                    messageApi.open({
                        type: 'error',
                        content: err?.response.data.Message,
                    });
                    console.log(err);
                    setIsLoading(false);
                },
            );
        } else {
            setIsLoading(true);
            danhMucService.create(values).subscribe(
                (res) => {
                    if (res) {
                        messageApi.open({
                            type: 'success',
                            content: res?.message,
                        });
                        setIsLoading(false);
                        setEditMode(true);
                        navigate(`../${res.data.id}`);
                        danhMucService.refreshList('create');
                    }
                },
                (err) => {
                    messageApi.open({
                        type: 'error',
                        content: err?.response.data.Message,
                    });
                    console.log(err);
                    setIsLoading(false);
                },
            );
        }
    };

    const fetchDanhMucList = () => {
        danhMucService.getList().subscribe(
            (res) => {
                setDanhMucList(ConvertTreeSelect(res.data));
            },
            (error) => {
                console.error(error);
            },
        );
    };
    return (
        <>
            {contextHolder}
            <Spin spinning={isLoading}>
                <Row justify={'end'}>
                    <Space>
                        {editMode ? (
                            <Space>
                                <CommonButton
                                    text="Phân quyền"
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
                                            danhMucService.delete(id).subscribe(
                                                (res) => {

                                                    if (res) {
                                                        messageApi.open({
                                                            type: 'success',
                                                            content: res?.message,
                                                        });
                                                        setIsLoading(false);
                                                        setEditMode(true);
                                                        navigate(`..`, { replace: true });
                                                        danhMucService.refreshList('delete');
                                                    }
                                                },
                                                (err) => {
                                                    messageApi.open({
                                                        type: 'error',
                                                        content: err?.response.data.Message,
                                                    });
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
                <Form form={form} onFinish={onFinish} className="mt-4" labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}>
                    <Form.Item label="Tên danh mục" name="ten">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Đường dẫn" name="duong_dan">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Icon" name="icon">
                        <Input disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Số thứ tự" name="so_thu_tu">
                        <InputNumber min={0} disabled={editMode} />
                    </Form.Item>
                    <Form.Item label="Cấp cha" name="cap_cha_id">
                        <TreeSelect disabled={editMode} allowClear treeData={danhMucList} title="Chọn cấp cha" />
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
}
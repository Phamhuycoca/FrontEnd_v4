import { Breadcrumb, Col, Row } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { TableList } from "../../components/ui/Table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { setData, setMeta } from "../../redux/slice/nguoiDungSlice";
import { CreateButton } from "../../components/ui/Button";
import nguoiDungService from "../../utils/services/nguoi-dung-service";

export const EpsList = () => {
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, meta } = useAppSelector(state => state.nguoidung);
    useEffect(() => {
        const sub = nguoiDungService.refresh$.subscribe(() => {
            fetchData();
        });

        return () => sub.unsubscribe();
    }, []);
    useEffect(() => {
        fetchData();
    }, [meta]);
    useEffect(() => {
        setColumns([
            {
                title: 'Tài khoản',
                width: '15%',
                dataIndex: 'ten_dang_nhap',
                render: (_: any, record: any) => <Link to={`${record.id}`}>{record.ten_dang_nhap}</Link>,
            },
            {
                title: 'Ảnh đại diện',
                width: '15%',
                dataIndex: 'anh_dai_dien',
            },
            {
                title: 'Trạng thái tài khoản',
                dataIndex: 'khoa_tai_khoan',
                width: '15%',
                render: (_: any, record: any) => {
                    return record.khoa_tai_khoan === true ? 'Đã khóa' : 'Đang hoạt động'
                },

            }
        ]);
    }, [meta.page, meta.page_size]);
    const fetchData = () => {
        setLoading(true);
        nguoiDungService.getList(meta).subscribe((res) => {
            dispatch(setData(res.data));
            setLoading(false);
        }, err => {
            console.log(err);
            setLoading(false);
        });
    }
    return (
        <>
            <Breadcrumb
                items={[{ title: 'Trang chủ' }, { title: 'Quản lý người dùng' }]}
                className="mb-3"
            />
            <Row gutter={16}>
                <Col md={12}>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <TableList
                                columns={columns}
                                loading={loading}
                                dataSource={data}
                                isSearch={true}
                                page={meta.page}
                                total={meta.total}
                                page_size={meta.page_size}
                                acctionButton={
                                    <>
                                        <CreateButton
                                            onClick={() => {
                                                navigate('new');
                                            }}
                                        />
                                    </>
                                }
                                onChange={({ page, pageSize, sort, filters, search }) => {
                                    dispatch(
                                        setMeta({
                                            page: page,
                                            page_size: pageSize,
                                            filter: filters ? JSON.stringify(filters) : '',
                                            search: search || '',
                                            sort: sort,
                                            total: meta.total
                                        }),
                                    );
                                }} />
                        </Col>
                    </Row>
                </Col>
                <Col md={12}>
                    <Outlet />
                </Col>
            </Row>
        </>
    )
}
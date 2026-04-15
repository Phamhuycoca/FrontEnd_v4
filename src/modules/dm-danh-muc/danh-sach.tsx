import { Breadcrumb, Col, Row } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { TableList } from "../../components/ui/Table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { setData, setMeta } from "../../redux/slice/danhMucSlice";
import { CreateButton } from "../../components/ui/Button";
import danhMucService from "../../services/danh-muc-service";

export const EpsList = () => {
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, meta } = useAppSelector(state => state.danhmuc);
    useEffect(() => {
        const sub = danhMucService.refresh$.subscribe(() => {
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
                title: 'Tên',
                dataIndex: 'ten',
                key: 'ten',
                render: (_: any, record: any) => <Link to={`${record.id}`}>{record.ten}</Link>,
            },
            {
                title: 'Đường dẫn',
                dataIndex: 'duong_dan',
            },
            {
                title: 'Icon',
                dataIndex: 'icon',
            },
            {
                title: 'Số thứ tự',
                dataIndex: 'so_thu_tu',
            },
            {
                title: 'Cấp cha',
                dataIndex: 'cap_cha_ten',
            }
        ])
    }, [meta.page, meta.page_size]);
    const fetchData = () => {
        setLoading(true);
        danhMucService.getList(meta).subscribe((res) => {
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
                items={[{ title: 'Trang chủ' }, { title: 'Quản lý vai trò' }]}
                className="mb-3"
            />
            <Row gutter={16}>
                <Col md={12}>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <TableList
                                expandable={{
                                    defaultExpandAllRows: true,
                                    showExpandColumn: true
                                }}
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
import { useEffect, useState, type Key } from "react";
import nguoiDungService from "../../../utils/services/nguoi-dung-service";
import type { MetaState } from "../../../utils/interfaces";
import { TableList } from "../../../components/ui/Table";
import { Col, Row, Space, type TableProps } from "antd";
import { CloseButton, SaveButton } from "../../../components/ui/Button";
import nguoiDungVaiTroService from "../../../utils/services/nguoi-dung-vai-tro-service";
import alertService from "../../../utils/services/alert-service";
import vaiTroService from "../../../utils/services/vai-tro-service";
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];


export const VaiTroNguoiDungTab = ({ id, activeKey }: { id: string | null, activeKey: string }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [listNguoiDung, setListNguoiDung] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState<MetaState>({
        filter: '',
        page: 1,
        page_size: 20,
        search: '',
        sort: {},
    });
    useEffect(() => {
        if (activeKey === '1') {
            fetchNguoiDungList();
            setColumns([
                {
                    title: 'Tên đầy đủ',
                    dataIndex: 'ten_day_du',
                },
                {
                    title: 'Tài khoản',
                    dataIndex: 'ten_dang_nhap',
                },
            ]);
            fetchDanhSachById(id);
        }

    }, [activeKey]);
    const fetchNguoiDungList = () => {
        setLoading(true);
        nguoiDungService.getList(meta).subscribe(
            (res) => {
                setListNguoiDung(res.data || []);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                console.error(error);
            },
        );
    };
    const fetchDanhSachById = async (id) => {
        if (!id) return;
        await nguoiDungVaiTroService.getById(id).subscribe((res) => {
            setSelectedRowKeys(res.data.list_nguoi_dung_id);
        });
    };
    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };
    const onClose = () => {
        vaiTroService.closeModal();
    }
    return (
        <>
            <Row justify={'end'}>
                <Col span={24}>
                    <TableList
                        loading={loading}
                        rowKey={'id'}
                        dataSource={listNguoiDung}
                        columns={columns}
                        page={meta.page}
                        page_size={meta.page_size}
                        search={meta.search}
                        rowSelection={rowSelection}
                        onChange={({ page, pageSize, sort, filters, search }) => {
                            setMeta({
                                page: page,
                                page_size: pageSize,
                                filter: filters ? JSON.stringify(filters) : '',
                                search: search || '',
                                sort: sort,
                                total: meta.total
                            });
                        }} />
                </Col>
                <Col span={24}>
                    <Row justify={'end'}>
                        <Space>
                            < SaveButton loading={loading} onClick={() => {
                                if (id && id !== 'new') {
                                    nguoiDungVaiTroService.create({ vai_tro_id: id, list_nguoi_dung_id: selectedRowKeys as [] }).subscribe((res) => {
                                        if (res.data) {
                                            alertService.info(res.message);
                                            fetchDanhSachById(id);
                                        }
                                    })
                                }
                            }
                            } />
                            <CloseButton onClick={() => {
                                onClose();
                            }} />
                        </Space>
                    </Row>
                </Col>
            </Row>
        </>
    )
}
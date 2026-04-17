import { Col, Row, Space } from "antd";
import { TableList } from "../../../components/ui/Table";
import { CloseButton, SaveButton } from "../../../components/ui/Button";
import vaiTroService from "../../../utils/services/vai-tro-service";
import vaiTroDanhMucService from "../../../utils/services/vai-tro-danh-muc-service";
import { useEffect, useState, type Key } from "react";
import type { MetaState } from "../../../utils/interfaces";
import type { TableProps } from "antd/lib/table";
import danhMucService from "../../../utils/services/danh-muc-service";
import alertService from "../../../utils/services/alert-service";
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export const VaiTroDanhMucTab = ({ id, activeKey }: { id: string | null, activeKey: string }) => {
    const [columns, setColumns] = useState<any[]>([]);
    const [listDanhMuc, setListDanhMuc] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState<MetaState>({
        filter: '',
        page: 1,
        page_size: 20,
        search: '',
        sort: {},
    });
    useEffect(() => {
        if (activeKey === '3') {
            fetchDanhMucList();
            setColumns([
                {
                    title: 'Tên',
                    dataIndex: 'ten',
                    key: 'ten'
                },
                {
                    title: 'Đường dẫn',
                    dataIndex: 'duong_dan',
                },
                {
                    title: 'Cấp cha',
                    dataIndex: 'cap_cha_ten',
                }
            ])
        }

        fetchDanhSachById(id);
    }, [activeKey]);
    const fetchDanhSachById = async (id) => {
        setLoading(true);
        if (!id) return;
        await vaiTroDanhMucService.getById(id).subscribe((res) => {
            setLoading(false);
            setSelectedRowKeys(res.data.list_danh_muc_id);
        }, (error) => {
            setLoading(false);
            console.error(error);
        });
    };
    const fetchDanhMucList = () => {
        setLoading(true);
        danhMucService.getList(meta).subscribe(
            (res) => {
                setLoading(false);
                setListDanhMuc(res.data || []);
            },
            (error) => {
                setLoading(false);
                console.error(error);
            },
        );
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
                        expandable={{
                            defaultExpandAllRows: true,
                            showExpandColumn: true
                        }}
                        rowKey={'id'}
                        dataSource={listDanhMuc}
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
                                    vaiTroDanhMucService.create({ vai_tro_id: id, list_danh_muc_id: selectedRowKeys as [] }).subscribe((res) => {
                                        if (res.data) {
                                            setSelectedRowKeys([]);
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
import { Col, Row, Space } from "antd";
import { TableList } from "../../../components/ui/Table";
import { CloseButton, SaveButton } from "../../../components/ui/Button";
import vaiTroService from "../../../utils/services/vai-tro-service";
import vaiTroChucNangService from "../../../utils/services/vai-tro-chuc-nang-service";
import { useEffect, useState, type Key } from "react";
import type { MetaState } from "../../../utils/interfaces";
import type { TableProps } from "antd/lib/table";
import chucNangService from "../../../utils/services/chuc-nang-service";
import alertService from "../../../utils/services/alert-service";
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export const VaiTroChucNangTab = ({ id, activeKey }: { id: string | null, activeKey: string }) => {
    const [columns, setColumns] = useState<any[]>([]);
    const [listVaiTro, setListVaiTro] = useState([]);
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
        if (activeKey === '2') {
            fetchDanhMucList();
            setColumns([
                {
                    title: 'Mã chức năng',
                    dataIndex: 'ma',
                    key: 'ma',
                },
                {
                    title: 'Tên chức năng',
                    dataIndex: 'ten',
                    key: 'ten',
                },
            ]);
            fetchDanhSachById(id);
        }
    }, [activeKey]);
    const fetchDanhMucList = () => {
        chucNangService.getList(meta).subscribe(
            (res) => {
                setListVaiTro(res.data || []);
            },
            (error) => {
                console.error(error);
            },
        );
    };
    const fetchDanhSachById = async (id) => {
        setLoading(true);
        if (!id) return;
        await vaiTroChucNangService.getById(id).subscribe((res) => {
            setLoading(false);
            setSelectedRowKeys(res.data.list_chuc_nang_id);
        }, (error) => {
            setLoading(false);
            console.error(error);
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
                        dataSource={listVaiTro}
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
                                    vaiTroChucNangService.create({ vai_tro_id: id, list_chuc_nang_id: selectedRowKeys as [] }).subscribe((res) => {
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
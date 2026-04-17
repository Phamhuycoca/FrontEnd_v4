import { Col, Modal, Row, Space } from "antd";
import { CloseButton, SaveButton } from "../../components/ui/Button";
import { useEffect, useState, type Key } from "react";
import vaiTroService from "../../utils/services/vai-tro-service";
import { TableList } from "../../components/ui/Table";
import type { MetaState } from "../../utils/interfaces";
import type { TableProps } from 'antd';
import alertService from "../../utils/services/alert-service";
import danhMucService from "../../utils/services/danh-muc-service";
import vaiTroDanhMucService from "../../utils/services/vai-tro-danh-muc-service";
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
export const PhanQuyenVaiTroDanhMucModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [columns, setColumns] = useState<any[]>([]);
    const [listDanhMuc, setListDanhMuc] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [id, setId] = useState(null);
    const [meta, setMeta] = useState<MetaState>({
        filter: '',
        page: 1,
        page_size: 20,
        search: '',
        sort: {},
    });
    useEffect(() => {
        const sub = danhMucService.modal$.subscribe(async (res) => {
            if (res.open) {
                console.log(res.record);
                setId(res.record)
                setSelectedRowKeys([]);
                fetchDanhMucList();
                fetchDanhSach(res.record);
            }
        });
        return () => sub.unsubscribe();
    }, []);
    useEffect(() => {
        setColumns([
            {
                title: 'Mã vai trò',
                dataIndex: 'ma',
                key: 'ma',
            },
            {
                title: 'Tên vai trò',
                dataIndex: 'ten',
                key: 'ten',
            },
        ]);
    }, []);
    const fetchDanhMucList = () => {
        vaiTroService.getList(meta).subscribe(
            (res) => {
                setListDanhMuc(res.data || []);
                setIsOpen(true);
            },
            (error) => {
                console.error(error);
            },
        );
    };
    const onClose = () => {
        setIsOpen(false);
    }
    const fetchDanhSach = async (id) => {
        if (!id) return;
        await vaiTroDanhMucService.getById(id).subscribe((res) => {
            // setSelectedRowKeys(res.data.list_vai_tro_id);
        });
    };
    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };
    return (
        <Modal width={'50%'} open={isOpen}
            footer={
                <Space>
                    < SaveButton onClick={() => {
                        if (id && id !== 'new') {
                            // vaiTroDanhMucService.create({ danh_muc_id: id, list_vai_tro_id: selectedRowKeys as [] }).subscribe((res) => {
                            //     if (res.data) {
                            //         setSelectedRowKeys([]);
                            //         setIsOpen(false);
                            //         alertService.info(res.message);
                            //     }
                            // })
                        }
                    }
                    } />
                    <CloseButton onClick={() => {
                        onClose();
                    }} />
                </Space>
            }>
            <Row>
                <Col span={24}>
                    <TableList
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
            </Row>
        </Modal >
    )
};
import { Col, Modal, Row, Tabs } from "antd";
import { VaiTroNguoiDungTab } from "./Tabs/vai-tro-nguoi-dung";
import { VaiTroChucNangTab } from "./Tabs/vai-tro-chuc-nang";
import { VaiTroDanhMucTab } from "./Tabs/vai-tro-danh-muc";
import { useEffect, useState } from "react";
import vaiTroService from "../../utils/services/vai-tro-service";

export const PhanQuyenVaiTroModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [activeKey, setActiveKey] = useState('1');
    useEffect(() => {
        const sub = vaiTroService.modal$.subscribe(async (res) => {
            if (res.open) {
                setId(res.record)
                setIsOpen(res.open);
            } else {
                setIsOpen(res.open);
                setId(null);
            }
        });
        return () => sub.unsubscribe();
    }, []);
    const handleChangeTab = (key: string) => {
        setActiveKey(key);
    };
    return (
        <Modal width={'85%'} open={isOpen}
            closable={false}
            footer={
                null
            }>
            <Row>
                <Col span={24}>
                    <Tabs
                        defaultActiveKey={activeKey}
                        onChange={handleChangeTab}
                        items={[
                            {
                                key: '1',
                                label: 'Người dùng',
                                children: <VaiTroNguoiDungTab id={id} activeKey={activeKey} />
                            },
                            {
                                key: '2',
                                label: 'Chức năng',
                                children: <VaiTroChucNangTab id={id} activeKey={activeKey} />
                            },
                            {
                                key: '3',
                                label: 'Danh mục',
                                children: <VaiTroDanhMucTab id={id} activeKey={activeKey} />
                            }
                        ]} />
                </Col>
            </Row>
        </Modal >
    )
};
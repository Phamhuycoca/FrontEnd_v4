import {
    Button,
    Checkbox,
    Col,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Space,
    Table,
    TreeSelect,
} from 'antd';
import type { TableListProps } from './TableListProps';
import { useState } from 'react';
import { DownOutlined, RedoOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import viVN from 'antd/locale/vi_VN';
const { Search } = Input;
export const TableList = (props: TableListProps) => {
    const {
        page,
        page_size,
        loading,
        isSearch,
        total,
        acctionButton,
        dataSource,
        columns,
        arrFilterForm,
        sizeFilter,
        onChange,
        ...rest
    } = props;
    const [searchValue, setSearchValue] = useState<string>(props.search || '');
    const [isShowFilter, setIsShowFilter] = useState<Boolean>(false);
    return (
        <>
            {isSearch && (
                <Row className="mb-2">
                    <Col span={12}>
                        <Row align={'middle'}>
                            <Col span={16}>
                                <Search
                                    placeholder="Nhập từ khóa để tìm kiếm"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onSearch={(value) => {
                                        onChange?.({ page: page, pageSize: page_size, search: value });
                                    }}
                                />
                            </Col>
                            {arrFilterForm && arrFilterForm.length > 0 && (
                                <Col span={7} className="ms-1">
                                    <Button
                                        style={{ color: '#4096ff' }}
                                        onClick={() => {
                                            setIsShowFilter(!isShowFilter);
                                        }}
                                        type="text"
                                        icon={isShowFilter ? <UpOutlined /> : <DownOutlined />}
                                        iconPosition="end"
                                    >
                                        {isShowFilter ? 'Thu gọn' : 'Mở rộng'}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row justify={'end'} align={'middle'}>
                            <Space>{acctionButton}</Space>
                        </Row>
                    </Col>
                </Row>
            )}
            {isShowFilter && arrFilterForm && arrFilterForm.length > 0 && (
                <>
                    <Form
                        onFinish={(values) => {
                            onChange?.({
                                page,
                                pageSize: page_size,
                                search: searchValue,
                                filters: values,
                            });
                        }}
                    >
                        <Form.Item colon={false} label="Tìm kiếm nâng cao"></Form.Item>
                        <Row gutter={[16, 16]}>
                            {arrFilterForm?.map((field, index) => {
                                let inputComponent: React.ReactNode;
                                let label = field.label.toLocaleLowerCase();
                                switch (field.type) {
                                    case 'text':
                                        inputComponent = <Input placeholder={`Nhập ${label}`} />;
                                        break;
                                    case 'select':
                                        inputComponent = (
                                            <Select
                                                options={field.data}
                                                allowClear
                                                placeholder={`Chọn ${label}`}
                                            ></Select>
                                        );
                                        break;

                                    case 'date':
                                        inputComponent = <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" />;
                                        break;

                                    case 'checkbox':
                                        inputComponent = <Checkbox>{label}</Checkbox>;
                                        break;
                                    case 'treeselect':
                                        inputComponent = (
                                            <TreeSelect
                                                treeData={field.data}
                                                placeholder={`Chọn ${label}`}
                                                allowClear
                                                style={{ width: '100%' }}
                                            />
                                        );
                                        break;
                                    default:
                                        inputComponent = null;
                                }

                                return (
                                    <Col span={sizeFilter || 12} key={index}>
                                        <Form.Item
                                            label={field.type !== 'checkbox' ? field.label : ''}
                                            name={field.name}
                                            valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
                                        >
                                            {inputComponent}
                                        </Form.Item>
                                    </Col>
                                );
                            })}
                        </Row>
                        <Form.Item>
                            <Row justify={'center'}>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SearchOutlined />}
                                        iconPosition="start"
                                    >
                                        Tìm kiếm
                                    </Button>
                                    <Button
                                        icon={<RedoOutlined />}
                                        iconPosition="start"
                                        htmlType="reset"
                                        onClick={() => {
                                            onChange?.({
                                                page,
                                                pageSize: page_size,
                                                search: '',
                                                filters: {},
                                            });
                                        }}
                                    >
                                        Làm mới
                                    </Button>
                                </Space>
                            </Row>
                        </Form.Item>
                    </Form>
                </>
            )}
            <Row>
                <Col span={24}>
                    <ConfigProvider
                        locale={{
                            ...viVN,
                            Pagination: {
                                ...viVN.Pagination,
                                items_per_page: '/ trang',
                            },
                        }}
                    >
                        <Table
                            loading={loading}
                            columns={columns}
                            sortDirections={['descend', 'ascend']}
                            dataSource={dataSource}
                            {...rest}
                            pagination={{
                                total: total,
                                current: page,
                                pageSize: page_size,
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
                                pageSizeOptions: ['10', '20', '50', '100'],
                            }}
                            onChange={(pagination, filters, sorter) => {
                                const sort = (!Array.isArray(sorter) && sorter.field) ? { [String(sorter.field)]: sorter.order === "ascend" ? 0 : 1 } : { [String(columns[0].key)]: 1 };
                                console.log('sort', sort);

                                onChange?.({
                                    page: pagination.current || 1,
                                    pageSize: pagination.pageSize || 20,
                                    sort: JSON.stringify(sort),
                                    filters,
                                });
                            }}
                        />
                    </ConfigProvider>
                </Col>
            </Row>
        </>
    );
};
import React, { Component } from "react";
import { Button, Icon, Table, message, Popconfirm, Alert } from "antd";
import FetchUtil from "../../utils/FetchUtil";
import AddressForm from "./addressForm";
import './address.css'

const ButtonGroup = Button.Group;
export default class Address extends Component {
    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '地址',
            dataIndex: 'detailedAddress',
            key: 'detailedAddress',
            render: (detailedAddress, record) => {
                const { province, city, district } = record;
                return `${province} ${city} ${district} ${detailedAddress}`;
            }
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (id, record, index) => {
                return <ButtonGroup>
                    <Button title="修改" onClick={() => this.openEdit(record, index)}><Icon type="edit" /></Button>
                    <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => this.removeAddress(id, index)}
                        okText="是"
                        cancelText="否"
                    >
                        <Button title="删除" type="danger"><Icon type="delete" /></Button>
                    </Popconfirm>
                </ButtonGroup>
            }
        }
    ]
    state = {
        formVisible: false,
        addressList: [],
        address: {},
        maxCount: 0
    }
    findAddressList() {
        FetchUtil.get({
            url: '/user/address/list',
            success: ({ data: addressList }) => {
                this.setState({ addressList });
            }
        })
    }
    componentWillMount() {
        this.getMaxCount();
        this.findAddressList();
    }
    openAdd() {
        this.setState({ formVisible: true, address: {} })
    }
    openEdit(address, editIndex) {
        this.setState({ formVisible: true, address, editIndex })
    }
    saveAddress(address) {
        FetchUtil.put({
            url: '/user/address/save',
            data: address,
            success: ({ errCode, errMsg, data }) => {
                if (errCode) {
                    message.error(errMsg);
                    return;
                }
                const { addressList, editIndex } = this.state;
                console.log();
                if (!address.id) {
                    address.id = data;
                    addressList.push(address);
                } else {
                    addressList[editIndex] = address;
                }
                this.setState({ addressList, formVisible: false });
                message.info('保存成功啦^_^');
            }
        })
    }
    removeAddress(id, index) {
        FetchUtil.delete({
            url: `/user/address/${id}`,
            success: ({ errCode, errMsg }) => {
                if (errCode) {
                    message.error(errMsg);
                    return;
                }
                const { addressList } = this.state;
                addressList.splice(index, 1);
                this.setState({ addressList });
                message.info('地址已经删除啦^_^');
            }
        })
    }
    getMaxCount() {
        FetchUtil.get({
            url: '/basic/address/maxCount',
            success: ({ data: maxCount }) => this.setState({ maxCount })
        });
    }
    render() {
        const { formVisible, addressList, address, maxCount } = this.state;
        return <main>
            <Alert
                style={{ marginBottom: '10px' }}
                type="info"
                message={`共 ${addressList.length} 条，最多 ${maxCount} 条地址`} />
            <Button shape="circle" className="addBtn" onClick={() => this.openAdd()}>
                <Icon type="plus" />
            </Button>
            <Table
                pagination={false}
                columns={this.columns}
                rowKey="id"
                dataSource={addressList}>
            </Table>
            <AddressForm
                visible={formVisible}
                address={address}
                submit={(newAddress) => this.saveAddress(newAddress)} />
        </main>
    }
}
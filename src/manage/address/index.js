import React, { Component } from "react";
import { Button, Icon, Table, message } from "antd";
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
            render: (id) => {
                return <ButtonGroup>
                    <Button title="修改"><Icon type="edit" /></Button>
                    <Button title="删除" type="danger"><Icon type="delete" /></Button>
                </ButtonGroup>
            }
        }
    ]
    state = {
        formVisible: false,
        addressList: [{
            id: 1,
            province: '上海市',
            city: '上海市',
            district: '长宁区',
            detailedAddress: '华山路1520弄',
            name: '刘鹏',
            phone: '18516516436'
        }]
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
        // this.findAddressList();
    }
    openAdd() {
        this.setState({ formVisible: true, address: {} })
    }
    saveAddress(address) {
        FetchUtil.put({
            url: '/user/address/save',
            data: address,
            success: ({ errCode, errMsg }) => {
                if (errCode) {
                    message.error(errMsg);
                    return;
                }
                this.setState({ formVisible: false })
                message.info('保存成功啦^_^');
            }
        })
    }
    render() {
        const { formVisible, addressList, address } = this.state;
        return <main>
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
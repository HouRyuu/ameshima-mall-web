import React, {Component} from "react";
import {Button, Icon, Table, message, Popconfirm, Alert, Tooltip, Row, Col} from "antd";
import FetchUtil from "../../utils/FetchUtil";
import AddressForm from "./addressForm";

const ButtonGroup = Button.Group;
export default class Address extends Component {
    columns = [
        {
            title: 'お名前',
            dataIndex: 'name',
            key: 'name',
            render: (name, {id, isDefault}, index) => {
                return <span>
                    {isDefault ?
                        <Tooltip title="デフォルト"><Icon type="heart" theme="filled"
                                                     style={{color: '#eb2f96'}}/> </Tooltip> :
                        <Tooltip title="デフォルトにする"><Icon type="heart"
                                                        onClick={() => this.setDefault(id, index)}/> </Tooltip>}
                    {name}
                </span>;
            }
        },
        {
            title: 'アドレス',
            dataIndex: 'detailedAddress',
            key: 'detailedAddress',
            render: (detailedAddress, record) => {
                const {province, city, district} = record;
                return `${province} ${city} ${district} ${detailedAddress}`;
            }
        },
        {
            title: '電話番号',
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
                    <Button title="修正" onClick={() => this.openEdit(record, index)}><Icon type="edit"/></Button>
                    {
                        record.isDefault ?
                            <Button title="削除" type="danger" disabled={true}><Icon type="delete"/></Button>
                            :
                            <Popconfirm
                                title="削除しますか？"
                                onConfirm={() => this.removeAddress(id, index)}
                                okText="はい"
                                cancelText="いいえ"
                            >
                                <Button title="削除" type="danger"><Icon type="delete"/></Button>
                            </Popconfirm>
                    }
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
            success: ({data: addressList}) => {
                this.setState({addressList});
            }
        })
    }

    componentWillMount() {
        this.getMaxCount();
        this.findAddressList();
    }

    openAdd() {
        this.setState({formVisible: true, address: {}})
    }

    openEdit(address, editIndex) {
        this.setState({formVisible: true, address, editIndex})
    }

    saveAddress(address) {
        FetchUtil.put({
            url: '/user/address/save',
            data: address,
            success: ({data}) => {
                message.info('セーブ完了^_^');
                const {addressList, editIndex} = this.state;
                if (!address.id) {
                    address.id = data;
                    address.isDefault = addressList.length === 0 ? 1 : 0;
                    addressList.push(address);
                } else {
                    addressList[editIndex] = address;
                }
                this.setState({addressList, formVisible: false});
            }
        })
    }

    removeAddress(id, index) {
        const {addressList} = this.state;
        if (addressList[index].isDefault) {
            message.warn('デフォルトの配送先を削除するのはダメだよ')
            return;
        }
        FetchUtil.delete({
            url: `/user/address/${id}`,
            success: () => {
                addressList.splice(index, 1);
                this.setState({addressList});
                message.info('削除完了^_^');
            }
        })
    }

    getMaxCount() {
        FetchUtil.get({
            url: '/basic/address/maxCount',
            success: ({data: maxCount}) => this.setState({maxCount})
        });
    }

    setDefault(id, curIndex) {
        FetchUtil.put({
            url: `/user/address/${id}/default`,
            success: () => {
                const {addressList} = this.state;
                addressList.forEach((record, index) => {
                    if (record.isDefault) {
                        record.isDefault = 0;
                    } else if (curIndex === index) {
                        record.isDefault = 1;
                    }
                });
                this.setState({addressList});
            }
        })

    }

    render() {
        const {formVisible, addressList, address, maxCount} = this.state;
        return <main>
            <Alert
                style={{marginBottom: '10px'}}
                type="info"
                message={<Row style={{lineHeight: '32px'}}>
                    <Col span={23}>合計 {addressList.length} アドレス，最大 {maxCount} アドレス</Col>
                    <Col span={1}>
                        <Button type='primary' onClick={() => this.openAdd()} icon='plus'/>
                    </Col>
                </Row>}/>
            <Table
                pagination={false}
                columns={this.columns}
                rowKey="id"
                dataSource={addressList}>
            </Table>
            <AddressForm
                visible={formVisible}
                address={address}
                submit={(newAddress) => this.saveAddress(newAddress)}
                close={() => this.setState({formVisible: false})}/>
        </main>
    }
}
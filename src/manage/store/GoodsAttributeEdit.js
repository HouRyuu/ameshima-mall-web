import React, {Component} from "react";
import {Button, Divider, Drawer, Input, message, Popconfirm, Select, Table, Tooltip} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import FetchUtil from "../../utils/FetchUtil";

/**
 * 商品のセールス属性及びパラメータを編集
 * @param goodsId
 * @param visible 展示スイッチ
 * @param isEdit 編集スイッチ
 * @param onClose 閉じるコールバック
 */
export default class GoodsAttributeEdit extends Component {
    state = {
        attrList: [{
            attrId: 1,
            attrName: 'サーイズ'
        }],
        attrMapList: [{
            id: 1,
            attrId: 1,
            attrName: 'サーイズ',
            txtValue: '155/76A/XS'
        }],
        paramList: [{
            id: 1,
            paramName: '材质',
            paramValue: '其他'
        }]
    }
    attrColumn = [{
        title: '属性',
        dataIndex: 'attrId',
        render: (attrId, record) => <Select value={attrId} style={{width: "100px"}} onChange={(value) => {
            record.attrId = value;
            this.setState({});
        }}>
            {this.state.attrList.map(({attrId, attrName}) =>
                <Select.Option key={attrId} value={attrId}>{attrName}</Select.Option>)}
        </Select>
    }, {
        title: '値',
        dataIndex: 'txtValue',
        render: (txtValue, record) => <Input value={txtValue} onChange={({target: {value}}) => {
            record.txtValue = value;
            this.setState({});
        }}/>
    }, {
        title: '操作',
        dataIndex: 'id',
        render: (id, record, index) => {
            const {isEdit} = this.props;
            return <ButtonGroup>
                <Tooltip title="保存" placement="bottom">
                    <Button disabled={!isEdit} type="dashed" size="small" icon="save"
                            onClick={() => this.saveAttr(record)}/>
                </Tooltip>
                <Tooltip title="削除" placement="bottom">
                    <Popconfirm
                        title="削除しますか?"
                        onConfirm={() => this.deleteAttr(index, id)}
                        okText="はい"
                        cancelText="いいえ"
                    >
                        <Button disabled={!isEdit} type="danger" size="small" icon="delete"/>
                    </Popconfirm>
                </Tooltip>
            </ButtonGroup>
        }
    }]

    paramColumn = [{
        title: 'パラメータ',
        dataIndex: 'paramName',
        render: (paramName, record) => <Input value={paramName} onChange={({target: {value}}) => {
            record.paramName = value;
            this.setState({});
        }}/>
    }, {
        title: '値',
        dataIndex: 'paramValue',
        render: (paramValue, record) => <Input value={paramValue} onChange={({target: {value}}) => {
            record.paramValue = value;
            this.setState({});
        }}/>
    }, {
        title: '操作',
        dataIndex: 'id',
        render: (id, record, index) => {
            const {isEdit} = this.props;
            return <ButtonGroup>
                <Tooltip title="保存" placement="bottom">
                    <Button disabled={!isEdit} type="dashed" size="small" icon="save"
                            onClick={() => this.saveParam(record)}/>
                </Tooltip>
                <Tooltip title="削除" placement="bottom">
                    <Popconfirm
                        title="削除しますか?"
                        onConfirm={() => this.deleteParam(index, id)}
                        okText="はい"
                        cancelText="いいえ"
                    >
                        <Button disabled={!isEdit} type="danger" size="small" icon="delete"/>
                    </Popconfirm>
                </Tooltip>
            </ButtonGroup>
        }
    }]

    componentDidMount() {
        this.attrsList();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.visible) {
            const {goodsId} = nextProps;
            this.findAttrs(goodsId);
            this.findParams(goodsId);
        }
        return true;
    }

    attrsList() {
        FetchUtil.get({
            url: '/goods/attr/list',
            success: ({data: attrList}) => this.setState({attrList})
        });
    }

    findAttrs(goodsId) {
        if (!goodsId) {
            return;
        }
        FetchUtil.get({
            url: `/goods/attr/map/${goodsId}/list`,
            success: ({data: attrMapList}) => this.setState({attrMapList})
        })
    }

    findParams(goodsId) {
        if (!goodsId) {
            return;
        }
        FetchUtil.get({
            url: `/goods/${goodsId}/param/list`,
            success: ({data: paramList}) => this.setState({paramList})
        })
    }

    addNewLine(type = 'attr') {
        if (type === 'attr') {
            const {attrMapList} = this.state;
            attrMapList.push({});
            this.setState({attrMapList});
            return;
        }
        const {paramList} = this.state;
        paramList.push({});
        this.setState({paramList});
    }

    saveAttr(record) {
        record.goodsId = this.props.goodsId;
        FetchUtil.put({
            url: '/goods/attr/map/save',
            data: record,
            success: ({data}) => {
                const {attrMapList} = this.state;
                record.id = data;
                this.setState({attrMapList}, () => {
                    message.info("保存が完了しました。")
                });
            }
        });
    }

    deleteAttr(index, id) {
        const {attrMapList} = this.state;
        if (id) {
            FetchUtil.delete({
                url: `/goods/attr/${this.props.goodsId}/map/${id}/delete`,
                success: () => {
                    attrMapList.splice(index, 1);
                    this.setState({attrMapList}, () => {
                        message.info("削除が完了しました。")
                    });
                }
            });
            return;
        }
        attrMapList.splice(index, 1);
        this.setState({attrMapList});
    }

    saveParam(record) {
        record.goodsId = this.props.goodsId;
        FetchUtil.put({
            url: '/goods/param/save',
            data: record,
            success: ({data}) => {
                const {paramList} = this.state;
                record.id = data;
                this.setState({paramList}, () => {
                    message.info("保存が完了しました。")
                });
            }
        });
    }

    deleteParam(index, id) {
        const {paramList} = this.state;
        if (id) {
            FetchUtil.put({
                url: `/goods/${this.props.goodsId}/param/${id}/delete`,
                success: () => {
                    paramList.splice(index, 1);
                    this.setState({paramList}, () => {
                        message.info("削除完了です。")
                    });
                }
            });
            return;
        }
        paramList.splice(index, 1);
        this.setState({paramList});
    }

    render() {
        const {isEdit, visible, onClose} = this.props;
        const {attrMapList, paramList} = this.state;
        return <Drawer
            title="属性"
            placement="left"
            width={720}
            keyboard={false}
            onClose={() => onClose()}
            visible={visible}
            bodyStyle={{paddingBottom: 80}}>
            <Divider orientation="left">セールス属性&nbsp;
                <Tooltip title="属性を作成" placement="bottom">
                    <Button disabled={!isEdit} size="small" icon="plus" type="dashed"
                            onClick={() => this.addNewLine()}/>
                </Tooltip>
            </Divider>
            <Table
                columns={this.attrColumn}
                dataSource={attrMapList}
                pagination={false}/>
            <Divider orientation="left">パラメータ&nbsp;
                <Tooltip title="パラメータを作成" placement="bottom">
                    <Button disabled={!isEdit} size="small" icon="plus" type="dashed"
                            onClick={() => this.addNewLine('param')}/>
                </Tooltip>
            </Divider>
            <Table
                columns={this.paramColumn}
                dataSource={paramList}
                pagination={false}/>
        </Drawer>
    }
};
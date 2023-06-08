import React, {Component} from "react";
import {
    Button,
    Col,
    Drawer,
    Form,
    Icon,
    Input, InputNumber, message, Modal,
    Row,
    Select,
    Switch,
    Upload
} from "antd";
import "./index.css";
import Region from "../../utils/Region";
import FileUtil from "../../utils/FileUtil";
import FetchUtil from "../../utils/FetchUtil";

const Option = Select.Option;

/**
 * 商品の基本情報を編集
 * @param goodsId
 * @param visible 展示スイッチ
 * @param isEdit 編集スイッチ
 * @param onClose 閉じるコールバック
 * @param saveCallback 保存成功のコールバック
 */
export default class GoodsEdit extends Component {

    state = {
        region: Region.INSTANCE,
        bannerLoading: false,
        address: {},
        validateStatus: {},
        goods: {},
        categoryList: [],
        categoryLevel2List: {},
        categoryLevel3List: {},
        categoryLevel4List: {},
        banner: [],
        imgs: [],
        detailImgs: []
    }

    componentDidMount() {
        this.findCategoryList()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.visible) {
            this.goodsInfo(nextProps.goodsId);
        }
        return true;
    }

    goodsInfo(goodsId) {
        if (!goodsId) {
            this.setState({
                address: {},
                validateStatus: {},
                goods: {},
                banner: [],
                imgs: [],
                detailImgs: []
            })
            return;
        }
        FetchUtil.get({
            url: `/goods/store/${goodsId}/detail`,
            success: ({data: goods}) => {
                const {
                    categoryId,
                    categoryId2,
                    categoryId3
                } = goods;
                this.findCategoryList(categoryId, 2);
                this.findCategoryList(categoryId2, 3);
                this.findCategoryList(categoryId3, 4);
                this.setState({goods});
                this.imgClassify(goods.imgList);
            }
        });
    }

    imgClassify(imgList = []) {
        if (!imgList || !imgList.length) {
            return;
        }
        const banner = [], imgs = [], detailImgs = [];
        imgList.forEach(({imgUrl, imgType}, index) => {
            let temp = imgType === 13 ? imgs : imgType === 14 ? detailImgs : banner;
            temp.push({
                uid: index,
                name: `${index}.jpeg`,
                status: 'done',
                url: imgUrl
            })
        });
        this.setState({banner, imgs, detailImgs});
    }

    async submitGoods() {
        const {
            validateStatus, goods, banner, imgs, detailImgs
        } = this.state;
        for (const valKey in validateStatus) {
            if (validateStatus[valKey] === 'error') {
                return;
            }
        }
        const imgList = [];
        if (imgs.length) {
            for (const file of imgs) {
                imgList.push({
                    imgUrl: file.url ? file.url : await FileUtil.getBase64(file.originFileObj),
                    imgType: 13
                });
            }
        }
        if (detailImgs.length) {
            for (const file of detailImgs) {
                imgList.push({
                    imgUrl: file.url ? file.url : await FileUtil.getBase64(file.originFileObj),
                    imgType: 14
                });
            }
        }
        if (banner.length) {
            imgList.push({
                imgUrl: banner[0].url ? banner[0].url : await FileUtil.getBase64(banner[0].originFileObj),
                imgType: 16
            });
        }
        goods.imgList = imgList;
        FetchUtil.put({
                url: '/goods/store/save',
                data: goods,
                sendBefore: () => this.setState({submitting: true}),
                success: () => {
                    message.info("保存が完了しました");
                    this.setState({visible: false})
                    const {saveCallback} = this.props;
                    if (saveCallback) {
                        saveCallback();
                    }
                },
                complete: () => this.setState({submitting: false})
            }
        );
    }

    findCategoryList(pid = 0, level = 1) {
        const {categoryLevel2List} = this.state;
        const {categoryLevel3List} = this.state;
        const {categoryLevel4List} = this.state;
        if ((level === 2 && !!categoryLevel2List[pid])
            || (level === 3 && !!categoryLevel3List[pid])
            || (level === 4 && !!categoryLevel4List[pid])) {
            return;
        }
        FetchUtil.get({
            url: `/goods/${pid}/findChildrenCategories`,
            success: ({data}) => {
                if (level === 1) {
                    this.setState({categoryList: data});
                }
                if (level === 2) {
                    categoryLevel2List[pid] = data;
                    this.setState({categoryLevel2List});
                }
                if (level === 3) {
                    categoryLevel3List[pid] = data;
                    this.setState({categoryLevel3List});
                }
                if (level === 4) {
                    categoryLevel4List[pid] = data;
                    this.setState({categoryLevel4List});
                }
            }
        });
    }

    beforeUploadImg(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error('JPG/PNGの写真だけアップロードできます!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('写真は必ず2MB以下です!');
            return false;
        }
        return false;
    }

    async handlePreview(file) {
        if (!file.url && !file.preview) {
            file.preview = await FileUtil.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    }

    render() {
        const {isEdit = false, visible = false, onClose} = this.props;
        const {
            region,
            validateStatus,
            categoryList,
            categoryLevel2List,
            categoryLevel3List,
            categoryLevel4List,
            address,
            goods,
            banner,
            imgs,
            detailImgs,
            previewVisible,
            previewImage,
            submitting
        } = this.state;
        const {
            categoryId,
            categoryId2,
            categoryId3,
            categoryId4,
            skuId,
            name,
            simpleDesc,
            price,
            promoPrice,
            isShowBanner,
            isPromote,
            skuList = []
        } = goods;
        const {provinceList = [], cityList = []} = region;
        const {provinceCode, cityCode} = address;
        const categoryList2 = !!categoryLevel2List[categoryId] ? categoryLevel2List[categoryId] : [];
        const categoryList3 = !!categoryLevel3List[categoryId2] ? categoryLevel3List[categoryId2] : [];
        const categoryList4 = !!categoryLevel4List[categoryId3] ? categoryLevel4List[categoryId3] : [];
        return <Drawer
            className="store-goods-edit"
            title="アドレス"
            placement="left"
            width={720}
            maskClosable={false}
            keyboard={false}
            onClose={() => onClose()}
            visible={visible}
            bodyStyle={{paddingBottom: 80}}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item hasFeedback validateStatus={validateStatus.category}>
                            <Select disabled={!isEdit} placeholder="カテゴリ" value={categoryId}
                                    onChange={(pid) => {
                                        goods.categoryId = pid;
                                        goods.categoryId2 = null;
                                        goods.categoryId3 = null;
                                        goods.categoryId4 = null;
                                        this.setState({goods});
                                        this.findCategoryList(pid, 2);
                                    }}>
                                {categoryList.map(({id, name}) =>
                                    <Option key={id} value={id}>{name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item hasFeedback validateStatus={validateStatus.category}>
                            <Select disabled={!isEdit} placeholder="レベル2" value={categoryId2}
                                    onChange={(pid) => {
                                        goods.categoryId2 = pid;
                                        goods.categoryId3 = null;
                                        goods.categoryId4 = null;
                                        this.setState({goods});
                                        this.findCategoryList(pid, 3)
                                    }}>
                                {categoryList2.map(({id, name}) =>
                                    <Option key={id} value={id}>{name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item hasFeedback validateStatus={validateStatus.category}>
                            <Select disabled={!isEdit} placeholder="レベル3" value={categoryId3}
                                    onChange={(pid) => {
                                        goods.categoryId3 = pid;
                                        goods.categoryId4 = null;
                                        this.setState({goods});
                                        this.findCategoryList(pid, 4)
                                    }}>
                                {categoryList3.map(({id, name}) =>
                                    <Option key={id} value={id}>{name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item hasFeedback validateStatus={validateStatus.category}>
                            <Select disabled={!isEdit} placeholder="レベル4" value={categoryId4}
                                    onChange={(pid) => {
                                        goods.categoryId4 = pid;
                                        this.setState({goods});
                                    }}>
                                {categoryList4.map(({id, name}) =>
                                    <Option key={id} value={id}>{name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="商品名" hasFeedback validateStatus={validateStatus.name}>
                            <Input.TextArea disabled={!isEdit} rows={4} placeholder="商品カードに表示" value={name}
                                            maxLength={128}
                                            onChange={({target: {value}}) => {
                                                goods.name = value;
                                                validateStatus['name'] = !!value ? 'success' : 'error';
                                                this.setState({goods, validateStatus});
                                            }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="シンプルデスクリプション" hasFeedback validateStatus={validateStatus.simpleDesc}>
                            <Input.TextArea disabled={!isEdit} rows={4} placeholder="商品詳細画面に表示" value={simpleDesc}
                                            maxLength={64}
                                            onChange={({target: {value}}) => {
                                                goods.simpleDesc = value;
                                                validateStatus['simpleDesc'] = !!value ? 'success' : 'error';
                                                this.setState({address, validateStatus});
                                            }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item label="原価" hasFeedback validateStatus={validateStatus.price}>
                            <InputNumber disabled={!isEdit} style={{width: "100%"}}
                                         formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         value={price}
                                         onChange={(value) => {
                                             goods.price = value;
                                             validateStatus['price'] = !!value ? 'success' : 'error';
                                             this.setState({address, validateStatus});
                                         }}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="価格" hasFeedback validateStatus={validateStatus.promoPrice}>
                            <InputNumber disabled={!isEdit} style={{width: "100%"}}
                                         formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         value={promoPrice}
                                         onChange={(value) => {
                                             goods.promoPrice = value;
                                             validateStatus['promoPrice'] = !!value ? 'success' : 'error';
                                             this.setState({address, validateStatus});
                                         }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="デフォルトSKU">
                            <Select value={skuId}
                                    onChange={(value) => {
                                        goods.skuId = value;
                                        this.setState({})
                                    }}>
                                {skuList.map(({id, attrs}) =>
                                    <Option key={id} value={id}>{attrs}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="倉庫所在地" hasFeedback validateStatus={validateStatus.location}>
                            <Input readOnly value={goods.location}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="都道府県">
                            <Select disabled={!isEdit} placeholder="都道府県をお選び下さい" value={provinceCode}
                                    onChange={(value, option) => {
                                        address.provinceCode = value;
                                        address.province = option.props.children;
                                        address.cityCode = undefined;
                                        address.city = undefined;
                                        goods.location = `${address.province}`;
                                        validateStatus['location'] = !!goods.location ? 'success' : 'error';
                                        region.initRegion(region.setCityList, value, undefined, 2, () =>
                                            this.setState({address, validateStatus})
                                        );
                                    }}>
                                {provinceList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="市">
                            <Select disabled={!isEdit} placeholder="市をお選び下さい" value={cityCode}
                                    onChange={(value, option) => {
                                        address.cityCode = value;
                                        address.city = option.props.children;
                                        goods.location = `${address.province}${address.city}`;
                                        validateStatus['location'] = !!goods.location ? 'success' : 'error';
                                        this.setState({})
                                    }}>
                                {cityList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="店舗ページに展示">
                            <Switch
                                disabled={!isEdit}
                                checked={!!isPromote}
                                checkedChildren={<Icon type="check"/>}
                                unCheckedChildren={<Icon type="close"/>}
                                onChange={checked => {
                                    goods.isPromote = checked ? 1 : 0;
                                    this.setState({goods});
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="店舗ページのバナーに展示">
                            <Switch
                                disabled={!isEdit}
                                checked={!!isShowBanner}
                                checkedChildren={<Icon type="check"/>}
                                unCheckedChildren={<Icon type="close"/>}
                                onChange={checked => {
                                    if (!checked) {
                                        goods.isShowBanner = 0;
                                        this.setState({banner: []});
                                    } else {
                                        goods.isShowBanner = 1;
                                    }
                                    this.setState({goods});
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="写真" hasFeedback validateStatus={validateStatus.banner}>
                            <Upload
                                disabled={!isEdit || !isShowBanner}
                                accept=".png,.jpg,.jpeg,.gif"
                                listType="picture-card"
                                fileList={banner}
                                beforeUpload={(file) => this.beforeUploadImg(file)}
                                onChange={async ({file: {status, type, size}, fileList}) => {
                                    if (!status) {
                                        if ((type !== 'image/jpeg' && type !== 'image/png' && type !== 'image/gif') || size / 1024 / 1024 > 2) {
                                            return;
                                        }
                                    }
                                    validateStatus['banner'] = isShowBanner && !fileList.length ? 'error' : 'success';
                                    this.setState({validateStatus, banner: fileList});
                                }}
                                onPreview={info => this.handlePreview(info)}
                                customRequest={() => {
                                }}
                            >
                                {banner.length ? null : <div>
                                    <Icon type="plus"/>
                                    <div>アップロード</div>
                                </div>}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Form.Item label="カバー(最大6枚)" hasFeedback validateStatus={validateStatus.imgs}>
                        <Upload
                            disabled={!isEdit}
                            accept=".png,.jpg,.jpeg,.gif"
                            listType="picture-card"
                            fileList={imgs}
                            beforeUpload={(file) => this.beforeUploadImg(file)}
                            onChange={({file, fileList}) => {
                                if (!file.status) {
                                    if ((file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') || file.size / 1024 / 1024 > 2) {
                                        return;
                                    }
                                }
                                validateStatus['imgs'] = !fileList.length ? 'error' : 'success';
                                this.setState({validateStatus, imgs: fileList})
                            }}
                            onPreview={info => this.handlePreview(info)}
                            customRequest={() => {
                            }}
                        >
                            {imgs.length >= 6 ? null : <div>
                                <Icon type="plus"/>
                                <div>アップロード</div>
                            </div>}
                        </Upload>
                    </Form.Item>
                </Row>
                <Row gutter={16}>
                    <Form.Item label="紹介写真(最大20枚)" hasFeedback validateStatus={validateStatus.detailImgs}>
                        <Upload
                            disabled={!isEdit}
                            accept=".png,.jpg,.jpeg,.gif"
                            listType="picture-card"
                            fileList={detailImgs}
                            beforeUpload={(file) => this.beforeUploadImg(file)}
                            onChange={({file, fileList}) => {
                                if (!file.status) {
                                    if ((file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') || file.size / 1024 / 1024 > 2) {
                                        return;
                                    }
                                }
                                validateStatus['detailImgs'] = !fileList.length ? 'error' : 'success';
                                this.setState({validateStatus, detailImgs: fileList})
                            }}
                            onPreview={info => this.handlePreview(info)}
                            customRequest={() => {
                            }}
                        >
                            {detailImgs.length >= 20 ? null : <div>
                                <Icon type="plus"/>
                                <div>アップロード</div>
                            </div>}
                        </Upload>
                    </Form.Item>
                </Row>
            </Form>
            <Modal closable={false} visible={previewVisible} footer={null}
                   onCancel={() => this.setState({previewVisible: false})}>
                <img alt="" style={{width: '100%'}} src={previewImage}/>
            </Modal>
            {isEdit ? <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button disabled={!!submitting} onClick={() => onClose()}
                        style={{marginRight: 8}}>取消</Button>
                <Button disabled={!!submitting} type="primary"
                        onClick={() => this.submitGoods()}>保存</Button>
            </div> : null}
        </Drawer>
    }
}
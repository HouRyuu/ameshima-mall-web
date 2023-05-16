import React, {Component} from "react";
import Order from "../order";

export default class StoreManageOrder extends Component {


    render() {
        return <main className="store-manage-main">
            <Order storeFlag/>
        </main>
    }
}
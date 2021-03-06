// @flow

import React, {Component} from "react";
import {Container, Row, Button, Col} from "reactstrap";
import ControlModal from "./ControlModal";
import InfoModal from "./InfoModal";

import type {Node} from 'react';
import type {Device} from "../../types/devices/devices";

import "../../style/Device.css";

type DeviceProps = {
    toggleSwitch : (deviceId : number) => void,
    changeBrightness : (deviceId : number, brightness : number) => void,
    id : number,
    brightness : number,
    place : string,
    name : string,
    description : string,
    status : boolean,
    deleteDevice: (deviceId : number) => void
}

type DeviceState = {
    imgArr: Array<string>,
    lightParams: Array<string>,
    modalControl: boolean,
    modalInfo: boolean
};

class DeviceBlock extends Component<Device & DeviceProps, DeviceState> {

    constructor(props: Device & DeviceProps) {
        super(props);
        const self: any = this;
        this.state = {
            imgArr: [
                require("../../images/light1.png"),
                require("../../images/light2.png"),
                require("../../images/light3.png"),
                require("../../images/light4.png"),
                require("../../images/light5.png")],
            lightParams: ["status", "place", "brightness"],
            modalControl: false,
            modalInfo: false
        };
        self.toggleControl = this.toggleControl.bind(this);
        self.toggleInfo = this.toggleInfo.bind(this);
    }

    toggleControl() : void {
        this.setState({
            modalControl: !this.state.modalControl
        });
    }

    toggleInfo() : void {
        this.setState({
            modalInfo: !this.state.modalInfo
        });
    }

    getParamValue(paramKey: string, paramValue: string): string {
        switch (paramKey) {
            case "status":
                return (paramValue) ? "ON" : "OFF";
            case "brightness":
                return `${paramValue} %`;
            default :
                return paramValue;
        }
    }

    render(): Node {
        let imgIndex: number = this.props.id % this.state.imgArr.length;
        let img: string = this.state.imgArr[imgIndex];
        return (
            <Col md="4" className="container-device">
                <Container className="container-device-content">
                    <Row className="device-content">
                        <Col md="5">
                            <img alt="" src={img}
                                 width="100%" height="100%"/>
                        </Col>
                        <Col md="5">
                            <Row>
                                {
                                    this.state.lightParams.map((lightParam, i) => {
                                        let paramVal: string = this.props[lightParam];
                                        return (
                                            <React.Fragment key={i}>
                                                <Col md="5" className="light-param">
                                                    <h5>{lightParam[0].toUpperCase() + " :"}</h5>
                                                </Col>
                                                <Col md="7" className="light-param">
                                                    <h5>{this.getParamValue(lightParam, paramVal)}</h5>
                                                </Col>
                                            </React.Fragment>
                                        )
                                    })
                                }

                            </Row>
                        </Col>
                        <Col md="2">
                            <div className={
                                (this.props.status ?
                                        "switch-indicator indicator-green" :
                                        "switch-indicator indicator-red"
                                )}></div>
                        </Col>
                    </Row>
                    <Row className="control-panel">
                        <Col md="6">
                            <Button onClick={this.toggleInfo} color="primary" block>INFO</Button>
                        </Col>
                        <Col md="6">
                            <Button onClick={this.toggleControl} color="success" block>CONTROL</Button>
                        </Col>
                        <ControlModal
                            img={img}
                            {...this.props}
                            deleteDevice={this.props.deleteDevice}
                            isOpen={this.state.modalControl}
                            toggle={this.toggleControl}/>
                        <InfoModal
                            {...this.props}
                            img={img}
                            isOpen={this.state.modalInfo}
                            toggle={this.toggleInfo}/>
                    </Row>
                </Container>
            </Col>
        )
    }
}

export default DeviceBlock;
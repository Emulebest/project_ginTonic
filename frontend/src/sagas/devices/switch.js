// @flow

import {put, call} from 'redux-saga/effects';
import type {IOEffect} from 'redux-saga/effects';
import axios from "axios";
import {switchDeviceSuccess, switchDeviceFailure} from "../../actions/devices/switch";
import {BASE_URL} from "../../constants/baseUrl";

export default function* switchDevice({payload}: { payload: { deviceId: number } }): Generator<IOEffect, void, any> {
    try {
        // const res = yield call(axios, {
        //     url: `${BASE_URL}/devices`,
        //     method: "PUT",
        //     data: payload,
        //     headers: {
        //         'content-type': 'application/json',
        //     }
        // });
        let device = {
            id: 2,
            status: false,
            place: "Bathroom",
            brightness: 0
        };

        yield put(switchDeviceSuccess(device));
    }
    catch (error) {
        yield put(switchDeviceFailure(error));
    }
}
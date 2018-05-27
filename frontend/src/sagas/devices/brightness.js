// @flow

import {put, call} from 'redux-saga/effects';
import type {IOEffect} from 'redux-saga/effects';
import axios from "axios";
import {changeBrightnessSuccess, changeBrightnessError} from "../../actions/devices/brightness";
import {BASE_URL} from "../../constants/baseUrl";

export default function* changeBrightness({payload}: { payload: { deviceId: number } }): Generator<IOEffect, void, any> {
    let {deviceId} = payload;
    let message = "Successfully changed brightness";
    try {
        // const res = yield call(axios, {
        //     url: `${BASE_URL}/devices`,
        //     method: "PUT",
        //     data: payload,
        //     headers: {
        //         'content-type': 'application/json',
        //     }
        // });

        yield put(changeBrightnessSuccess(deviceId, message));
    }
    catch (error) {
        yield put(changeBrightnessError(error));
    }
}
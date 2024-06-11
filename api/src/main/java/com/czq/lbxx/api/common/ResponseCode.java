package com.czq.lbxx.api.common;

public enum ResponseCode {
    SUCCESS(200, "Success"),
    SERVER_ERROR(500, "Internal Server Error");

    private final int code;
    private final String msg;

    ResponseCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}

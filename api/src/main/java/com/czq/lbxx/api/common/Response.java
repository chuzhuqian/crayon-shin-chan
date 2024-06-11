package com.czq.lbxx.api.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response<T> {
    private int code;
    private T data;
    private String msg;

    public Response(ResponseCode responseCode, T data) {
        this.code = responseCode.getCode();
        this.msg = responseCode.getMsg();
        this.data = data;
    }

    public Response(ResponseCode responseCode) {
        this.code = responseCode.getCode();
        this.msg = responseCode.getMsg();
        this.data = null;
    }

    public static <T> Response<T> success(T data) {
        return new Response<>(ResponseCode.SUCCESS, data);
    }

    public static <T> Response<T> error(T data) {
        return new Response<>(ResponseCode.SERVER_ERROR);
    }
}

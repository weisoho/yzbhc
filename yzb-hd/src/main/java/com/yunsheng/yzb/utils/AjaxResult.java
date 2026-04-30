package com.yunsheng.yzb.utils;

import lombok.Data;

//表示ajax请求的json格式的想要
@Data
public class AjaxResult<T>
{

	private String msg; // 表示响应状态，规定"success"表示成功，"error"表示失败
	private T data; // 表示响应信息，既可以是提示信息，也可以是json格式的对象数据
	private int code;

	public AjaxResult()
	{

	}

	public AjaxResult(int code,String msg, T data)
	{
		this.msg = msg;
		this.data = data;
		this.code=code;
	}

	public static <T> AjaxResult<T> res(int code,String msg,T data)
	{
		return new AjaxResult<>(code,msg, data);
	}
	public static <T> AjaxResult<T> errorInstance(T data)
	{
		return new AjaxResult<>(0,"error", data);
	}

	public static <T> AjaxResult<T> successInstance(T data)
	{
		return new AjaxResult<>(1,"success", data);
	}
	public static <T> AjaxResult<T> success(T data)
	{
		return new AjaxResult<>(1,"success", data);
	}

}

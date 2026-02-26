package com.yunsheng.yzb.utils;

//表示ajax请求的json格式的想要
public class AjaxResult
{

	private String msg; // 表示响应状态，规定"success"表示成功，"error"表示失败
	private Object data; // 表示响应信息，既可以是提示信息，也可以是json格式的对象数据
	private int code;

	public AjaxResult()
	{

	}

	public AjaxResult(int code,String msg, Object data)
	{
		this.msg = msg;
		this.data = data;
		this.code=code;
	}

	public static AjaxResult res(int code,String msg,Object data)
	{
		return new AjaxResult(code,msg, data);
	}
	public static AjaxResult errorInstance(Object data)
	{
		return new AjaxResult(0,"error", data);
	}

	public static AjaxResult successInstance(Object data)
	{
		return new AjaxResult(1,"success", data);
	}
	public static AjaxResult success(Object data)
	{
		return new AjaxResult(1,"success", data);
	}

	public int getCode()
	{
		return code;
	}

	public void setCode(int code)
	{
		this.code = code;
	}

	public String getMsg()
	{
		return msg;
	}

	public void setMsg(String msg)
	{
		this.msg = msg;
	}

	public Object getData()
	{
		return data;
	}

	public void setData(Object data)
	{
		this.data = data;
	}

}

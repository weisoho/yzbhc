package com.yunsheng.yzb.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadFileInfo {
    private String originalName;
    private String storedName;
    private String url;
}
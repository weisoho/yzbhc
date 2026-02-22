package com.yunsheng.yzb.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 上传文件
 */
public interface UploadFileService {
    String uploadFile(MultipartFile file);
}

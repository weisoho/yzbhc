package com.yunsheng.yzb.service;

import com.yunsheng.yzb.vo.UploadFileInfo;
import org.springframework.web.multipart.MultipartFile;

/**
 * 上传文件
 */
public interface UploadFileService {
    UploadFileInfo uploadFile(MultipartFile file);
}

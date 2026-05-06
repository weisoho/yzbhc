package com.yunsheng.yzb.service.impl;

import com.yunsheng.yzb.service.UploadFileService;
import com.yunsheng.yzb.vo.UploadFileInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 上传文件
 */
@Service
public class UploadFileServiceImpl implements UploadFileService {
    @Value("${UPLOAD_PATH:/app/uploads/}")
    private String uploadPath;

    @Override
    public UploadFileInfo uploadFile(MultipartFile multipartFile) {
        if (multipartFile.isEmpty()) {
            return null;
        }
        String originalFilename = multipartFile.getOriginalFilename();
        String extension = "";
        if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        String storedName = UUID.randomUUID().toString().replace("-", "") + extension;
        Path uploadDirectory = Paths.get(uploadPath).normalize();
        Path targetPath = uploadDirectory.resolve(storedName).normalize();

        try {
            Files.createDirectories(uploadDirectory);
            multipartFile.transferTo(targetPath.toFile());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new UploadFileInfo(originalFilename, storedName, "/api/files/" + storedName);
    }
}

package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.service.UploadFileService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.vo.UploadFileInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class FileController {

    @javax.annotation.Resource
    private UploadFileService uploadFileService;

    @Value("${UPLOAD_PATH:/app/uploads/}")
    private String uploadPath;

    @PostMapping("/upload")
    public AjaxResult<UploadFileInfo> upload(@RequestParam("file") MultipartFile file) {
        UploadFileInfo uploadFileInfo = uploadFileService.uploadFile(file);
        if (uploadFileInfo == null) {
            return AjaxResult.res(0, "上传文件不能为空", null);
        }
        return AjaxResult.success(uploadFileInfo);
    }

    @GetMapping("/files/{storedName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String storedName,
            @RequestParam(name = "download", required = false, defaultValue = "false") boolean download,
            @RequestParam(name = "filename", required = false) String filename) throws UnsupportedEncodingException {
        String safeFileName = Paths.get(storedName).getFileName().toString();
        Path filePath = Paths.get(uploadPath).resolve(safeFileName).normalize();
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(filePath);
        String resolvedFileName = StringUtils.hasText(filename) ? filename : safeFileName;
        String encodedFileName = URLEncoder.encode(resolvedFileName, StandardCharsets.UTF_8.name()).replaceAll("\\+", "%20");
        ContentDisposition disposition = (download ? ContentDisposition.attachment() : ContentDisposition.inline())
                .filename(encodedFileName, StandardCharsets.UTF_8)
                .build();

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            String detectedType = Files.probeContentType(filePath);
            if (StringUtils.hasText(detectedType)) {
                mediaType = MediaType.parseMediaType(detectedType);
            }
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }
}
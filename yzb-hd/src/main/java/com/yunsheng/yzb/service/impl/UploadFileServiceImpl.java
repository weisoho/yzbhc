package com.yunsheng.yzb.service.impl;

import com.yunsheng.yzb.service.UploadFileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 上传文件
 */
@Service
public class UploadFileServiceImpl implements UploadFileService {
    @Override
    public String uploadFile(MultipartFile multipartFile) {
        if (multipartFile.isEmpty()) {
            return null;
        }
        //图片的新名字，使用uuid为了图片名字的唯一性，防止重名
        String name = UUID.randomUUID().toString().replace("-","");
        /*
         * 获取上传图片的后缀
         * multipartFile.getOriginalFilename()获取图片名字，例如：picture.png
         * substring和lastIndexOf都是String的方法，不会自己搜
         */

        String type = multipartFile.getOriginalFilename().
                substring(multipartFile.getOriginalFilename().lastIndexOf('.'));

        //保存图片的路径，我们存放在resources下static下的image
        //修改后的代码
        String value = "F:/project/bus/src/main/resources/static/upimg/";
        //创建文件
        File file = new File(value+name+type);
        try {
            //transferTo 图片复制
            multipartFile.transferTo(file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        //String fname=multipartFile.getOriginalFilename();
       // return file.getAbsolutePath();
        return name+type;
    }
}

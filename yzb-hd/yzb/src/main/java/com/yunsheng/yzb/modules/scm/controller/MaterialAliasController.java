package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.entity.MaterialEntity;
import com.yunsheng.yzb.modules.scm.service.MaterialDictionaryService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * 前端兼容接口，保留简单物资列表查询。
 */
@RestController
@RequestMapping("/api/materials")
public class MaterialAliasController {

    @Resource
    private MaterialDictionaryService materialDictionaryService;

    @GetMapping
    public AjaxResult<List<MaterialEntity>> list() {
        return AjaxResult.success(materialDictionaryService.listEnabledMaterials());
    }
}
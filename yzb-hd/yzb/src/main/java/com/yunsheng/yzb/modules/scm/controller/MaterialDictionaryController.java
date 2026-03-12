package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.MaterialEntity;
import com.yunsheng.yzb.modules.scm.service.MaterialDictionaryService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 物资字典接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/materials")
public class MaterialDictionaryController {

    @Resource
    private MaterialDictionaryService materialDictionaryService;

    @GetMapping
    public AjaxResult<PageResult<MaterialEntity>> page(ScmRequest.MaterialQuery query) {
        return AjaxResult.success(materialDictionaryService.queryMaterials(query));
    }

    @GetMapping("/enabled")
    public AjaxResult<List<MaterialEntity>> enabledList() {
        return AjaxResult.success(materialDictionaryService.listEnabledMaterials());
    }

    @GetMapping("/{materialId}")
    public AjaxResult<MaterialEntity> detail(@PathVariable Long materialId) {
        return AjaxResult.success(materialDictionaryService.getMaterial(materialId));
    }

    @PostMapping
    public AjaxResult<MaterialEntity> create(@Valid @RequestBody ScmRequest.MaterialSave request) {
        return AjaxResult.success(materialDictionaryService.createMaterial(request));
    }

    @PutMapping("/{materialId}")
    public AjaxResult<MaterialEntity> update(@PathVariable Long materialId,
                                             @Valid @RequestBody ScmRequest.MaterialSave request) {
        return AjaxResult.success(materialDictionaryService.updateMaterial(materialId, request));
    }

    @DeleteMapping("/{materialId}")
    public AjaxResult<Boolean> delete(@PathVariable Long materialId) {
        materialDictionaryService.deleteMaterial(materialId);
        return AjaxResult.success(Boolean.TRUE);
    }
}
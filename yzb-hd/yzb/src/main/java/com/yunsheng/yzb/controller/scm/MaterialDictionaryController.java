package com.yunsheng.yzb.controller.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.MaterialEntity;
import com.yunsheng.yzb.service.scm.MaterialDictionaryService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 物资字典控制器。
 * 提供物资字典分页、详情和维护接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/materials")
public class MaterialDictionaryController {

    /**
     * 物资字典服务。
     */
    @Resource
    private MaterialDictionaryService materialDictionaryService;

    /**
     * 分页查询物资字典。
     *
     * @param query 物资分页查询条件
     * @return 物资分页结果
     */
    @GetMapping
    public AjaxResult<PageResult<MaterialEntity>> page(ScmRequest.MaterialQuery query) {
        return AjaxResult.success(materialDictionaryService.queryMaterials(query));
    }

    /**
     * 查询状态为启用的物资列表。
     *
     * @return 启用物资列表
     */
    @GetMapping("/enabled")
    public AjaxResult<List<MaterialEntity>> enabledList() {
        return AjaxResult.success(materialDictionaryService.listEnabledMaterials());
    }

    /**
     * 查询单个物资详情。
     *
     * @param materialId 物资主键
     * @return 物资详情
     */
    @GetMapping("/{materialId}")
    public AjaxResult<MaterialEntity> detail(@PathVariable Long materialId) {
        return AjaxResult.success(materialDictionaryService.getMaterial(materialId));
    }

    /**
     * 新增物资字典。
     *
     * @param request 物资保存请求体，JSON 格式
     * @return 新增后的物资信息
     */
    @PostMapping
    public AjaxResult<MaterialEntity> create(@Valid @RequestBody ScmRequest.MaterialSave request) {
        return AjaxResult.success(materialDictionaryService.createMaterial(request));
    }

    /**
     * 更新物资字典。
     *
     * @param materialId 物资主键
     * @param request 物资保存请求体，JSON 格式
     * @return 更新后的物资信息
     */
    @PutMapping("/{materialId}")
    public AjaxResult<MaterialEntity> update(@PathVariable Long materialId,
                                             @Valid @RequestBody ScmRequest.MaterialSave request) {
        return AjaxResult.success(materialDictionaryService.updateMaterial(materialId, request));
    }

    /**
     * 删除物资字典。
     *
     * @param materialId 物资主键
     * @return 删除结果
     */
    @DeleteMapping("/{materialId}")
    public AjaxResult<Boolean> delete(@PathVariable Long materialId) {
        materialDictionaryService.deleteMaterial(materialId);
        return AjaxResult.success(Boolean.TRUE);
    }
}
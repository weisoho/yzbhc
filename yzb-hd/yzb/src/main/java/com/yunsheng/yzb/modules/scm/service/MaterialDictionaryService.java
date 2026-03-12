package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.MaterialEntity;

import java.util.List;

/**
 * 物资字典服务。
 */
public interface MaterialDictionaryService {

    PageResult<MaterialEntity> queryMaterials(ScmRequest.MaterialQuery query);

    MaterialEntity getMaterial(Long materialId);

    MaterialEntity createMaterial(ScmRequest.MaterialSave request);

    MaterialEntity updateMaterial(Long materialId, ScmRequest.MaterialSave request);

    void deleteMaterial(Long materialId);

    List<MaterialEntity> listEnabledMaterials();
}
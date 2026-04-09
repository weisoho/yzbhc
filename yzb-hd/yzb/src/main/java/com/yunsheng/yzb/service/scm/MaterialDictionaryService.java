package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.MaterialEntity;

import java.util.List;

/**
 * 物资字典服务。
 */
public interface MaterialDictionaryService {

    /**
     * 分页查询物资字典。
     *
     * @param query 查询条件
     * @return 物资分页结果
     */
    PageResult<MaterialEntity> queryMaterials(ScmRequest.MaterialQuery query);

    /**
     * 查询物资详情。
     *
     * @param materialId 物资主键
     * @return 物资详情
     */
    MaterialEntity getMaterial(Long materialId);

    /**
     * 新增物资字典。
     *
     * @param request 物资保存参数
     * @return 新增后的物资信息
     */
    MaterialEntity createMaterial(ScmRequest.MaterialSave request);

    /**
     * 更新物资字典。
     *
     * @param materialId 物资主键
     * @param request 物资保存参数
     * @return 更新后的物资信息
     */
    MaterialEntity updateMaterial(Long materialId, ScmRequest.MaterialSave request);

    /**
     * 删除物资字典。
     *
     * @param materialId 物资主键
     */
    void deleteMaterial(Long materialId);

    /**
     * 查询启用状态的物资列表。
     *
     * @return 启用物资列表
     */
    List<MaterialEntity> listEnabledMaterials();

    /**
     * 查询引用指定注册证的物资。
     *
     * @param qualificationId 注册证主键
     * @return 引用物资列表
     */
    List<MaterialEntity> listByQualification(Long qualificationId);

    /**
     * 同步注册证号到关联物资。
     *
     * @param qualificationId 注册证主键
     * @return 同步数量
     */
    int syncQualificationReferences(Long qualificationId);
}
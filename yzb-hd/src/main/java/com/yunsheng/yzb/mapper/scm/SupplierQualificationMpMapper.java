package com.yunsheng.yzb.mapper.scm;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;
import com.yunsheng.yzb.vo.scm.ManufacturerQualificationWarningView;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.SupplierQualificationView;
import org.apache.ibatis.annotations.Param;

/**
 * 供应商资质 Mapper。
 */
public interface SupplierQualificationMpMapper extends BaseMapper<SupplierQualificationEntity> {

    /**
     * 分页查询供应商资质视图。
     *
     * @param page 分页参数
     * @param query 查询条件
     * @return 资质视图分页结果
     */
    IPage<SupplierQualificationView> selectQualificationViewPage(Page<?> page, @Param("query") ScmRequest.QualificationQuery query);

    /**
     * 分页查询供应商资质预警视图。
     *
     * @param page 分页参数
     * @param query 查询条件
     * @return 资质预警分页结果
     */
    IPage<SupplierQualificationView> selectQualificationWarningPage(Page<?> page, @Param("query") ScmRequest.QualificationQuery query);

    /**
     * 分页查询厂商资质预警视图。
     *
     * @param page 分页参数
     * @param query 查询条件
     * @return 厂商资质预警分页结果
     */
    IPage<ManufacturerQualificationWarningView> selectManufacturerWarningPage(Page<?> page,
            @Param("query") ScmRequest.ManufacturerWarningQuery query);

    /**
     * 统计供应商资质预警数量。
     *
     * @param warningDays 预警天数
     * @return 供应商资质预警数量
     */
    Integer countSupplierWarnings(@Param("warningDays") Integer warningDays);

    /**
     * 统计厂商资质预警数量。
     *
     * @param warningDays 预警天数
     * @return 厂商资质预警数量
     */
    Integer countManufacturerWarnings(@Param("warningDays") Integer warningDays);

    /**
     * 统计产品资质预警数量。
     *
     * @param warningDays 预警天数
     * @return 产品资质预警数量
     */
    Integer countProductWarnings(@Param("warningDays") Integer warningDays);
}
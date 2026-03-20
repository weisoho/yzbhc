package com.yunsheng.yzb.mapper.scm;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;
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
}
package com.yunsheng.yzb.utils;

import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.vo.PageOutputDto;


public class ClassCastUtil {

    public static <T> PageOutputDto<T> pageInfoToPageOutputDto(PageInfo<T> pageInfo) {

        PageOutputDto dto = new PageOutputDto();
        dto.setHasNext(pageInfo.isHasNextPage());
        dto.setList(pageInfo.getList());
        dto.setPage(pageInfo.getPages());
        dto.setTotal(pageInfo.getTotal());
        dto.setHasPre(pageInfo.isHasPreviousPage());

        return dto;
    }
    public static <T> PageOutputDto<T> pageInfoToPageOutputDto1(PageInfo<T> pageInfo,Long updateTime) {

        PageOutputDto dto = new PageOutputDto();
        dto.setHasNext(pageInfo.isHasNextPage());
        dto.setList(pageInfo.getList());
        dto.setPage(pageInfo.getPages());
        dto.setTotal(pageInfo.getTotal());
        dto.setHasPre(pageInfo.isHasPreviousPage());
        dto.setUpdateTime(updateTime);

        return dto;
    }

}

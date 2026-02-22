package com.yunsheng.yzb.vo;

import lombok.Data;

import java.util.List;

/**
 * @Auther: july
 * @Date: 2019/3/30 17:20
 * @Description:
 */
@Data
public class PageOutputDto<T> {

    private long total;

    private boolean hasNext;

    private int page;

    private List<T> list;

    private boolean hasPre;

    private Long updateTime;


    /**
     * 将一个pageOutputDto转移到另一个pageOutputDto中，并重设list
     *
     * @param list 数据list
     * @param page pageOutputDto对象
     * @return
     */
    public static <T> PageOutputDto<T> initFromListAndPage(List<T> list, PageOutputDto<?> page) {
        PageOutputDto<T> outputDto = new PageOutputDto<>();
        outputDto.setTotal(page.getTotal());
        outputDto.setPage(page.getPage());
        outputDto.setHasNext(page.isHasNext());
        outputDto.setList(list);
        outputDto.setHasPre(page.isHasPre());
        return outputDto;
    }


    /**
     * 新的转换移动到common项目的ClassCastUtil中了
     * @param pageInfo
     * @return
     */
//    public static PageOutputDto getInstance(PageInfo pageInfo) {
//
//        PageOutputDto dto = new PageOutputDto();
//        dto.setHasNext(pageInfo.isHasNextPage());
//        dto.setList(pageInfo.getList());
//        dto.setPage(pageInfo.getPages());
//        dto.setTotal(pageInfo.getTotal());
//        dto.setHasPre(pageInfo.isHasPreviousPage());
//
//        return dto;
//    }


}

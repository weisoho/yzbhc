package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AdverseEventRecordMapper;
import com.yunsheng.yzb.model.AdverseEventRecord;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.utils.SnGenerateUtil;
import com.yunsheng.yzb.vo.PageOutputDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/adverseEvent")
public class AdverseEventController {

    @Autowired
    private AdverseEventRecordMapper adverseEventRecordMapper;

    @PostMapping("/selectModelList")
    public AjaxResult<PageOutputDto<AdverseEventRecord>> selectModelList(@RequestBody(required = false) AdverseEventRecord model) {
        AdverseEventRecord query = model == null ? new AdverseEventRecord() : model;
        PageHelper.startPage(query.getPageNum() == null ? 1 : query.getPageNum(), query.getPageSize() == null ? 10 : query.getPageSize());
        List<AdverseEventRecord> list = adverseEventRecordMapper.selectPage(query);
        PageInfo<AdverseEventRecord> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1, "成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    @PostMapping("/addOrUpdate")
    public AjaxResult<AdverseEventRecord> addOrUpdate(@RequestBody AdverseEventRecord model) {
        if (!StringUtils.hasText(model.getEventName()) || !StringUtils.hasText(model.getPatientName()) || model.getOccurrenceDate() == null) {
            return AjaxResult.res(0, "事件名称、患者姓名、发生日期不能为空", null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        if (model.getId() == null) {
            model.setEventNo(SnGenerateUtil.generate("BL", adverseEventRecordMapper.selectLatestNo()));
            model.setRecorderId(user == null ? null : user.getId());
            model.setRecorderName(user == null ? null : (StringUtils.hasText(user.getRealName()) ? user.getRealName() : user.getUserName()));
            model.setStatus(model.getStatus() == null ? 1 : model.getStatus());
            model.setCreateTime(LocalDateTime.now());
            model.setUpdateTime(LocalDateTime.now());
            model.setDeleteFlag(0);
            adverseEventRecordMapper.insert(model);
            return AjaxResult.res(1, "新增成功", model);
        }
        AdverseEventRecord current = adverseEventRecordMapper.selectById(model.getId());
        if (current == null) {
            return AjaxResult.res(0, "记录不存在", null);
        }
        current.setPatientName(model.getPatientName());
        current.setGender(model.getGender());
        current.setAge(model.getAge());
        current.setPatientId(model.getPatientId());
        current.setHospitalizationNo(model.getHospitalizationNo());
        current.setInvolvedProject(model.getInvolvedProject());
        current.setEventName(model.getEventName());
        current.setOccurrenceDate(model.getOccurrenceDate());
        current.setStatus(model.getStatus() == null ? current.getStatus() : model.getStatus());
        current.setEventSummary(model.getEventSummary());
        current.setInvestigationSituation(model.getInvestigationSituation());
        current.setEventAnalysis(model.getEventAnalysis());
        current.setEventSummaryDetail(model.getEventSummaryDetail());
        current.setHandlingResult(model.getHandlingResult());
        current.setRectificationMeasures(model.getRectificationMeasures());
        current.setAttachment(model.getAttachment());
        current.setUpdateTime(LocalDateTime.now());
        adverseEventRecordMapper.updateById(current);
        return AjaxResult.res(1, "修改成功", current);
    }

    @PostMapping("/delete")
    public AjaxResult<Void> delete(@RequestParam Long id) {
        AdverseEventRecord current = adverseEventRecordMapper.selectById(id);
        if (current == null) {
            return AjaxResult.res(0, "记录不存在", null);
        }
        current.setUpdateTime(LocalDateTime.now());
        adverseEventRecordMapper.deleteById(current);
        return AjaxResult.res(1, "删除成功", null);
    }
}
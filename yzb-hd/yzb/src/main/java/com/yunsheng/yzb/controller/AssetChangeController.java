package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetChangeRecordMapper;
import com.yunsheng.yzb.mapper.AssetMapper;
import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.model.AssetChangeRecord;
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

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/assetChange")
public class AssetChangeController {

    @Autowired
    private AssetChangeRecordMapper assetChangeRecordMapper;

    @Autowired
    private AssetMapper assetMapper;

    @PostMapping("/selectModelList")
    public AjaxResult<PageOutputDto<AssetChangeRecord>> selectModelList(@RequestBody(required = false) AssetChangeRecord model) {
        AssetChangeRecord query = model == null ? new AssetChangeRecord() : model;
        PageHelper.startPage(query.getPageNum() == null ? 1 : query.getPageNum(), query.getPageSize() == null ? 10 : query.getPageSize());
        List<AssetChangeRecord> list = assetChangeRecordMapper.selectPage(query);
        PageInfo<AssetChangeRecord> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1, "成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    @PostMapping("/applyScrap")
    public AjaxResult<AssetChangeRecord> applyScrap(@RequestBody AssetChangeRecord model) {
        if (model.getAssetId() == null) {
            return AjaxResult.res(0, "请选择资产", null);
        }
        if (!StringUtils.hasText(model.getChangeReason())) {
            return AjaxResult.res(0, "请输入报废原因", null);
        }
        Asset asset = assetMapper.selectByPrimaryKey(model.getAssetId());
        if (asset == null) {
            return AjaxResult.res(0, "资产不存在", null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        Date now = new Date();
        AssetChangeRecord record = new AssetChangeRecord();
        record.setChangeCode(SnGenerateUtil.generate(model.getChangeType() != null && model.getChangeType().equals("SCRAP") ? "BF" : "BG", assetChangeRecordMapper.selectLatestCode()));
        record.setAssetId(asset.getId());
        record.setAssetCode(asset.getAssetCode());
        record.setAssetName(asset.getAssetName());
        record.setChangeType(StringUtils.hasText(model.getChangeType()) ? model.getChangeType() : "SCRAP");
        record.setOldValue(resolveAssetState(asset.getAssetState()));
        record.setNewValue("待报废");
        record.setChangeReason(model.getChangeReason());
        record.setChangeDate(model.getChangeDate() == null ? now : model.getChangeDate());
        record.setApplicantId(user == null ? null : user.getId());
        record.setApplicantName(user == null ? null : (StringUtils.hasText(user.getRealName()) ? user.getRealName() : user.getUserName()));
        record.setApplyDate(now);
        record.setAuditStatus(1);
        record.setExecuteStatus(0);
        record.setScrapValue(model.getScrapValue());
        record.setRemark(model.getRemark());
        record.setDeleteFlag(0);
        assetChangeRecordMapper.insert(record);
        asset.setAssetState(4);
        asset.setUdate(now);
        assetMapper.updateByPrimaryKeySelective(asset);
        return AjaxResult.res(1, "报废申请已提交", record);
    }

    @PostMapping("/auditChange")
    public AjaxResult<AssetChangeRecord> auditChange(@RequestBody AssetChangeRecord model) {
        if (model.getId() == null || model.getAuditStatus() == null) {
            return AjaxResult.res(0, "参数不完整", null);
        }
        AssetChangeRecord current = assetChangeRecordMapper.selectById(model.getId());
        if (current == null) {
            return AjaxResult.res(0, "记录不存在", null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        Date now = new Date();
        current.setAuditStatus(model.getAuditStatus());
        current.setAuditRemark(model.getAuditRemark());
        current.setAuditorId(user == null ? null : user.getId());
        current.setAuditorName(user == null ? null : (StringUtils.hasText(user.getRealName()) ? user.getRealName() : user.getUserName()));
        current.setAuditDate(now);
        current.setRemark(model.getRemark());
        if (Integer.valueOf(2).equals(model.getAuditStatus())) {
            current.setExecuteStatus(2);
            current.setExecutorName(current.getAuditorName());
            current.setExecuteDate(now);
        }
        assetChangeRecordMapper.updateAudit(current);

        Asset asset = assetMapper.selectByPrimaryKey(current.getAssetId());
        if (asset != null) {
            asset.setUdate(now);
            if (Integer.valueOf(2).equals(model.getAuditStatus())) {
                asset.setAssetState(4);
            } else if (Integer.valueOf(3).equals(model.getAuditStatus())) {
                asset.setAssetState(1);
            }
            assetMapper.updateByPrimaryKeySelective(asset);
        }
        return AjaxResult.res(1, "审核完成", current);
    }

    @PostMapping("/revokeChange")
    public AjaxResult<Void> revokeChange(@RequestParam Integer id, @RequestParam(required = false) String auditRemark) {
        AssetChangeRecord current = assetChangeRecordMapper.selectById(id);
        if (current == null) {
            return AjaxResult.res(0, "记录不存在", null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        Date now = new Date();
        current.setAuditStatus(4);
        current.setAuditRemark(StringUtils.hasText(auditRemark) ? auditRemark : "已撤销");
        current.setAuditorId(user == null ? null : user.getId());
        current.setAuditorName(user == null ? null : (StringUtils.hasText(user.getRealName()) ? user.getRealName() : user.getUserName()));
        current.setAuditDate(now);
        assetChangeRecordMapper.revoke(current);

        Asset asset = assetMapper.selectByPrimaryKey(current.getAssetId());
        if (asset != null) {
            asset.setAssetState(1);
            asset.setUdate(now);
            assetMapper.updateByPrimaryKeySelective(asset);
        }
        return AjaxResult.res(1, "已撤销", null);
    }

    private String resolveAssetState(Integer assetState) {
        if (assetState == null) {
            return "未知";
        }
        if (assetState == 1) {
            return "在用";
        }
        if (assetState == 2) {
            return "闲置";
        }
        if (assetState == 3) {
            return "维修";
        }
        if (assetState == 4) {
            return "待报废";
        }
        return "未知";
    }
}
package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.mapper.AssetMapper;
import com.yunsheng.yzb.mapper.AssetWarningRecordMapper;
import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.model.AssetWarningRecord;
import com.yunsheng.yzb.model.AssetWarningView;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assetWarning")
public class AssetWarningController {

    @Autowired
    private AssetMapper assetMapper;

    @Autowired
    private AssetWarningRecordMapper assetWarningRecordMapper;

    @PostMapping("/page")
    public AjaxResult<Object> page(@RequestBody(required = false) AssetWarningView query) {
        AssetWarningView condition = query == null ? new AssetWarningView() : query;
        List<Asset> assets = assetMapper.selectAsset(null, null, null, null, null, null, null);
        List<AssetWarningView> allWarnings = new ArrayList<>();
        for (Asset asset : assets) {
            allWarnings.addAll(buildWarnings(asset));
        }

        List<AssetWarningView> filtered = allWarnings.stream()
                .filter(item -> !StringUtils.hasText(condition.getAssetCode()) || (item.getAssetCode() != null && item.getAssetCode().contains(condition.getAssetCode())))
                .filter(item -> !StringUtils.hasText(condition.getAssetName()) || (item.getAssetName() != null && item.getAssetName().contains(condition.getAssetName())))
                .filter(item -> !StringUtils.hasText(condition.getWarningType()) || condition.getWarningType().equals(item.getWarningType()))
                .filter(item -> !StringUtils.hasText(condition.getWarningLevel()) || condition.getWarningLevel().equals(item.getWarningLevel()))
                .filter(item -> condition.getStatus() == null || condition.getStatus().equals(item.getStatus()))
                .collect(Collectors.toList());

        int pageNum = condition.getPageNum() == null || condition.getPageNum() <= 0 ? 1 : condition.getPageNum();
        int pageSize = condition.getPageSize() == null || condition.getPageSize() <= 0 ? 10 : condition.getPageSize();
        if (pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize <= 0) {
            pageSize = 10;
        }
        int fromIndex = Math.min((pageNum - 1) * pageSize, filtered.size());
        int toIndex = Math.min(fromIndex + pageSize, filtered.size());
        List<AssetWarningView> records = filtered.subList(fromIndex, toIndex);
        HashMap<String, Object> data = new HashMap<>();
        data.put("records", records);
        data.put("total", filtered.size());
        return AjaxResult.res(1, "成功", data);
    }

    @PostMapping("/updateStatus")
    public AjaxResult<Void> updateStatus(@RequestBody AssetWarningRecord record) {
        if (record.getAssetId() == null || !StringUtils.hasText(record.getWarningType()) || record.getStatus() == null) {
            return AjaxResult.res(0, "参数不完整", null);
        }
        Asset asset = assetMapper.selectByPrimaryKey(record.getAssetId());
        if (asset == null) {
            return AjaxResult.res(0, "资产不存在", null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        record.setAssetCode(asset.getAssetCode());
        record.setAssetName(asset.getAssetName());
        record.setHandlerId(user == null ? null : user.getId());
        record.setHandlerName(user == null ? null : (StringUtils.hasText(user.getRealName()) ? user.getRealName() : user.getUserName()));
        record.setHandleTime(new Date());
        assetWarningRecordMapper.upsert(record);
        return AjaxResult.res(1, "处理状态已更新", null);
    }

    private List<AssetWarningView> buildWarnings(Asset asset) {
        List<AssetWarningView> warnings = new ArrayList<>();
        if (asset == null) {
            return warnings;
        }
        if (asset.getPurchaseDate() != null && StringUtils.hasText(asset.getServiceLife())) {
            Integer years = parseYears(asset.getServiceLife());
            if (years != null && years > 0) {
                LocalDate purchaseDate = asset.getPurchaseDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate dueDate = purchaseDate.plusYears(years.longValue());
                long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), dueDate);
                if (daysLeft <= 365) {
                    warnings.add(buildWarning(asset, "使用年限预警", daysLeft <= 30 ? "high" : (daysLeft <= 90 ? "medium" : "low"), dueDate, (int) daysLeft, "资产使用年限临近到期，建议安排续用评估或报废计划", "评估资产状态并制定处置计划"));
                }
            }
        }
        if (asset.getAssetState() != null && asset.getAssetState() == 2) {
            warnings.add(buildWarning(asset, "资产闲置", "low", LocalDate.now().plusDays(30), 30, "资产当前处于闲置状态，建议尽快重新调配或处置", "确认是否继续使用或转移"));
        }
        if (asset.getAssetState() != null && asset.getAssetState() == 3) {
            warnings.add(buildWarning(asset, "维修跟进", "medium", LocalDate.now().plusDays(7), 7, "资产处于维修状态，请持续跟进维修结果", "联系维修人员确认修复进度"));
        }
        return warnings;
    }

    private AssetWarningView buildWarning(Asset asset, String warningType, String warningLevel, LocalDate dueDate, Integer daysLeft, String description, String actionRequired) {
        AssetWarningRecord record = assetWarningRecordMapper.selectOne(asset.getId(), warningType);
        AssetWarningView view = new AssetWarningView();
        view.setRecordId(record == null ? null : record.getId());
        view.setAssetId(asset.getId());
        view.setAssetCode(asset.getAssetCode());
        view.setAssetName(asset.getAssetName());
        view.setAssetType(asset.getAssetTypename());
        view.setManufacturer(asset.getManufacturer());
        view.setSpecification(asset.getSpeModel());
        view.setDepartment(asset.getDepName());
        view.setResponsiblePerson(asset.getRespPerson());
        view.setWarningType(warningType);
        view.setWarningLevel(record != null && StringUtils.hasText(record.getWarningLevel()) ? record.getWarningLevel() : warningLevel);
        view.setWarningDate(record != null && record.getWarningDate() != null ? record.getWarningDate() : new Date());
        view.setDueDate(record != null && record.getDueDate() != null ? record.getDueDate() : Date.from(dueDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
        view.setDaysLeft(record != null && record.getDaysLeft() != null ? record.getDaysLeft() : daysLeft);
        view.setStatus(record != null && record.getStatus() != null ? record.getStatus() : 1);
        view.setDescription(record != null && StringUtils.hasText(record.getDescription()) ? record.getDescription() : description);
        view.setActionRequired(record != null && StringUtils.hasText(record.getActionRequired()) ? record.getActionRequired() : actionRequired);
        view.setRemark(record == null ? null : record.getRemark());
        view.setPurchaseDate(asset.getPurchaseDate());
        view.setOriginalValue(asset.getOrigValue());
        view.setUsefulLife(asset.getServiceLife());
        return view;
    }

    private Integer parseYears(String serviceLife) {
        String digits = serviceLife.replaceAll("[^0-9]", "");
        if (!StringUtils.hasText(digits)) {
            return null;
        }
        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
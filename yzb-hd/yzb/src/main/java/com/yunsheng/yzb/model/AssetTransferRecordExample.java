package com.yunsheng.yzb.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AssetTransferRecordExample {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public AssetTransferRecordExample() {
        oredCriteria = new ArrayList<Criteria>();
    }

    public void setOrderByClause(String orderByClause) {
        this.orderByClause = orderByClause;
    }

    public String getOrderByClause() {
        return orderByClause;
    }

    public void setDistinct(boolean distinct) {
        this.distinct = distinct;
    }

    public boolean isDistinct() {
        return distinct;
    }

    public List<Criteria> getOredCriteria() {
        return oredCriteria;
    }

    public void or(Criteria criteria) {
        oredCriteria.add(criteria);
    }

    public Criteria or() {
        Criteria criteria = createCriteriaInternal();
        oredCriteria.add(criteria);
        return criteria;
    }

    public Criteria createCriteria() {
        Criteria criteria = createCriteriaInternal();
        if (oredCriteria.size() == 0) {
            oredCriteria.add(criteria);
        }
        return criteria;
    }

    protected Criteria createCriteriaInternal() {
        Criteria criteria = new Criteria();
        return criteria;
    }

    public void clear() {
        oredCriteria.clear();
        orderByClause = null;
        distinct = false;
    }

    protected abstract static class GeneratedCriteria {
        protected List<Criterion> criteria;

        protected GeneratedCriteria() {
            super();
            criteria = new ArrayList<Criterion>();
        }

        public boolean isValid() {
            return criteria.size() > 0;
        }

        public List<Criterion> getAllCriteria() {
            return criteria;
        }

        public List<Criterion> getCriteria() {
            return criteria;
        }

        protected void addCriterion(String condition) {
            if (condition == null) {
                throw new RuntimeException("Value for condition cannot be null");
            }
            criteria.add(new Criterion(condition));
        }

        protected void addCriterion(String condition, Object value, String property) {
            if (value == null) {
                throw new RuntimeException("Value for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value));
        }

        protected void addCriterion(String condition, Object value1, Object value2, String property) {
            if (value1 == null || value2 == null) {
                throw new RuntimeException("Between values for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value1, value2));
        }

        public Criteria andIdIsNull() {
            addCriterion("id is null");
            return (Criteria) this;
        }

        public Criteria andIdIsNotNull() {
            addCriterion("id is not null");
            return (Criteria) this;
        }

        public Criteria andIdEqualTo(Integer value) {
            addCriterion("id =", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdNotEqualTo(Integer value) {
            addCriterion("id <>", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdGreaterThan(Integer value) {
            addCriterion("id >", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("id >=", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdLessThan(Integer value) {
            addCriterion("id <", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdLessThanOrEqualTo(Integer value) {
            addCriterion("id <=", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdIn(List<Integer> values) {
            addCriterion("id in", values, "id");
            return (Criteria) this;
        }

        public Criteria andIdNotIn(List<Integer> values) {
            addCriterion("id not in", values, "id");
            return (Criteria) this;
        }

        public Criteria andIdBetween(Integer value1, Integer value2) {
            addCriterion("id between", value1, value2, "id");
            return (Criteria) this;
        }

        public Criteria andIdNotBetween(Integer value1, Integer value2) {
            addCriterion("id not between", value1, value2, "id");
            return (Criteria) this;
        }

        public Criteria andTransferIdIsNull() {
            addCriterion("transfer_id is null");
            return (Criteria) this;
        }

        public Criteria andTransferIdIsNotNull() {
            addCriterion("transfer_id is not null");
            return (Criteria) this;
        }

        public Criteria andTransferIdEqualTo(Integer value) {
            addCriterion("transfer_id =", value, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdNotEqualTo(Integer value) {
            addCriterion("transfer_id <>", value, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdGreaterThan(Integer value) {
            addCriterion("transfer_id >", value, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("transfer_id >=", value, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdLessThan(Integer value) {
            addCriterion("transfer_id <", value, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdLessThanOrEqualTo(Integer value) {
            addCriterion("transfer_id <=", value, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdIn(List<Integer> values) {
            addCriterion("transfer_id in", values, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdNotIn(List<Integer> values) {
            addCriterion("transfer_id not in", values, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdBetween(Integer value1, Integer value2) {
            addCriterion("transfer_id between", value1, value2, "transferId");
            return (Criteria) this;
        }

        public Criteria andTransferIdNotBetween(Integer value1, Integer value2) {
            addCriterion("transfer_id not between", value1, value2, "transferId");
            return (Criteria) this;
        }

        public Criteria andCdateIsNull() {
            addCriterion("cdate is null");
            return (Criteria) this;
        }

        public Criteria andCdateIsNotNull() {
            addCriterion("cdate is not null");
            return (Criteria) this;
        }

        public Criteria andCdateEqualTo(Date value) {
            addCriterion("cdate =", value, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateNotEqualTo(Date value) {
            addCriterion("cdate <>", value, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateGreaterThan(Date value) {
            addCriterion("cdate >", value, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateGreaterThanOrEqualTo(Date value) {
            addCriterion("cdate >=", value, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateLessThan(Date value) {
            addCriterion("cdate <", value, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateLessThanOrEqualTo(Date value) {
            addCriterion("cdate <=", value, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateIn(List<Date> values) {
            addCriterion("cdate in", values, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateNotIn(List<Date> values) {
            addCriterion("cdate not in", values, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateBetween(Date value1, Date value2) {
            addCriterion("cdate between", value1, value2, "cdate");
            return (Criteria) this;
        }

        public Criteria andCdateNotBetween(Date value1, Date value2) {
            addCriterion("cdate not between", value1, value2, "cdate");
            return (Criteria) this;
        }

        public Criteria andUdateIsNull() {
            addCriterion("udate is null");
            return (Criteria) this;
        }

        public Criteria andUdateIsNotNull() {
            addCriterion("udate is not null");
            return (Criteria) this;
        }

        public Criteria andUdateEqualTo(Date value) {
            addCriterion("udate =", value, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateNotEqualTo(Date value) {
            addCriterion("udate <>", value, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateGreaterThan(Date value) {
            addCriterion("udate >", value, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateGreaterThanOrEqualTo(Date value) {
            addCriterion("udate >=", value, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateLessThan(Date value) {
            addCriterion("udate <", value, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateLessThanOrEqualTo(Date value) {
            addCriterion("udate <=", value, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateIn(List<Date> values) {
            addCriterion("udate in", values, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateNotIn(List<Date> values) {
            addCriterion("udate not in", values, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateBetween(Date value1, Date value2) {
            addCriterion("udate between", value1, value2, "udate");
            return (Criteria) this;
        }

        public Criteria andUdateNotBetween(Date value1, Date value2) {
            addCriterion("udate not between", value1, value2, "udate");
            return (Criteria) this;
        }

        public Criteria andUserIdIsNull() {
            addCriterion("user_id is null");
            return (Criteria) this;
        }

        public Criteria andUserIdIsNotNull() {
            addCriterion("user_id is not null");
            return (Criteria) this;
        }

        public Criteria andUserIdEqualTo(Integer value) {
            addCriterion("user_id =", value, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdNotEqualTo(Integer value) {
            addCriterion("user_id <>", value, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdGreaterThan(Integer value) {
            addCriterion("user_id >", value, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("user_id >=", value, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdLessThan(Integer value) {
            addCriterion("user_id <", value, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdLessThanOrEqualTo(Integer value) {
            addCriterion("user_id <=", value, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdIn(List<Integer> values) {
            addCriterion("user_id in", values, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdNotIn(List<Integer> values) {
            addCriterion("user_id not in", values, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdBetween(Integer value1, Integer value2) {
            addCriterion("user_id between", value1, value2, "userId");
            return (Criteria) this;
        }

        public Criteria andUserIdNotBetween(Integer value1, Integer value2) {
            addCriterion("user_id not between", value1, value2, "userId");
            return (Criteria) this;
        }

        public Criteria andUserNameIsNull() {
            addCriterion("user_name is null");
            return (Criteria) this;
        }

        public Criteria andUserNameIsNotNull() {
            addCriterion("user_name is not null");
            return (Criteria) this;
        }

        public Criteria andUserNameEqualTo(String value) {
            addCriterion("user_name =", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameNotEqualTo(String value) {
            addCriterion("user_name <>", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameGreaterThan(String value) {
            addCriterion("user_name >", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameGreaterThanOrEqualTo(String value) {
            addCriterion("user_name >=", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameLessThan(String value) {
            addCriterion("user_name <", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameLessThanOrEqualTo(String value) {
            addCriterion("user_name <=", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameLike(String value) {
            addCriterion("user_name like", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameNotLike(String value) {
            addCriterion("user_name not like", value, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameIn(List<String> values) {
            addCriterion("user_name in", values, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameNotIn(List<String> values) {
            addCriterion("user_name not in", values, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameBetween(String value1, String value2) {
            addCriterion("user_name between", value1, value2, "userName");
            return (Criteria) this;
        }

        public Criteria andUserNameNotBetween(String value1, String value2) {
            addCriterion("user_name not between", value1, value2, "userName");
            return (Criteria) this;
        }

        public Criteria andAssetStatusIsNull() {
            addCriterion("asset_status is null");
            return (Criteria) this;
        }

        public Criteria andAssetStatusIsNotNull() {
            addCriterion("asset_status is not null");
            return (Criteria) this;
        }

        public Criteria andAssetStatusEqualTo(Integer value) {
            addCriterion("asset_status =", value, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusNotEqualTo(Integer value) {
            addCriterion("asset_status <>", value, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusGreaterThan(Integer value) {
            addCriterion("asset_status >", value, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusGreaterThanOrEqualTo(Integer value) {
            addCriterion("asset_status >=", value, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusLessThan(Integer value) {
            addCriterion("asset_status <", value, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusLessThanOrEqualTo(Integer value) {
            addCriterion("asset_status <=", value, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusIn(List<Integer> values) {
            addCriterion("asset_status in", values, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusNotIn(List<Integer> values) {
            addCriterion("asset_status not in", values, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusBetween(Integer value1, Integer value2) {
            addCriterion("asset_status between", value1, value2, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetStatusNotBetween(Integer value1, Integer value2) {
            addCriterion("asset_status not between", value1, value2, "assetStatus");
            return (Criteria) this;
        }

        public Criteria andAssetPartsIsNull() {
            addCriterion("asset_parts is null");
            return (Criteria) this;
        }

        public Criteria andAssetPartsIsNotNull() {
            addCriterion("asset_parts is not null");
            return (Criteria) this;
        }

        public Criteria andAssetPartsEqualTo(String value) {
            addCriterion("asset_parts =", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsNotEqualTo(String value) {
            addCriterion("asset_parts <>", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsGreaterThan(String value) {
            addCriterion("asset_parts >", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsGreaterThanOrEqualTo(String value) {
            addCriterion("asset_parts >=", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsLessThan(String value) {
            addCriterion("asset_parts <", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsLessThanOrEqualTo(String value) {
            addCriterion("asset_parts <=", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsLike(String value) {
            addCriterion("asset_parts like", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsNotLike(String value) {
            addCriterion("asset_parts not like", value, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsIn(List<String> values) {
            addCriterion("asset_parts in", values, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsNotIn(List<String> values) {
            addCriterion("asset_parts not in", values, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsBetween(String value1, String value2) {
            addCriterion("asset_parts between", value1, value2, "assetParts");
            return (Criteria) this;
        }

        public Criteria andAssetPartsNotBetween(String value1, String value2) {
            addCriterion("asset_parts not between", value1, value2, "assetParts");
            return (Criteria) this;
        }

        public Criteria andRemarkIsNull() {
            addCriterion("remark is null");
            return (Criteria) this;
        }

        public Criteria andRemarkIsNotNull() {
            addCriterion("remark is not null");
            return (Criteria) this;
        }

        public Criteria andRemarkEqualTo(String value) {
            addCriterion("remark =", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkNotEqualTo(String value) {
            addCriterion("remark <>", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkGreaterThan(String value) {
            addCriterion("remark >", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkGreaterThanOrEqualTo(String value) {
            addCriterion("remark >=", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkLessThan(String value) {
            addCriterion("remark <", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkLessThanOrEqualTo(String value) {
            addCriterion("remark <=", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkLike(String value) {
            addCriterion("remark like", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkNotLike(String value) {
            addCriterion("remark not like", value, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkIn(List<String> values) {
            addCriterion("remark in", values, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkNotIn(List<String> values) {
            addCriterion("remark not in", values, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkBetween(String value1, String value2) {
            addCriterion("remark between", value1, value2, "remark");
            return (Criteria) this;
        }

        public Criteria andRemarkNotBetween(String value1, String value2) {
            addCriterion("remark not between", value1, value2, "remark");
            return (Criteria) this;
        }

        public Criteria andStatusIsNull() {
            addCriterion("status is null");
            return (Criteria) this;
        }

        public Criteria andStatusIsNotNull() {
            addCriterion("status is not null");
            return (Criteria) this;
        }

        public Criteria andStatusEqualTo(Integer value) {
            addCriterion("status =", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusNotEqualTo(Integer value) {
            addCriterion("status <>", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusGreaterThan(Integer value) {
            addCriterion("status >", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusGreaterThanOrEqualTo(Integer value) {
            addCriterion("status >=", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusLessThan(Integer value) {
            addCriterion("status <", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusLessThanOrEqualTo(Integer value) {
            addCriterion("status <=", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusIn(List<Integer> values) {
            addCriterion("status in", values, "status");
            return (Criteria) this;
        }

        public Criteria andStatusNotIn(List<Integer> values) {
            addCriterion("status not in", values, "status");
            return (Criteria) this;
        }

        public Criteria andStatusBetween(Integer value1, Integer value2) {
            addCriterion("status between", value1, value2, "status");
            return (Criteria) this;
        }

        public Criteria andStatusNotBetween(Integer value1, Integer value2) {
            addCriterion("status not between", value1, value2, "status");
            return (Criteria) this;
        }

        public Criteria andReasonIsNull() {
            addCriterion("reason is null");
            return (Criteria) this;
        }

        public Criteria andReasonIsNotNull() {
            addCriterion("reason is not null");
            return (Criteria) this;
        }

        public Criteria andReasonEqualTo(String value) {
            addCriterion("reason =", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonNotEqualTo(String value) {
            addCriterion("reason <>", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonGreaterThan(String value) {
            addCriterion("reason >", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonGreaterThanOrEqualTo(String value) {
            addCriterion("reason >=", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonLessThan(String value) {
            addCriterion("reason <", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonLessThanOrEqualTo(String value) {
            addCriterion("reason <=", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonLike(String value) {
            addCriterion("reason like", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonNotLike(String value) {
            addCriterion("reason not like", value, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonIn(List<String> values) {
            addCriterion("reason in", values, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonNotIn(List<String> values) {
            addCriterion("reason not in", values, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonBetween(String value1, String value2) {
            addCriterion("reason between", value1, value2, "reason");
            return (Criteria) this;
        }

        public Criteria andReasonNotBetween(String value1, String value2) {
            addCriterion("reason not between", value1, value2, "reason");
            return (Criteria) this;
        }

        public Criteria andRespPersionIsNull() {
            addCriterion("resp_persion is null");
            return (Criteria) this;
        }

        public Criteria andRespPersionIsNotNull() {
            addCriterion("resp_persion is not null");
            return (Criteria) this;
        }

        public Criteria andRespPersionEqualTo(String value) {
            addCriterion("resp_persion =", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionNotEqualTo(String value) {
            addCriterion("resp_persion <>", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionGreaterThan(String value) {
            addCriterion("resp_persion >", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionGreaterThanOrEqualTo(String value) {
            addCriterion("resp_persion >=", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionLessThan(String value) {
            addCriterion("resp_persion <", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionLessThanOrEqualTo(String value) {
            addCriterion("resp_persion <=", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionLike(String value) {
            addCriterion("resp_persion like", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionNotLike(String value) {
            addCriterion("resp_persion not like", value, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionIn(List<String> values) {
            addCriterion("resp_persion in", values, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionNotIn(List<String> values) {
            addCriterion("resp_persion not in", values, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionBetween(String value1, String value2) {
            addCriterion("resp_persion between", value1, value2, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionNotBetween(String value1, String value2) {
            addCriterion("resp_persion not between", value1, value2, "respPersion");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdIsNull() {
            addCriterion("resp_persion_id is null");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdIsNotNull() {
            addCriterion("resp_persion_id is not null");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdEqualTo(Integer value) {
            addCriterion("resp_persion_id =", value, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdNotEqualTo(Integer value) {
            addCriterion("resp_persion_id <>", value, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdGreaterThan(Integer value) {
            addCriterion("resp_persion_id >", value, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("resp_persion_id >=", value, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdLessThan(Integer value) {
            addCriterion("resp_persion_id <", value, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdLessThanOrEqualTo(Integer value) {
            addCriterion("resp_persion_id <=", value, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdIn(List<Integer> values) {
            addCriterion("resp_persion_id in", values, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdNotIn(List<Integer> values) {
            addCriterion("resp_persion_id not in", values, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdBetween(Integer value1, Integer value2) {
            addCriterion("resp_persion_id between", value1, value2, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andRespPersionIdNotBetween(Integer value1, Integer value2) {
            addCriterion("resp_persion_id not between", value1, value2, "respPersionId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdIsNull() {
            addCriterion("inventory_id is null");
            return (Criteria) this;
        }

        public Criteria andInventoryIdIsNotNull() {
            addCriterion("inventory_id is not null");
            return (Criteria) this;
        }

        public Criteria andInventoryIdEqualTo(Integer value) {
            addCriterion("inventory_id =", value, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdNotEqualTo(Integer value) {
            addCriterion("inventory_id <>", value, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdGreaterThan(Integer value) {
            addCriterion("inventory_id >", value, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("inventory_id >=", value, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdLessThan(Integer value) {
            addCriterion("inventory_id <", value, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdLessThanOrEqualTo(Integer value) {
            addCriterion("inventory_id <=", value, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdIn(List<Integer> values) {
            addCriterion("inventory_id in", values, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdNotIn(List<Integer> values) {
            addCriterion("inventory_id not in", values, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdBetween(Integer value1, Integer value2) {
            addCriterion("inventory_id between", value1, value2, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryIdNotBetween(Integer value1, Integer value2) {
            addCriterion("inventory_id not between", value1, value2, "inventoryId");
            return (Criteria) this;
        }

        public Criteria andInventoryNameIsNull() {
            addCriterion("inventory_name is null");
            return (Criteria) this;
        }

        public Criteria andInventoryNameIsNotNull() {
            addCriterion("inventory_name is not null");
            return (Criteria) this;
        }

        public Criteria andInventoryNameEqualTo(String value) {
            addCriterion("inventory_name =", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameNotEqualTo(String value) {
            addCriterion("inventory_name <>", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameGreaterThan(String value) {
            addCriterion("inventory_name >", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameGreaterThanOrEqualTo(String value) {
            addCriterion("inventory_name >=", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameLessThan(String value) {
            addCriterion("inventory_name <", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameLessThanOrEqualTo(String value) {
            addCriterion("inventory_name <=", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameLike(String value) {
            addCriterion("inventory_name like", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameNotLike(String value) {
            addCriterion("inventory_name not like", value, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameIn(List<String> values) {
            addCriterion("inventory_name in", values, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameNotIn(List<String> values) {
            addCriterion("inventory_name not in", values, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameBetween(String value1, String value2) {
            addCriterion("inventory_name between", value1, value2, "inventoryName");
            return (Criteria) this;
        }

        public Criteria andInventoryNameNotBetween(String value1, String value2) {
            addCriterion("inventory_name not between", value1, value2, "inventoryName");
            return (Criteria) this;
        }
    }

    public static class Criteria extends GeneratedCriteria {

        protected Criteria() {
            super();
        }
    }

    public static class Criterion {
        private String condition;

        private Object value;

        private Object secondValue;

        private boolean noValue;

        private boolean singleValue;

        private boolean betweenValue;

        private boolean listValue;

        private String typeHandler;

        public String getCondition() {
            return condition;
        }

        public Object getValue() {
            return value;
        }

        public Object getSecondValue() {
            return secondValue;
        }

        public boolean isNoValue() {
            return noValue;
        }

        public boolean isSingleValue() {
            return singleValue;
        }

        public boolean isBetweenValue() {
            return betweenValue;
        }

        public boolean isListValue() {
            return listValue;
        }

        public String getTypeHandler() {
            return typeHandler;
        }

        protected Criterion(String condition) {
            super();
            this.condition = condition;
            this.typeHandler = null;
            this.noValue = true;
        }

        protected Criterion(String condition, Object value, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.typeHandler = typeHandler;
            if (value instanceof List<?>) {
                this.listValue = true;
            } else {
                this.singleValue = true;
            }
        }

        protected Criterion(String condition, Object value) {
            this(condition, value, null);
        }

        protected Criterion(String condition, Object value, Object secondValue, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.secondValue = secondValue;
            this.typeHandler = typeHandler;
            this.betweenValue = true;
        }

        protected Criterion(String condition, Object value, Object secondValue) {
            this(condition, value, secondValue, null);
        }
    }
}
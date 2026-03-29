package com.yunsheng.yzb.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AssetTransferExample {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public AssetTransferExample() {
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

        public Criteria andAssetIdIsNull() {
            addCriterion("asset_id is null");
            return (Criteria) this;
        }

        public Criteria andAssetIdIsNotNull() {
            addCriterion("asset_id is not null");
            return (Criteria) this;
        }

        public Criteria andAssetIdEqualTo(Integer value) {
            addCriterion("asset_id =", value, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdNotEqualTo(Integer value) {
            addCriterion("asset_id <>", value, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdGreaterThan(Integer value) {
            addCriterion("asset_id >", value, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("asset_id >=", value, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdLessThan(Integer value) {
            addCriterion("asset_id <", value, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdLessThanOrEqualTo(Integer value) {
            addCriterion("asset_id <=", value, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdIn(List<Integer> values) {
            addCriterion("asset_id in", values, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdNotIn(List<Integer> values) {
            addCriterion("asset_id not in", values, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdBetween(Integer value1, Integer value2) {
            addCriterion("asset_id between", value1, value2, "assetId");
            return (Criteria) this;
        }

        public Criteria andAssetIdNotBetween(Integer value1, Integer value2) {
            addCriterion("asset_id not between", value1, value2, "assetId");
            return (Criteria) this;
        }

        public Criteria andDepIdIsNull() {
            addCriterion("dep_id is null");
            return (Criteria) this;
        }

        public Criteria andDepIdIsNotNull() {
            addCriterion("dep_id is not null");
            return (Criteria) this;
        }

        public Criteria andDepIdEqualTo(Integer value) {
            addCriterion("dep_id =", value, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdNotEqualTo(Integer value) {
            addCriterion("dep_id <>", value, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdGreaterThan(Integer value) {
            addCriterion("dep_id >", value, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("dep_id >=", value, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdLessThan(Integer value) {
            addCriterion("dep_id <", value, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdLessThanOrEqualTo(Integer value) {
            addCriterion("dep_id <=", value, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdIn(List<Integer> values) {
            addCriterion("dep_id in", values, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdNotIn(List<Integer> values) {
            addCriterion("dep_id not in", values, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdBetween(Integer value1, Integer value2) {
            addCriterion("dep_id between", value1, value2, "depId");
            return (Criteria) this;
        }

        public Criteria andDepIdNotBetween(Integer value1, Integer value2) {
            addCriterion("dep_id not between", value1, value2, "depId");
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

        public Criteria andTransferCodeIsNull() {
            addCriterion("transfer_code is null");
            return (Criteria) this;
        }

        public Criteria andTransferCodeIsNotNull() {
            addCriterion("transfer_code is not null");
            return (Criteria) this;
        }

        public Criteria andTransferCodeEqualTo(String value) {
            addCriterion("transfer_code =", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeNotEqualTo(String value) {
            addCriterion("transfer_code <>", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeGreaterThan(String value) {
            addCriterion("transfer_code >", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeGreaterThanOrEqualTo(String value) {
            addCriterion("transfer_code >=", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeLessThan(String value) {
            addCriterion("transfer_code <", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeLessThanOrEqualTo(String value) {
            addCriterion("transfer_code <=", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeLike(String value) {
            addCriterion("transfer_code like", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeNotLike(String value) {
            addCriterion("transfer_code not like", value, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeIn(List<String> values) {
            addCriterion("transfer_code in", values, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeNotIn(List<String> values) {
            addCriterion("transfer_code not in", values, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeBetween(String value1, String value2) {
            addCriterion("transfer_code between", value1, value2, "transferCode");
            return (Criteria) this;
        }

        public Criteria andTransferCodeNotBetween(String value1, String value2) {
            addCriterion("transfer_code not between", value1, value2, "transferCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeIsNull() {
            addCriterion("asset_code is null");
            return (Criteria) this;
        }

        public Criteria andAssetCodeIsNotNull() {
            addCriterion("asset_code is not null");
            return (Criteria) this;
        }

        public Criteria andAssetCodeEqualTo(String value) {
            addCriterion("asset_code =", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeNotEqualTo(String value) {
            addCriterion("asset_code <>", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeGreaterThan(String value) {
            addCriterion("asset_code >", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeGreaterThanOrEqualTo(String value) {
            addCriterion("asset_code >=", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeLessThan(String value) {
            addCriterion("asset_code <", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeLessThanOrEqualTo(String value) {
            addCriterion("asset_code <=", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeLike(String value) {
            addCriterion("asset_code like", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeNotLike(String value) {
            addCriterion("asset_code not like", value, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeIn(List<String> values) {
            addCriterion("asset_code in", values, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeNotIn(List<String> values) {
            addCriterion("asset_code not in", values, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeBetween(String value1, String value2) {
            addCriterion("asset_code between", value1, value2, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetCodeNotBetween(String value1, String value2) {
            addCriterion("asset_code not between", value1, value2, "assetCode");
            return (Criteria) this;
        }

        public Criteria andAssetNameIsNull() {
            addCriterion("asset_name is null");
            return (Criteria) this;
        }

        public Criteria andAssetNameIsNotNull() {
            addCriterion("asset_name is not null");
            return (Criteria) this;
        }

        public Criteria andAssetNameEqualTo(String value) {
            addCriterion("asset_name =", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameNotEqualTo(String value) {
            addCriterion("asset_name <>", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameGreaterThan(String value) {
            addCriterion("asset_name >", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameGreaterThanOrEqualTo(String value) {
            addCriterion("asset_name >=", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameLessThan(String value) {
            addCriterion("asset_name <", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameLessThanOrEqualTo(String value) {
            addCriterion("asset_name <=", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameLike(String value) {
            addCriterion("asset_name like", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameNotLike(String value) {
            addCriterion("asset_name not like", value, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameIn(List<String> values) {
            addCriterion("asset_name in", values, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameNotIn(List<String> values) {
            addCriterion("asset_name not in", values, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameBetween(String value1, String value2) {
            addCriterion("asset_name between", value1, value2, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetNameNotBetween(String value1, String value2) {
            addCriterion("asset_name not between", value1, value2, "assetName");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidIsNull() {
            addCriterion("asset_typeid is null");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidIsNotNull() {
            addCriterion("asset_typeid is not null");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidEqualTo(Integer value) {
            addCriterion("asset_typeid =", value, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidNotEqualTo(Integer value) {
            addCriterion("asset_typeid <>", value, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidGreaterThan(Integer value) {
            addCriterion("asset_typeid >", value, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidGreaterThanOrEqualTo(Integer value) {
            addCriterion("asset_typeid >=", value, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidLessThan(Integer value) {
            addCriterion("asset_typeid <", value, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidLessThanOrEqualTo(Integer value) {
            addCriterion("asset_typeid <=", value, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidIn(List<Integer> values) {
            addCriterion("asset_typeid in", values, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidNotIn(List<Integer> values) {
            addCriterion("asset_typeid not in", values, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidBetween(Integer value1, Integer value2) {
            addCriterion("asset_typeid between", value1, value2, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypeidNotBetween(Integer value1, Integer value2) {
            addCriterion("asset_typeid not between", value1, value2, "assetTypeid");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameIsNull() {
            addCriterion("asset_typename is null");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameIsNotNull() {
            addCriterion("asset_typename is not null");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameEqualTo(String value) {
            addCriterion("asset_typename =", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameNotEqualTo(String value) {
            addCriterion("asset_typename <>", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameGreaterThan(String value) {
            addCriterion("asset_typename >", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameGreaterThanOrEqualTo(String value) {
            addCriterion("asset_typename >=", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameLessThan(String value) {
            addCriterion("asset_typename <", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameLessThanOrEqualTo(String value) {
            addCriterion("asset_typename <=", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameLike(String value) {
            addCriterion("asset_typename like", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameNotLike(String value) {
            addCriterion("asset_typename not like", value, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameIn(List<String> values) {
            addCriterion("asset_typename in", values, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameNotIn(List<String> values) {
            addCriterion("asset_typename not in", values, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameBetween(String value1, String value2) {
            addCriterion("asset_typename between", value1, value2, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andAssetTypenameNotBetween(String value1, String value2) {
            addCriterion("asset_typename not between", value1, value2, "assetTypename");
            return (Criteria) this;
        }

        public Criteria andSpeModelIsNull() {
            addCriterion("spe_model is null");
            return (Criteria) this;
        }

        public Criteria andSpeModelIsNotNull() {
            addCriterion("spe_model is not null");
            return (Criteria) this;
        }

        public Criteria andSpeModelEqualTo(String value) {
            addCriterion("spe_model =", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelNotEqualTo(String value) {
            addCriterion("spe_model <>", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelGreaterThan(String value) {
            addCriterion("spe_model >", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelGreaterThanOrEqualTo(String value) {
            addCriterion("spe_model >=", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelLessThan(String value) {
            addCriterion("spe_model <", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelLessThanOrEqualTo(String value) {
            addCriterion("spe_model <=", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelLike(String value) {
            addCriterion("spe_model like", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelNotLike(String value) {
            addCriterion("spe_model not like", value, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelIn(List<String> values) {
            addCriterion("spe_model in", values, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelNotIn(List<String> values) {
            addCriterion("spe_model not in", values, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelBetween(String value1, String value2) {
            addCriterion("spe_model between", value1, value2, "speModel");
            return (Criteria) this;
        }

        public Criteria andSpeModelNotBetween(String value1, String value2) {
            addCriterion("spe_model not between", value1, value2, "speModel");
            return (Criteria) this;
        }

        public Criteria andOrigValueIsNull() {
            addCriterion("orig_value is null");
            return (Criteria) this;
        }

        public Criteria andOrigValueIsNotNull() {
            addCriterion("orig_value is not null");
            return (Criteria) this;
        }

        public Criteria andOrigValueEqualTo(String value) {
            addCriterion("orig_value =", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueNotEqualTo(String value) {
            addCriterion("orig_value <>", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueGreaterThan(String value) {
            addCriterion("orig_value >", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueGreaterThanOrEqualTo(String value) {
            addCriterion("orig_value >=", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueLessThan(String value) {
            addCriterion("orig_value <", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueLessThanOrEqualTo(String value) {
            addCriterion("orig_value <=", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueLike(String value) {
            addCriterion("orig_value like", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueNotLike(String value) {
            addCriterion("orig_value not like", value, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueIn(List<String> values) {
            addCriterion("orig_value in", values, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueNotIn(List<String> values) {
            addCriterion("orig_value not in", values, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueBetween(String value1, String value2) {
            addCriterion("orig_value between", value1, value2, "origValue");
            return (Criteria) this;
        }

        public Criteria andOrigValueNotBetween(String value1, String value2) {
            addCriterion("orig_value not between", value1, value2, "origValue");
            return (Criteria) this;
        }

        public Criteria andBedepIdIsNull() {
            addCriterion("bedep_id is null");
            return (Criteria) this;
        }

        public Criteria andBedepIdIsNotNull() {
            addCriterion("bedep_id is not null");
            return (Criteria) this;
        }

        public Criteria andBedepIdEqualTo(Integer value) {
            addCriterion("bedep_id =", value, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdNotEqualTo(Integer value) {
            addCriterion("bedep_id <>", value, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdGreaterThan(Integer value) {
            addCriterion("bedep_id >", value, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("bedep_id >=", value, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdLessThan(Integer value) {
            addCriterion("bedep_id <", value, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdLessThanOrEqualTo(Integer value) {
            addCriterion("bedep_id <=", value, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdIn(List<Integer> values) {
            addCriterion("bedep_id in", values, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdNotIn(List<Integer> values) {
            addCriterion("bedep_id not in", values, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdBetween(Integer value1, Integer value2) {
            addCriterion("bedep_id between", value1, value2, "bedepId");
            return (Criteria) this;
        }

        public Criteria andBedepIdNotBetween(Integer value1, Integer value2) {
            addCriterion("bedep_id not between", value1, value2, "bedepId");
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

        public Criteria andDepNameIsNull() {
            addCriterion("dep_name is null");
            return (Criteria) this;
        }

        public Criteria andDepNameIsNotNull() {
            addCriterion("dep_name is not null");
            return (Criteria) this;
        }

        public Criteria andDepNameEqualTo(String value) {
            addCriterion("dep_name =", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameNotEqualTo(String value) {
            addCriterion("dep_name <>", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameGreaterThan(String value) {
            addCriterion("dep_name >", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameGreaterThanOrEqualTo(String value) {
            addCriterion("dep_name >=", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameLessThan(String value) {
            addCriterion("dep_name <", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameLessThanOrEqualTo(String value) {
            addCriterion("dep_name <=", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameLike(String value) {
            addCriterion("dep_name like", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameNotLike(String value) {
            addCriterion("dep_name not like", value, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameIn(List<String> values) {
            addCriterion("dep_name in", values, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameNotIn(List<String> values) {
            addCriterion("dep_name not in", values, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameBetween(String value1, String value2) {
            addCriterion("dep_name between", value1, value2, "depName");
            return (Criteria) this;
        }

        public Criteria andDepNameNotBetween(String value1, String value2) {
            addCriterion("dep_name not between", value1, value2, "depName");
            return (Criteria) this;
        }

        public Criteria andBedepNameIsNull() {
            addCriterion("bedep_name is null");
            return (Criteria) this;
        }

        public Criteria andBedepNameIsNotNull() {
            addCriterion("bedep_name is not null");
            return (Criteria) this;
        }

        public Criteria andBedepNameEqualTo(String value) {
            addCriterion("bedep_name =", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameNotEqualTo(String value) {
            addCriterion("bedep_name <>", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameGreaterThan(String value) {
            addCriterion("bedep_name >", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameGreaterThanOrEqualTo(String value) {
            addCriterion("bedep_name >=", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameLessThan(String value) {
            addCriterion("bedep_name <", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameLessThanOrEqualTo(String value) {
            addCriterion("bedep_name <=", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameLike(String value) {
            addCriterion("bedep_name like", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameNotLike(String value) {
            addCriterion("bedep_name not like", value, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameIn(List<String> values) {
            addCriterion("bedep_name in", values, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameNotIn(List<String> values) {
            addCriterion("bedep_name not in", values, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameBetween(String value1, String value2) {
            addCriterion("bedep_name between", value1, value2, "bedepName");
            return (Criteria) this;
        }

        public Criteria andBedepNameNotBetween(String value1, String value2) {
            addCriterion("bedep_name not between", value1, value2, "bedepName");
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
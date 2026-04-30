package com.yunsheng.yzb.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AssetExample {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public AssetExample() {
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

        public Criteria andManufacturerIsNull() {
            addCriterion("manufacturer is null");
            return (Criteria) this;
        }

        public Criteria andManufacturerIsNotNull() {
            addCriterion("manufacturer is not null");
            return (Criteria) this;
        }

        public Criteria andManufacturerEqualTo(String value) {
            addCriterion("manufacturer =", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerNotEqualTo(String value) {
            addCriterion("manufacturer <>", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerGreaterThan(String value) {
            addCriterion("manufacturer >", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerGreaterThanOrEqualTo(String value) {
            addCriterion("manufacturer >=", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerLessThan(String value) {
            addCriterion("manufacturer <", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerLessThanOrEqualTo(String value) {
            addCriterion("manufacturer <=", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerLike(String value) {
            addCriterion("manufacturer like", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerNotLike(String value) {
            addCriterion("manufacturer not like", value, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerIn(List<String> values) {
            addCriterion("manufacturer in", values, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerNotIn(List<String> values) {
            addCriterion("manufacturer not in", values, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerBetween(String value1, String value2) {
            addCriterion("manufacturer between", value1, value2, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andManufacturerNotBetween(String value1, String value2) {
            addCriterion("manufacturer not between", value1, value2, "manufacturer");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateIsNull() {
            addCriterion("purchase_date is null");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateIsNotNull() {
            addCriterion("purchase_date is not null");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateEqualTo(Date value) {
            addCriterion("purchase_date =", value, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateNotEqualTo(Date value) {
            addCriterion("purchase_date <>", value, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateGreaterThan(Date value) {
            addCriterion("purchase_date >", value, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateGreaterThanOrEqualTo(Date value) {
            addCriterion("purchase_date >=", value, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateLessThan(Date value) {
            addCriterion("purchase_date <", value, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateLessThanOrEqualTo(Date value) {
            addCriterion("purchase_date <=", value, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateIn(List<Date> values) {
            addCriterion("purchase_date in", values, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateNotIn(List<Date> values) {
            addCriterion("purchase_date not in", values, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateBetween(Date value1, Date value2) {
            addCriterion("purchase_date between", value1, value2, "purchaseDate");
            return (Criteria) this;
        }

        public Criteria andPurchaseDateNotBetween(Date value1, Date value2) {
            addCriterion("purchase_date not between", value1, value2, "purchaseDate");
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

        public Criteria andServiceLifeIsNull() {
            addCriterion("service_life is null");
            return (Criteria) this;
        }

        public Criteria andServiceLifeIsNotNull() {
            addCriterion("service_life is not null");
            return (Criteria) this;
        }

        public Criteria andServiceLifeEqualTo(String value) {
            addCriterion("service_life =", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeNotEqualTo(String value) {
            addCriterion("service_life <>", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeGreaterThan(String value) {
            addCriterion("service_life >", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeGreaterThanOrEqualTo(String value) {
            addCriterion("service_life >=", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeLessThan(String value) {
            addCriterion("service_life <", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeLessThanOrEqualTo(String value) {
            addCriterion("service_life <=", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeLike(String value) {
            addCriterion("service_life like", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeNotLike(String value) {
            addCriterion("service_life not like", value, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeIn(List<String> values) {
            addCriterion("service_life in", values, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeNotIn(List<String> values) {
            addCriterion("service_life not in", values, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeBetween(String value1, String value2) {
            addCriterion("service_life between", value1, value2, "serviceLife");
            return (Criteria) this;
        }

        public Criteria andServiceLifeNotBetween(String value1, String value2) {
            addCriterion("service_life not between", value1, value2, "serviceLife");
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

        public Criteria andStoLocationIsNull() {
            addCriterion("sto_location is null");
            return (Criteria) this;
        }

        public Criteria andStoLocationIsNotNull() {
            addCriterion("sto_location is not null");
            return (Criteria) this;
        }

        public Criteria andStoLocationEqualTo(String value) {
            addCriterion("sto_location =", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationNotEqualTo(String value) {
            addCriterion("sto_location <>", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationGreaterThan(String value) {
            addCriterion("sto_location >", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationGreaterThanOrEqualTo(String value) {
            addCriterion("sto_location >=", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationLessThan(String value) {
            addCriterion("sto_location <", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationLessThanOrEqualTo(String value) {
            addCriterion("sto_location <=", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationLike(String value) {
            addCriterion("sto_location like", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationNotLike(String value) {
            addCriterion("sto_location not like", value, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationIn(List<String> values) {
            addCriterion("sto_location in", values, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationNotIn(List<String> values) {
            addCriterion("sto_location not in", values, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationBetween(String value1, String value2) {
            addCriterion("sto_location between", value1, value2, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andStoLocationNotBetween(String value1, String value2) {
            addCriterion("sto_location not between", value1, value2, "stoLocation");
            return (Criteria) this;
        }

        public Criteria andRespPersonIsNull() {
            addCriterion("resp_person is null");
            return (Criteria) this;
        }

        public Criteria andRespPersonIsNotNull() {
            addCriterion("resp_person is not null");
            return (Criteria) this;
        }

        public Criteria andRespPersonEqualTo(String value) {
            addCriterion("resp_person =", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonNotEqualTo(String value) {
            addCriterion("resp_person <>", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonGreaterThan(String value) {
            addCriterion("resp_person >", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonGreaterThanOrEqualTo(String value) {
            addCriterion("resp_person >=", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonLessThan(String value) {
            addCriterion("resp_person <", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonLessThanOrEqualTo(String value) {
            addCriterion("resp_person <=", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonLike(String value) {
            addCriterion("resp_person like", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonNotLike(String value) {
            addCriterion("resp_person not like", value, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonIn(List<String> values) {
            addCriterion("resp_person in", values, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonNotIn(List<String> values) {
            addCriterion("resp_person not in", values, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonBetween(String value1, String value2) {
            addCriterion("resp_person between", value1, value2, "respPerson");
            return (Criteria) this;
        }

        public Criteria andRespPersonNotBetween(String value1, String value2) {
            addCriterion("resp_person not between", value1, value2, "respPerson");
            return (Criteria) this;
        }

        public Criteria andAssetStateIsNull() {
            addCriterion("asset_state is null");
            return (Criteria) this;
        }

        public Criteria andAssetStateIsNotNull() {
            addCriterion("asset_state is not null");
            return (Criteria) this;
        }

        public Criteria andAssetStateEqualTo(Integer value) {
            addCriterion("asset_state =", value, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateNotEqualTo(Integer value) {
            addCriterion("asset_state <>", value, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateGreaterThan(Integer value) {
            addCriterion("asset_state >", value, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateGreaterThanOrEqualTo(Integer value) {
            addCriterion("asset_state >=", value, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateLessThan(Integer value) {
            addCriterion("asset_state <", value, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateLessThanOrEqualTo(Integer value) {
            addCriterion("asset_state <=", value, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateIn(List<Integer> values) {
            addCriterion("asset_state in", values, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateNotIn(List<Integer> values) {
            addCriterion("asset_state not in", values, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateBetween(Integer value1, Integer value2) {
            addCriterion("asset_state between", value1, value2, "assetState");
            return (Criteria) this;
        }

        public Criteria andAssetStateNotBetween(Integer value1, Integer value2) {
            addCriterion("asset_state not between", value1, value2, "assetState");
            return (Criteria) this;
        }

        public Criteria andDeprMethodIsNull() {
            addCriterion("depr_method is null");
            return (Criteria) this;
        }

        public Criteria andDeprMethodIsNotNull() {
            addCriterion("depr_method is not null");
            return (Criteria) this;
        }

        public Criteria andDeprMethodEqualTo(Integer value) {
            addCriterion("depr_method =", value, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodNotEqualTo(Integer value) {
            addCriterion("depr_method <>", value, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodGreaterThan(Integer value) {
            addCriterion("depr_method >", value, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodGreaterThanOrEqualTo(Integer value) {
            addCriterion("depr_method >=", value, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodLessThan(Integer value) {
            addCriterion("depr_method <", value, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodLessThanOrEqualTo(Integer value) {
            addCriterion("depr_method <=", value, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodIn(List<Integer> values) {
            addCriterion("depr_method in", values, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodNotIn(List<Integer> values) {
            addCriterion("depr_method not in", values, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodBetween(Integer value1, Integer value2) {
            addCriterion("depr_method between", value1, value2, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andDeprMethodNotBetween(Integer value1, Integer value2) {
            addCriterion("depr_method not between", value1, value2, "deprMethod");
            return (Criteria) this;
        }

        public Criteria andSerialNumIsNull() {
            addCriterion("serial_num is null");
            return (Criteria) this;
        }

        public Criteria andSerialNumIsNotNull() {
            addCriterion("serial_num is not null");
            return (Criteria) this;
        }

        public Criteria andSerialNumEqualTo(String value) {
            addCriterion("serial_num =", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumNotEqualTo(String value) {
            addCriterion("serial_num <>", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumGreaterThan(String value) {
            addCriterion("serial_num >", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumGreaterThanOrEqualTo(String value) {
            addCriterion("serial_num >=", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumLessThan(String value) {
            addCriterion("serial_num <", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumLessThanOrEqualTo(String value) {
            addCriterion("serial_num <=", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumLike(String value) {
            addCriterion("serial_num like", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumNotLike(String value) {
            addCriterion("serial_num not like", value, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumIn(List<String> values) {
            addCriterion("serial_num in", values, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumNotIn(List<String> values) {
            addCriterion("serial_num not in", values, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumBetween(String value1, String value2) {
            addCriterion("serial_num between", value1, value2, "serialNum");
            return (Criteria) this;
        }

        public Criteria andSerialNumNotBetween(String value1, String value2) {
            addCriterion("serial_num not between", value1, value2, "serialNum");
            return (Criteria) this;
        }

        public Criteria andAssetDescIsNull() {
            addCriterion("asset_desc is null");
            return (Criteria) this;
        }

        public Criteria andAssetDescIsNotNull() {
            addCriterion("asset_desc is not null");
            return (Criteria) this;
        }

        public Criteria andAssetDescEqualTo(String value) {
            addCriterion("asset_desc =", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescNotEqualTo(String value) {
            addCriterion("asset_desc <>", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescGreaterThan(String value) {
            addCriterion("asset_desc >", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescGreaterThanOrEqualTo(String value) {
            addCriterion("asset_desc >=", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescLessThan(String value) {
            addCriterion("asset_desc <", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescLessThanOrEqualTo(String value) {
            addCriterion("asset_desc <=", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescLike(String value) {
            addCriterion("asset_desc like", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescNotLike(String value) {
            addCriterion("asset_desc not like", value, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescIn(List<String> values) {
            addCriterion("asset_desc in", values, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescNotIn(List<String> values) {
            addCriterion("asset_desc not in", values, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescBetween(String value1, String value2) {
            addCriterion("asset_desc between", value1, value2, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAssetDescNotBetween(String value1, String value2) {
            addCriterion("asset_desc not between", value1, value2, "assetDesc");
            return (Criteria) this;
        }

        public Criteria andAttachmentIsNull() {
            addCriterion("attachment is null");
            return (Criteria) this;
        }

        public Criteria andAttachmentIsNotNull() {
            addCriterion("attachment is not null");
            return (Criteria) this;
        }

        public Criteria andAttachmentEqualTo(String value) {
            addCriterion("attachment =", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentNotEqualTo(String value) {
            addCriterion("attachment <>", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentGreaterThan(String value) {
            addCriterion("attachment >", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentGreaterThanOrEqualTo(String value) {
            addCriterion("attachment >=", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentLessThan(String value) {
            addCriterion("attachment <", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentLessThanOrEqualTo(String value) {
            addCriterion("attachment <=", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentLike(String value) {
            addCriterion("attachment like", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentNotLike(String value) {
            addCriterion("attachment not like", value, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentIn(List<String> values) {
            addCriterion("attachment in", values, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentNotIn(List<String> values) {
            addCriterion("attachment not in", values, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentBetween(String value1, String value2) {
            addCriterion("attachment between", value1, value2, "attachment");
            return (Criteria) this;
        }

        public Criteria andAttachmentNotBetween(String value1, String value2) {
            addCriterion("attachment not between", value1, value2, "attachment");
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
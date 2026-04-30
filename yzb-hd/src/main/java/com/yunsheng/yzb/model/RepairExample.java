package com.yunsheng.yzb.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RepairExample {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public RepairExample() {
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

        public Criteria andRepairCodeIsNull() {
            addCriterion("repair_code is null");
            return (Criteria) this;
        }

        public Criteria andRepairCodeIsNotNull() {
            addCriterion("repair_code is not null");
            return (Criteria) this;
        }

        public Criteria andRepairCodeEqualTo(String value) {
            addCriterion("repair_code =", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeNotEqualTo(String value) {
            addCriterion("repair_code <>", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeGreaterThan(String value) {
            addCriterion("repair_code >", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeGreaterThanOrEqualTo(String value) {
            addCriterion("repair_code >=", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeLessThan(String value) {
            addCriterion("repair_code <", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeLessThanOrEqualTo(String value) {
            addCriterion("repair_code <=", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeLike(String value) {
            addCriterion("repair_code like", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeNotLike(String value) {
            addCriterion("repair_code not like", value, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeIn(List<String> values) {
            addCriterion("repair_code in", values, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeNotIn(List<String> values) {
            addCriterion("repair_code not in", values, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeBetween(String value1, String value2) {
            addCriterion("repair_code between", value1, value2, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairCodeNotBetween(String value1, String value2) {
            addCriterion("repair_code not between", value1, value2, "repairCode");
            return (Criteria) this;
        }

        public Criteria andRepairDateIsNull() {
            addCriterion("repair_date is null");
            return (Criteria) this;
        }

        public Criteria andRepairDateIsNotNull() {
            addCriterion("repair_date is not null");
            return (Criteria) this;
        }

        public Criteria andRepairDateEqualTo(Date value) {
            addCriterion("repair_date =", value, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateNotEqualTo(Date value) {
            addCriterion("repair_date <>", value, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateGreaterThan(Date value) {
            addCriterion("repair_date >", value, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateGreaterThanOrEqualTo(Date value) {
            addCriterion("repair_date >=", value, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateLessThan(Date value) {
            addCriterion("repair_date <", value, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateLessThanOrEqualTo(Date value) {
            addCriterion("repair_date <=", value, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateIn(List<Date> values) {
            addCriterion("repair_date in", values, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateNotIn(List<Date> values) {
            addCriterion("repair_date not in", values, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateBetween(Date value1, Date value2) {
            addCriterion("repair_date between", value1, value2, "repairDate");
            return (Criteria) this;
        }

        public Criteria andRepairDateNotBetween(Date value1, Date value2) {
            addCriterion("repair_date not between", value1, value2, "repairDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateIsNull() {
            addCriterion("finish_date is null");
            return (Criteria) this;
        }

        public Criteria andFinishDateIsNotNull() {
            addCriterion("finish_date is not null");
            return (Criteria) this;
        }

        public Criteria andFinishDateEqualTo(Date value) {
            addCriterion("finish_date =", value, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateNotEqualTo(Date value) {
            addCriterion("finish_date <>", value, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateGreaterThan(Date value) {
            addCriterion("finish_date >", value, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateGreaterThanOrEqualTo(Date value) {
            addCriterion("finish_date >=", value, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateLessThan(Date value) {
            addCriterion("finish_date <", value, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateLessThanOrEqualTo(Date value) {
            addCriterion("finish_date <=", value, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateIn(List<Date> values) {
            addCriterion("finish_date in", values, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateNotIn(List<Date> values) {
            addCriterion("finish_date not in", values, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateBetween(Date value1, Date value2) {
            addCriterion("finish_date between", value1, value2, "finishDate");
            return (Criteria) this;
        }

        public Criteria andFinishDateNotBetween(Date value1, Date value2) {
            addCriterion("finish_date not between", value1, value2, "finishDate");
            return (Criteria) this;
        }

        public Criteria andRepairTypeIsNull() {
            addCriterion("repair_type is null");
            return (Criteria) this;
        }

        public Criteria andRepairTypeIsNotNull() {
            addCriterion("repair_type is not null");
            return (Criteria) this;
        }

        public Criteria andRepairTypeEqualTo(Integer value) {
            addCriterion("repair_type =", value, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeNotEqualTo(Integer value) {
            addCriterion("repair_type <>", value, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeGreaterThan(Integer value) {
            addCriterion("repair_type >", value, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeGreaterThanOrEqualTo(Integer value) {
            addCriterion("repair_type >=", value, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeLessThan(Integer value) {
            addCriterion("repair_type <", value, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeLessThanOrEqualTo(Integer value) {
            addCriterion("repair_type <=", value, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeIn(List<Integer> values) {
            addCriterion("repair_type in", values, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeNotIn(List<Integer> values) {
            addCriterion("repair_type not in", values, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeBetween(Integer value1, Integer value2) {
            addCriterion("repair_type between", value1, value2, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairTypeNotBetween(Integer value1, Integer value2) {
            addCriterion("repair_type not between", value1, value2, "repairType");
            return (Criteria) this;
        }

        public Criteria andRepairReasonIsNull() {
            addCriterion("repair_reason is null");
            return (Criteria) this;
        }

        public Criteria andRepairReasonIsNotNull() {
            addCriterion("repair_reason is not null");
            return (Criteria) this;
        }

        public Criteria andRepairReasonEqualTo(String value) {
            addCriterion("repair_reason =", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonNotEqualTo(String value) {
            addCriterion("repair_reason <>", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonGreaterThan(String value) {
            addCriterion("repair_reason >", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonGreaterThanOrEqualTo(String value) {
            addCriterion("repair_reason >=", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonLessThan(String value) {
            addCriterion("repair_reason <", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonLessThanOrEqualTo(String value) {
            addCriterion("repair_reason <=", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonLike(String value) {
            addCriterion("repair_reason like", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonNotLike(String value) {
            addCriterion("repair_reason not like", value, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonIn(List<String> values) {
            addCriterion("repair_reason in", values, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonNotIn(List<String> values) {
            addCriterion("repair_reason not in", values, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonBetween(String value1, String value2) {
            addCriterion("repair_reason between", value1, value2, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairReasonNotBetween(String value1, String value2) {
            addCriterion("repair_reason not between", value1, value2, "repairReason");
            return (Criteria) this;
        }

        public Criteria andRepairContentIsNull() {
            addCriterion("repair_content is null");
            return (Criteria) this;
        }

        public Criteria andRepairContentIsNotNull() {
            addCriterion("repair_content is not null");
            return (Criteria) this;
        }

        public Criteria andRepairContentEqualTo(String value) {
            addCriterion("repair_content =", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentNotEqualTo(String value) {
            addCriterion("repair_content <>", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentGreaterThan(String value) {
            addCriterion("repair_content >", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentGreaterThanOrEqualTo(String value) {
            addCriterion("repair_content >=", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentLessThan(String value) {
            addCriterion("repair_content <", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentLessThanOrEqualTo(String value) {
            addCriterion("repair_content <=", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentLike(String value) {
            addCriterion("repair_content like", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentNotLike(String value) {
            addCriterion("repair_content not like", value, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentIn(List<String> values) {
            addCriterion("repair_content in", values, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentNotIn(List<String> values) {
            addCriterion("repair_content not in", values, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentBetween(String value1, String value2) {
            addCriterion("repair_content between", value1, value2, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairContentNotBetween(String value1, String value2) {
            addCriterion("repair_content not between", value1, value2, "repairContent");
            return (Criteria) this;
        }

        public Criteria andRepairBusIsNull() {
            addCriterion("repair_bus is null");
            return (Criteria) this;
        }

        public Criteria andRepairBusIsNotNull() {
            addCriterion("repair_bus is not null");
            return (Criteria) this;
        }

        public Criteria andRepairBusEqualTo(String value) {
            addCriterion("repair_bus =", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusNotEqualTo(String value) {
            addCriterion("repair_bus <>", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusGreaterThan(String value) {
            addCriterion("repair_bus >", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusGreaterThanOrEqualTo(String value) {
            addCriterion("repair_bus >=", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusLessThan(String value) {
            addCriterion("repair_bus <", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusLessThanOrEqualTo(String value) {
            addCriterion("repair_bus <=", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusLike(String value) {
            addCriterion("repair_bus like", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusNotLike(String value) {
            addCriterion("repair_bus not like", value, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusIn(List<String> values) {
            addCriterion("repair_bus in", values, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusNotIn(List<String> values) {
            addCriterion("repair_bus not in", values, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusBetween(String value1, String value2) {
            addCriterion("repair_bus between", value1, value2, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairBusNotBetween(String value1, String value2) {
            addCriterion("repair_bus not between", value1, value2, "repairBus");
            return (Criteria) this;
        }

        public Criteria andRepairPersonIsNull() {
            addCriterion("repair_person is null");
            return (Criteria) this;
        }

        public Criteria andRepairPersonIsNotNull() {
            addCriterion("repair_person is not null");
            return (Criteria) this;
        }

        public Criteria andRepairPersonEqualTo(String value) {
            addCriterion("repair_person =", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonNotEqualTo(String value) {
            addCriterion("repair_person <>", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonGreaterThan(String value) {
            addCriterion("repair_person >", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonGreaterThanOrEqualTo(String value) {
            addCriterion("repair_person >=", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonLessThan(String value) {
            addCriterion("repair_person <", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonLessThanOrEqualTo(String value) {
            addCriterion("repair_person <=", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonLike(String value) {
            addCriterion("repair_person like", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonNotLike(String value) {
            addCriterion("repair_person not like", value, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonIn(List<String> values) {
            addCriterion("repair_person in", values, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonNotIn(List<String> values) {
            addCriterion("repair_person not in", values, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonBetween(String value1, String value2) {
            addCriterion("repair_person between", value1, value2, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairPersonNotBetween(String value1, String value2) {
            addCriterion("repair_person not between", value1, value2, "repairPerson");
            return (Criteria) this;
        }

        public Criteria andRepairFeeIsNull() {
            addCriterion("repair_fee is null");
            return (Criteria) this;
        }

        public Criteria andRepairFeeIsNotNull() {
            addCriterion("repair_fee is not null");
            return (Criteria) this;
        }

        public Criteria andRepairFeeEqualTo(String value) {
            addCriterion("repair_fee =", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeNotEqualTo(String value) {
            addCriterion("repair_fee <>", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeGreaterThan(String value) {
            addCriterion("repair_fee >", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeGreaterThanOrEqualTo(String value) {
            addCriterion("repair_fee >=", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeLessThan(String value) {
            addCriterion("repair_fee <", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeLessThanOrEqualTo(String value) {
            addCriterion("repair_fee <=", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeLike(String value) {
            addCriterion("repair_fee like", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeNotLike(String value) {
            addCriterion("repair_fee not like", value, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeIn(List<String> values) {
            addCriterion("repair_fee in", values, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeNotIn(List<String> values) {
            addCriterion("repair_fee not in", values, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeBetween(String value1, String value2) {
            addCriterion("repair_fee between", value1, value2, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairFeeNotBetween(String value1, String value2) {
            addCriterion("repair_fee not between", value1, value2, "repairFee");
            return (Criteria) this;
        }

        public Criteria andRepairStatusIsNull() {
            addCriterion("repair_status is null");
            return (Criteria) this;
        }

        public Criteria andRepairStatusIsNotNull() {
            addCriterion("repair_status is not null");
            return (Criteria) this;
        }

        public Criteria andRepairStatusEqualTo(Integer value) {
            addCriterion("repair_status =", value, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusNotEqualTo(Integer value) {
            addCriterion("repair_status <>", value, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusGreaterThan(Integer value) {
            addCriterion("repair_status >", value, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusGreaterThanOrEqualTo(Integer value) {
            addCriterion("repair_status >=", value, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusLessThan(Integer value) {
            addCriterion("repair_status <", value, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusLessThanOrEqualTo(Integer value) {
            addCriterion("repair_status <=", value, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusIn(List<Integer> values) {
            addCriterion("repair_status in", values, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusNotIn(List<Integer> values) {
            addCriterion("repair_status not in", values, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusBetween(Integer value1, Integer value2) {
            addCriterion("repair_status between", value1, value2, "repairStatus");
            return (Criteria) this;
        }

        public Criteria andRepairStatusNotBetween(Integer value1, Integer value2) {
            addCriterion("repair_status not between", value1, value2, "repairStatus");
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
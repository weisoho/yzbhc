package com.yunsheng.yzb.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CheckInventoryExample {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public CheckInventoryExample() {
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

        public Criteria andCheCodeIsNull() {
            addCriterion("che_code is null");
            return (Criteria) this;
        }

        public Criteria andCheCodeIsNotNull() {
            addCriterion("che_code is not null");
            return (Criteria) this;
        }

        public Criteria andCheCodeEqualTo(String value) {
            addCriterion("che_code =", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeNotEqualTo(String value) {
            addCriterion("che_code <>", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeGreaterThan(String value) {
            addCriterion("che_code >", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeGreaterThanOrEqualTo(String value) {
            addCriterion("che_code >=", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeLessThan(String value) {
            addCriterion("che_code <", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeLessThanOrEqualTo(String value) {
            addCriterion("che_code <=", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeLike(String value) {
            addCriterion("che_code like", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeNotLike(String value) {
            addCriterion("che_code not like", value, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeIn(List<String> values) {
            addCriterion("che_code in", values, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeNotIn(List<String> values) {
            addCriterion("che_code not in", values, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeBetween(String value1, String value2) {
            addCriterion("che_code between", value1, value2, "cheCode");
            return (Criteria) this;
        }

        public Criteria andCheCodeNotBetween(String value1, String value2) {
            addCriterion("che_code not between", value1, value2, "cheCode");
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

        public Criteria andActualNumIsNull() {
            addCriterion("\"actual _num\" is null");
            return (Criteria) this;
        }

        public Criteria andActualNumIsNotNull() {
            addCriterion("\"actual _num\" is not null");
            return (Criteria) this;
        }

        public Criteria andActualNumEqualTo(Integer value) {
            addCriterion("\"actual _num\" =", value, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumNotEqualTo(Integer value) {
            addCriterion("\"actual _num\" <>", value, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumGreaterThan(Integer value) {
            addCriterion("\"actual _num\" >", value, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumGreaterThanOrEqualTo(Integer value) {
            addCriterion("\"actual _num\" >=", value, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumLessThan(Integer value) {
            addCriterion("\"actual _num\" <", value, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumLessThanOrEqualTo(Integer value) {
            addCriterion("\"actual _num\" <=", value, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumIn(List<Integer> values) {
            addCriterion("\"actual _num\" in", values, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumNotIn(List<Integer> values) {
            addCriterion("\"actual _num\" not in", values, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumBetween(Integer value1, Integer value2) {
            addCriterion("\"actual _num\" between", value1, value2, "actualNum");
            return (Criteria) this;
        }

        public Criteria andActualNumNotBetween(Integer value1, Integer value2) {
            addCriterion("\"actual _num\" not between", value1, value2, "actualNum");
            return (Criteria) this;
        }

        public Criteria andSysNumIsNull() {
            addCriterion("sys_num is null");
            return (Criteria) this;
        }

        public Criteria andSysNumIsNotNull() {
            addCriterion("sys_num is not null");
            return (Criteria) this;
        }

        public Criteria andSysNumEqualTo(Integer value) {
            addCriterion("sys_num =", value, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumNotEqualTo(Integer value) {
            addCriterion("sys_num <>", value, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumGreaterThan(Integer value) {
            addCriterion("sys_num >", value, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumGreaterThanOrEqualTo(Integer value) {
            addCriterion("sys_num >=", value, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumLessThan(Integer value) {
            addCriterion("sys_num <", value, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumLessThanOrEqualTo(Integer value) {
            addCriterion("sys_num <=", value, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumIn(List<Integer> values) {
            addCriterion("sys_num in", values, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumNotIn(List<Integer> values) {
            addCriterion("sys_num not in", values, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumBetween(Integer value1, Integer value2) {
            addCriterion("sys_num between", value1, value2, "sysNum");
            return (Criteria) this;
        }

        public Criteria andSysNumNotBetween(Integer value1, Integer value2) {
            addCriterion("sys_num not between", value1, value2, "sysNum");
            return (Criteria) this;
        }

        public Criteria andDiffReasonIsNull() {
            addCriterion("diff_reason is null");
            return (Criteria) this;
        }

        public Criteria andDiffReasonIsNotNull() {
            addCriterion("diff_reason is not null");
            return (Criteria) this;
        }

        public Criteria andDiffReasonEqualTo(String value) {
            addCriterion("diff_reason =", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonNotEqualTo(String value) {
            addCriterion("diff_reason <>", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonGreaterThan(String value) {
            addCriterion("diff_reason >", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonGreaterThanOrEqualTo(String value) {
            addCriterion("diff_reason >=", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonLessThan(String value) {
            addCriterion("diff_reason <", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonLessThanOrEqualTo(String value) {
            addCriterion("diff_reason <=", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonLike(String value) {
            addCriterion("diff_reason like", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonNotLike(String value) {
            addCriterion("diff_reason not like", value, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonIn(List<String> values) {
            addCriterion("diff_reason in", values, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonNotIn(List<String> values) {
            addCriterion("diff_reason not in", values, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonBetween(String value1, String value2) {
            addCriterion("diff_reason between", value1, value2, "diffReason");
            return (Criteria) this;
        }

        public Criteria andDiffReasonNotBetween(String value1, String value2) {
            addCriterion("diff_reason not between", value1, value2, "diffReason");
            return (Criteria) this;
        }

        public Criteria andCheStatusIsNull() {
            addCriterion("che_status is null");
            return (Criteria) this;
        }

        public Criteria andCheStatusIsNotNull() {
            addCriterion("che_status is not null");
            return (Criteria) this;
        }

        public Criteria andCheStatusEqualTo(Integer value) {
            addCriterion("che_status =", value, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusNotEqualTo(Integer value) {
            addCriterion("che_status <>", value, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusGreaterThan(Integer value) {
            addCriterion("che_status >", value, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusGreaterThanOrEqualTo(Integer value) {
            addCriterion("che_status >=", value, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusLessThan(Integer value) {
            addCriterion("che_status <", value, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusLessThanOrEqualTo(Integer value) {
            addCriterion("che_status <=", value, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusIn(List<Integer> values) {
            addCriterion("che_status in", values, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusNotIn(List<Integer> values) {
            addCriterion("che_status not in", values, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusBetween(Integer value1, Integer value2) {
            addCriterion("che_status between", value1, value2, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheStatusNotBetween(Integer value1, Integer value2) {
            addCriterion("che_status not between", value1, value2, "cheStatus");
            return (Criteria) this;
        }

        public Criteria andCheDateIsNull() {
            addCriterion("che_date is null");
            return (Criteria) this;
        }

        public Criteria andCheDateIsNotNull() {
            addCriterion("che_date is not null");
            return (Criteria) this;
        }

        public Criteria andCheDateEqualTo(Date value) {
            addCriterion("che_date =", value, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateNotEqualTo(Date value) {
            addCriterion("che_date <>", value, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateGreaterThan(Date value) {
            addCriterion("che_date >", value, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateGreaterThanOrEqualTo(Date value) {
            addCriterion("che_date >=", value, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateLessThan(Date value) {
            addCriterion("che_date <", value, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateLessThanOrEqualTo(Date value) {
            addCriterion("che_date <=", value, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateIn(List<Date> values) {
            addCriterion("che_date in", values, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateNotIn(List<Date> values) {
            addCriterion("che_date not in", values, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateBetween(Date value1, Date value2) {
            addCriterion("che_date between", value1, value2, "cheDate");
            return (Criteria) this;
        }

        public Criteria andCheDateNotBetween(Date value1, Date value2) {
            addCriterion("che_date not between", value1, value2, "cheDate");
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
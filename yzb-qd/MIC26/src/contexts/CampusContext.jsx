/**
 * 院区上下文模块
 * 提供院区和科室状态管理功能，包括真实部门树加载、院区切换和状态持久化
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import api, { getApiErrorMessage } from '../utils/api';
import {
  findDepartmentById,
  flattenDepartmentTree,
  getCampusNodes,
  getDepartmentDisplayName,
  getDepartmentOptionsByCampus,
  normalizeDepartmentTree,
} from '../utils/departmentTree';

const CampusContext = createContext();

const CURRENT_CAMPUS_ID_KEY = 'currentCampusId';
const CURRENT_CAMPUS_NAME_KEY = 'currentCampus';
const CURRENT_DEPARTMENT_ID_KEY = 'currentDepartmentId';
const CURRENT_DEPARTMENT_NAME_KEY = 'currentDepartment';

export const useCampusContext = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampusContext must be used within a CampusProvider');
  }
  return context;
};

export const CampusProvider = ({ children }) => {
  const [campuses, setCampuses] = useState([]);
  const [campusLoading, setCampusLoading] = useState(false);
  const [currentCampusId, setCurrentCampusId] = useState(() => {
    const savedId = localStorage.getItem(CURRENT_CAMPUS_ID_KEY);
    return savedId ? Number(savedId) : null;
  });
  const [currentDepartmentId, setCurrentDepartmentId] = useState(() => {
    const savedId = localStorage.getItem(CURRENT_DEPARTMENT_ID_KEY);
    return savedId ? Number(savedId) : null;
  });
  const [isCampusModalVisible, setIsCampusModalVisible] = useState(false);
  const [hasSelectedCampus, setHasSelectedCampus] = useState(() => localStorage.getItem('hasSelectedCampus') === 'true');

  const persistDepartmentSelection = (department) => {
    if (department?.id) {
      localStorage.setItem(CURRENT_DEPARTMENT_ID_KEY, String(department.id));
    } else {
      localStorage.removeItem(CURRENT_DEPARTMENT_ID_KEY);
    }
    localStorage.setItem(CURRENT_DEPARTMENT_NAME_KEY, getDepartmentDisplayName(department));
    window.dispatchEvent(new CustomEvent('departmentChanged', { detail: department }));
  };

  const persistCampusSelection = (campus) => {
    if (campus?.id) {
      localStorage.setItem(CURRENT_CAMPUS_ID_KEY, String(campus.id));
    } else {
      localStorage.removeItem(CURRENT_CAMPUS_ID_KEY);
    }
    localStorage.setItem(CURRENT_CAMPUS_NAME_KEY, getDepartmentDisplayName(campus));
    window.dispatchEvent(new CustomEvent('campusChanged', { detail: campus }));
  };

  const campusById = useMemo(() => new Map(flattenDepartmentTree(campuses).map((item) => [Number(item.id), item])), [campuses]);

  const currentCampusNode = currentCampusId ? campusById.get(Number(currentCampusId)) || null : null;
  const departmentOptions = useMemo(() => getDepartmentOptionsByCampus(currentCampusNode), [currentCampusNode]);
  const currentDepartmentNode = currentDepartmentId
    ? findDepartmentById(departmentOptions, currentDepartmentId) || null
    : null;

  const applyCampusSelection = (campusNode, nextDepartmentId) => {
    if (!campusNode) {
      setCurrentCampusId(null);
      setCurrentDepartmentId(null);
      persistCampusSelection(null);
      persistDepartmentSelection(null);
      return;
    }

    const campusDepartments = getDepartmentOptionsByCampus(campusNode);
    const nextDepartment = campusDepartments.find((item) => Number(item.id) === Number(nextDepartmentId)) || campusDepartments[0] || null;

    setCurrentCampusId(Number(campusNode.id));
    setCurrentDepartmentId(nextDepartment ? Number(nextDepartment.id) : null);
    persistCampusSelection(campusNode);
    persistDepartmentSelection(nextDepartment);
    setHasSelectedCampus(true);
    localStorage.setItem('hasSelectedCampus', 'true');
  };

  const loadCampusTree = async () => {
    try {
      setCampusLoading(true);
      const response = await api.get('/api/department/tree');
      if (response.code !== 1 || !Array.isArray(response.data)) {
        throw new Error('加载部门树失败');
      }

      const normalizedTree = getCampusNodes(normalizeDepartmentTree(response.data));
      setCampuses(normalizedTree);

      const savedCampusName = localStorage.getItem(CURRENT_CAMPUS_NAME_KEY);
      const preferredCampus = normalizedTree.find((item) => Number(item.id) === Number(currentCampusId))
        || normalizedTree.find((item) => item.deptName === savedCampusName)
        || normalizedTree[0]
        || null;

      if (preferredCampus) {
        applyCampusSelection(preferredCampus, currentDepartmentId);
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载院区和科室失败'));
    } finally {
      setCampusLoading(false);
    }
  };

  useEffect(() => {
    loadCampusTree();
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && !hasSelectedCampus && campuses.length > 0) {
      setIsCampusModalVisible(true);
    }
  }, [campuses.length, hasSelectedCampus]);

  const selectCampus = (campusIdentifier) => {
    const campusNode = campuses.find((item) => Number(item.id) === Number(campusIdentifier))
      || campuses.find((item) => item.deptName === campusIdentifier);
    applyCampusSelection(campusNode, null);
    setIsCampusModalVisible(false);
  };

  const selectDepartment = (departmentIdentifier) => {
    const nextDepartment = departmentOptions.find((item) => Number(item.id) === Number(departmentIdentifier))
      || departmentOptions.find((item) => item.deptName === departmentIdentifier);
    setCurrentDepartmentId(nextDepartment ? Number(nextDepartment.id) : null);
    persistDepartmentSelection(nextDepartment);
  };

  const showCampusModal = () => {
    setIsCampusModalVisible(true);
  };

  const hideCampusModal = () => {
    setIsCampusModalVisible(false);
  };

  const checkNeedCampusSelection = () => !hasSelectedCampus;

  const forceShowCampusSelection = () => {
    setHasSelectedCampus(false);
    localStorage.removeItem('hasSelectedCampus');
    setIsCampusModalVisible(true);
  };

  const contextValue = {
    campuses,
    campusLoading,
    currentCampus: getDepartmentDisplayName(currentCampusNode),
    currentCampusNode,
    currentDepartment: currentDepartmentNode,
    departmentOptions,
    selectCampus,
    selectDepartment,
    isCampusModalVisible,
    showCampusModal,
    hideCampusModal,
    hasSelectedCampus,
    checkNeedCampusSelection,
    forceShowCampusSelection,
    reloadCampuses: loadCampusTree,
  };

  return <CampusContext.Provider value={contextValue}>{children}</CampusContext.Provider>;
};
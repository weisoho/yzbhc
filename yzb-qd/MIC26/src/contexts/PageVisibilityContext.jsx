/**
 * 页面可见性上下文模块
 * 提供页面显示/隐藏状态管理功能，使用独立配置文件进行状态保存
 */

import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { 
  readFeatureConfig, 
  writeFeatureConfig, 
  readFeatureConfigSync,
  getAllPagesConfig,
  generateTreeData,
  getVisibleKeysFromConfig,
  updateConfigWithVisibleKeys,
  isPageVisible as isPageVisibleUtil
} from '../utils/featureConfig';

// 存储键常量
const STORAGE_VERSION_KEY = 'pageStructureVersion';

// 创建页面可见性上下文
const PageVisibilityContext = createContext();

/**
 * 使用页面可见性上下文的Hook
 * @returns {Object} 页面可见性上下文对象
 */
export const usePageVisibility = () => {
  const context = useContext(PageVisibilityContext);
  if (!context) {
    throw new Error('usePageVisibility must be used within a PageVisibilityProvider');
  }
  return context;
};





/**
 * 页面可见性上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const PageVisibilityProvider = ({ children }) => {
  // 所有页面配置
  const allPages = useRef(getAllPagesConfig());
  const treeData = useRef(generateTreeData());
  
  // 可见页面key列表（默认为所有页面可见）
  const [visibleKeys, setVisibleKeys] = useState([]);
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 版本号（用于检测功能栏结构变化）
  const [structureVersion, setStructureVersion] = useState(0);

  /**
   * 初始化页面可见性设置
   * 从独立配置文件中加载设置
   */
  useEffect(() => {
    const initializeVisibility = async () => {
      try {
        // 从独立配置文件加载设置
        const config = await readFeatureConfig();
        
        // 从配置中获取可见key列表
        const visibleKeysFromConfig = getVisibleKeysFromConfig(config);
        
        // 设置可见key列表
        setVisibleKeys(visibleKeysFromConfig);
        
        // 设置初始化完成状态
        setIsInitialized(true);
        
        // 触发初始化完成事件
        window.dispatchEvent(new CustomEvent('pageVisibilityInitialized', {
          detail: { visibleKeys: visibleKeysFromConfig }
        }));
        
        console.log('Page visibility initialized from feature config:', {
          visibleKeys: visibleKeysFromConfig.length,
          totalPages: allPages.current.length
        });
        
      } catch (error) {
        console.error('Failed to initialize page visibility from feature config:', error);
        
        // 出错时使用默认配置（仅显示首页）
        setVisibleKeys(['/']);
        setIsInitialized(true);
        
        // 触发初始化完成事件（使用默认配置）
        window.dispatchEvent(new CustomEvent('pageVisibilityInitialized', {
          detail: { visibleKeys: ['/'] }
        }));
      }
    };

    // 执行初始化
    initializeVisibility();
  }, []);

  /**
   * 监听存储变化（实现多标签页同步）
   * 监听featureVisibilityConfig的变化
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'featureVisibilityConfig' && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          if (newConfig.settings && newConfig.settings.visibleKeys) {
            const visibleKeysFromConfig = getVisibleKeysFromConfig(newConfig);
            setVisibleKeys(visibleKeysFromConfig);
          }
        } catch (error) {
          console.error('Failed to parse feature config storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * 监听自定义事件（实现同一窗口内的同步）
   */
  useEffect(() => {
    const handleVisibilityChanged = (e) => {
      if (e.detail && e.detail.visibleKeys) {
        setVisibleKeys(e.detail.visibleKeys);
      }
    };

    const handleStructureChanged = (e) => {
      if (e.detail && e.detail.version) {
        setStructureVersion(e.detail.version);
      }
    };

    window.addEventListener('pageVisibilityChanged', handleVisibilityChanged);
    window.addEventListener('pageStructureChanged', handleStructureChanged);
    
    return () => {
      window.removeEventListener('pageVisibilityChanged', handleVisibilityChanged);
      window.removeEventListener('pageStructureChanged', handleStructureChanged);
    };
  }, []);

  /**
   * 检查页面是否可见
   * @param {string} key - 页面key
   * @returns {boolean} 是否可见
   */
  const isPageVisible = useCallback((key) => {
    // 首页始终可见
    if (key === '/') return true;
    return visibleKeys.includes(key);
  }, [visibleKeys]);

  /**
   * 批量检查页面是否可见
   * @param {Array} keys - 页面key数组
   * @returns {Object} 可见性映射对象
   */
  const getPagesVisibility = useCallback((keys) => {
    const result = {};
    keys.forEach(key => {
      result[key] = isPageVisible(key);
    });
    return result;
  }, [isPageVisible]);

  /**
   * 设置页面可见性
   * @param {string} key - 页面key
   * @param {boolean} visible - 是否可见
   */
  const setPageVisibility = useCallback(async (key, visible) => {
    if (key === '/') return; // 首页不能隐藏
    
    setVisibleKeys(prev => {
      const newKeys = visible
        ? [...new Set([...prev, key])]
        : prev.filter(k => k !== key);
      
      // 异步保存到配置文件
      saveConfigWithVisibleKeys(newKeys);
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('pageVisibilityChanged', {
        detail: { visibleKeys: newKeys, changedKey: key, visible }
      }));
      
      return newKeys;
    });
  }, []);

  /**
   * 批量设置页面可见性
   * @param {Array} keys - 页面key数组
   * @param {boolean} visible - 是否可见
   */
  const setPagesVisibility = useCallback(async (keys, visible) => {
    setVisibleKeys(prev => {
      const newKeys = visible
        ? [...new Set([...prev, ...keys.filter(k => k !== '/')])]
        : prev.filter(k => !keys.includes(k) || k === '/');
      
      // 异步保存到配置文件
      saveConfigWithVisibleKeys(newKeys);
      
      window.dispatchEvent(new CustomEvent('pageVisibilityChanged', {
        detail: { visibleKeys: newKeys, changedKeys: keys, visible }
      }));
      
      return newKeys;
    });
  }, []);

  /**
   * 保存配置到文件
   * @param {Array} visibleKeys - 可见key列表
   */
  const saveConfigWithVisibleKeys = async (visibleKeys) => {
    try {
      // 读取当前配置
      const currentConfig = await readFeatureConfig();
      
      // 更新配置
      const updatedConfig = updateConfigWithVisibleKeys(currentConfig, visibleKeys);
      
      // 保存到配置文件
      const success = await writeFeatureConfig(updatedConfig);
      
      if (!success) {
        console.error('Failed to save feature config');
      }
    } catch (error) {
      console.error('Error saving feature config:', error);
    }
  };

  /**
   * 切换页面可见性
   * @param {string} key - 页面key
   */
  const togglePageVisibility = useCallback((key) => {
    if (key === '/') return;
    setPageVisibility(key, !isPageVisible(key));
  }, [isPageVisible, setPageVisibility]);

  /**
   * 获取所有可见页面
   * @returns {Array} 可见页面配置数组
   */
  const getVisiblePages = useCallback(() => {
    return allPages.current.filter(page => isPageVisible(page.key));
  }, [isPageVisible]);

  /**
   * 获取所有隐藏页面
   * @returns {Array} 隐藏页面配置数组
   */
  const getHiddenPages = useCallback(() => {
    return allPages.current.filter(page => !isPageVisible(page.key));
  }, [isPageVisible]);

  /**
   * 重置为默认设置（所有页面隐藏，仅显示首页）
   */
  const resetToDefault = useCallback(async () => {
    // 默认只显示首页
    const defaultVisibleKeys = ['/'];
    setVisibleKeys(defaultVisibleKeys);
    
    // 保存到配置文件
    await saveConfigWithVisibleKeys(defaultVisibleKeys);
    
    window.dispatchEvent(new CustomEvent('pageVisibilityChanged', {
      detail: { visibleKeys: defaultVisibleKeys, reset: true }
    }));
  }, []);

  /**
   * 更新功能栏结构版本（当添加/删除功能时调用）
   */
  const updateStructureVersion = useCallback(() => {
    const newVersion = Date.now();
    setStructureVersion(newVersion);
    localStorage.setItem(STORAGE_VERSION_KEY, newVersion.toString());
    
    window.dispatchEvent(new CustomEvent('pageStructureChanged', {
      detail: { version: newVersion }
    }));
  }, []);

  /**
   * 添加新页面
   * @param {Object} pageConfig - 页面配置
   */
  const addPage = useCallback(async (pageConfig) => {
    // 添加到所有页面列表
    allPages.current = [...allPages.current, pageConfig];
    
    // 默认设置为可见
    setVisibleKeys(prev => {
      const newKeys = [...new Set([...prev, pageConfig.key])];
      
      // 异步保存到配置文件
      saveConfigWithVisibleKeys(newKeys);
      
      return newKeys;
    });
  }, []);

  /**
   * 移除页面
   * @param {string} key - 页面key
   */
  const removePage = useCallback(async (key) => {
    if (key === '/') return; // 首页不能移除
    
    // 从所有页面列表中移除
    allPages.current = allPages.current.filter(p => p.key !== key);
    
    // 从可见列表中移除
    setVisibleKeys(prev => {
      const newKeys = prev.filter(k => k !== key);
      
      // 异步保存到配置文件
      saveConfigWithVisibleKeys(newKeys);
      
      return newKeys;
    });
  }, []);

  const value = {
    // 状态
    visibleKeys,
    isInitialized,
    structureVersion,
    treeData: treeData.current,
    allPages: allPages.current,
    
    // 查询方法
    isPageVisible,
    getPagesVisibility,
    getVisiblePages,
    getHiddenPages,
    
    // 修改方法
    setPageVisibility,
    setPagesVisibility,
    togglePageVisibility,
    resetToDefault,
    
    // 结构管理
    addPage,
    removePage,
    updateStructureVersion,
  };

  return (
    <PageVisibilityContext.Provider value={value}>
      {children}
    </PageVisibilityContext.Provider>
  );
};

export default PageVisibilityContext;

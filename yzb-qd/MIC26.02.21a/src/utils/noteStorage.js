// 备注数据存储服务
const STORAGE_KEY = 'floating_notes_data';

// 备注数据结构
export const NoteData = {
  id: '',
  pagePath: '',
  pageTitle: '',
  content: '',
  lastModified: '',
  createdBy: ''
};

// 获取所有备注数据
export const getAllNotes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取备注数据失败:', error);
    return {};
  }
};

// 保存所有备注数据
export const saveAllNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('保存备注数据失败:', error);
    return false;
  }
};

// 获取指定页面的备注
export const getNoteByPage = (pagePath) => {
  const notes = getAllNotes();
  return notes[pagePath] || null;
};

// 保存或更新页面备注
export const saveNote = (pagePath, pageTitle, content, createdBy = '') => {
  const notes = getAllNotes();
  const now = new Date().toISOString();
  
  notes[pagePath] = {
    id: `${pagePath}_${Date.now()}`,
    pagePath,
    pageTitle,
    content,
    lastModified: now,
    createdBy: createdBy || notes[pagePath]?.createdBy || '系统用户'
  };
  
  return saveAllNotes(notes);
};

// 删除页面备注
export const deleteNote = (pagePath) => {
  const notes = getAllNotes();
  if (notes[pagePath]) {
    delete notes[pagePath];
    return saveAllNotes(notes);
  }
  return true;
};

// 获取最近修改的备注
export const getRecentNotes = (limit = 10) => {
  const notes = getAllNotes();
  const noteArray = Object.values(notes);
  
  return noteArray
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, limit);
};

// 清空所有备注数据（用于测试）
export const clearAllNotes = () => {
  localStorage.removeItem(STORAGE_KEY);
  return true;
};

// 导出备注数据
export const exportNotes = () => {
  const notes = getAllNotes();
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  return {
    data: dataStr,
    blob: dataBlob,
    filename: `floating_notes_${new Date().toISOString().split('T')[0]}.json`
  };
};

// 导入备注数据
export const importNotes = (jsonData) => {
  try {
    const importedNotes = JSON.parse(jsonData);
    const currentNotes = getAllNotes();
    
    // 合并数据，新数据覆盖旧数据
    const mergedNotes = { ...currentNotes, ...importedNotes };
    
    return saveAllNotes(mergedNotes);
  } catch (error) {
    console.error('导入备注数据失败:', error);
    return false;
  }
};
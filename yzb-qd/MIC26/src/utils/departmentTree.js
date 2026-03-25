export const normalizeDepartmentTree = (nodes = []) => nodes.map((node) => ({
  ...node,
  key: String(node.id),
  title: node.deptName,
  name: node.deptName,
  value: node.id,
  children: normalizeDepartmentTree(node.children || []),
}));

export const flattenDepartmentTree = (nodes = []) => nodes.reduce((result, node) => {
  result.push(node);
  if (node.children?.length) {
    result.push(...flattenDepartmentTree(node.children));
  }
  return result;
}, []);

export const getCampusNodes = (nodes = []) => nodes.filter((node) => node.orgType === 'CAMPUS' || Number(node.parentId || 0) === 0);

export const findDepartmentById = (nodes = [], id) => {
  if (id === undefined || id === null) {
    return null;
  }
  const targetId = Number(id);
  for (const node of nodes) {
    if (Number(node.id) === targetId) {
      return node;
    }
    const childMatch = findDepartmentById(node.children || [], targetId);
    if (childMatch) {
      return childMatch;
    }
  }
  return null;
};

export const getDepartmentOptionsByCampus = (campusNode) => {
  if (!campusNode) {
    return [];
  }
  return flattenDepartmentTree(campusNode.children || []).filter((node) => node.orgType !== 'CAMPUS');
};

export const getDepartmentDisplayName = (node) => node?.deptName || node?.name || '--';

export const getDepartmentDescription = (node) => node?.remark || node?.address || '';


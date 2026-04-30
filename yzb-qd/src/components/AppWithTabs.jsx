import React from 'react';
import { useTabContext } from '../contexts/TabContext.jsx';
import DraggableTabNavigation from './DraggableTabNavigation.jsx';

const AppContent = ({ children }) => {
  const { tabs, activeTab, handleTabClick, handleTabClose, handleCloseTabs, handleTabsReorder } = useTabContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <DraggableTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onCloseTabs={handleCloseTabs}
        onTabsReorder={handleTabsReorder}
      />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

const AppWithTabs = ({ children }) => {
  return (
    <AppContent>
      {children}
    </AppContent>
  );
};

export default AppWithTabs;
import React from 'react';
import AdminAuthGuard from '../admin/AdminAuthGuard';

const AdminRoute = ({ children }) => {
  return (
    <AdminAuthGuard>
      {children}
    </AdminAuthGuard>
  );
};

export default AdminRoute;

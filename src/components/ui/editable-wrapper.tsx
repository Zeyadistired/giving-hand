
import React, { useState, useEffect } from 'react';
import { Edit, X, Save } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';

interface EditableWrapperProps {
  children: React.ReactNode;
  onSave?: (value: string) => void;
  className?: string;
  multiline?: boolean;
  label?: string;
}

export const EditableWrapper = ({ 
  children, 
  onSave, 
  className = '',
  multiline = false,
  label
}: EditableWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userRole = localStorage.getItem('userRole');
        const isEditMode = localStorage.getItem('isEditMode') === 'true';
        
        // Check if user is admin (email ends with admin.com) and edit mode is enabled
        const isAdminUser = currentUser?.email?.endsWith('@admin.com') && isEditMode;
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
    
    window.addEventListener('storage', checkAdminStatus);
    window.addEventListener('editModeChanged', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      window.removeEventListener('editModeChanged', checkAdminStatus);
    };
  }, []);

  // If not admin, just render children without edit functionality
  if (!isAdmin) {
    return <>{children}</>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    if (React.isValidElement(children)) {
      let content = '';
      if (typeof children.props.children === 'string') {
        content = children.props.children;
      } else if (children.props.value && typeof children.props.value === 'string') {
        content = children.props.value;
      } else if (children.props.placeholder && typeof children.props.placeholder === 'string') {
        content = children.props.placeholder;
      }
      setEditValue(content || '');
    } else if (typeof children === 'string') {
      setEditValue(children);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(editValue);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={`group relative ${className} editable-wrapper`}>
      {isEditing ? (
        <div className="w-full relative">
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[100px]"
              placeholder={`Edit ${label || 'content'}...`}
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={`Edit ${label || 'content'}...`}
              autoFocus
            />
          )}
          <div className="absolute right-0 top-0 flex gap-1 z-10 -mt-8">
            <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8 bg-white rounded-full shadow-sm">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 bg-white rounded-full shadow-sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center">
          {children}
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white rounded-full shadow-sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 text-charity-primary" />
          </Button>
        </div>
      )}
    </div>
  );
};

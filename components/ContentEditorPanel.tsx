'use client';
import { useState, useEffect } from 'react';
import { AuthService } from '../lib/auth';
import { CMSService } from '../lib/cms-api';

export default function ContentEditorPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const auth = AuthService.getInstance();
  const cms = new CMSService();

  useEffect(() => {
    // Show panel only for content editors
    const canEdit = auth.canEdit() && auth.isAdmin();
    setIsVisible(canEdit);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
          title="Content Editor Panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm font-medium">Edit Content</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Content Editor</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-black hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-black mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Content Editor Mode Active</span>
              </div>
              <p className="text-xs">Click on any text element to edit it directly.</p>
            </div>
            
            <div className="border-t pt-3">
              <h4 className="font-medium text-black mb-2">Quick Actions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  📝 Edit Hero Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('approach-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  🎯 Edit Approach Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('services-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  🛠️ Edit Services Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('business-system-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  🏢 Edit Business System
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('orr-role-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  🎭 Edit ORR Role Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('message-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  💬 Edit Message Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('process-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  📋 Edit Process Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('report-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  📊 Edit Report Section
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('faq-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  ❓ Edit FAQ Section
                </button>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="text-xs text-black">
                <p><strong>Tip:</strong> Use Ctrl+Enter to save multi-line text</p>
                <p><strong>Tip:</strong> Press Escape to cancel editing</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
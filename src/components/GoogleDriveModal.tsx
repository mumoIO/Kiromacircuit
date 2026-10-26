/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  FileText,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  DownloadCloud,
  RefreshCw,
  LogOut,
  FolderOpen,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { User } from 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton';
import { DriveFileInfo, DriveSavedSpot } from '../types';
import {
  listAppDriveFiles,
  saveSpotsToDrive,
  exportSurvivalGuideToDrive,
  deleteDriveFile,
} from '../services/driveService';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isSigningIn: boolean;
  savedSpots: DriveSavedSpot[];
  onRemoveSavedSpot: (spotId: string) => void;
}

export default function GoogleDriveModal({
  isOpen,
  onClose,
  user,
  accessToken,
  onSignIn,
  onSignOut,
  isSigningIn,
  savedSpots,
  onRemoveSavedSpot,
}: GoogleDriveModalProps) {
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Mandatory confirmation state per Google Workspace Skill guidelines
  const [pendingAction, setPendingAction] = useState<{
    type: 'SAVE_SPOTS' | 'EXPORT_GUIDE' | 'DELETE_FILE';
    description: string;
    details?: string;
    fileId?: string;
    fileName?: string;
  } | null>(null);

  const [isExecutingAction, setIsExecutingAction] = useState(false);

  // Fetch Drive files when user is authenticated
  useEffect(() => {
    if (isOpen && accessToken) {
      loadDriveFiles();
    }
  }, [isOpen, accessToken]);

  const loadDriveFiles = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    try {
      const files = await listAppDriveFiles(accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to load Drive files:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  if (!isOpen) return null;

  // Request Confirmation Handlers
  const requestSaveSpots = () => {
    if (savedSpots.length === 0) {
      setStatusMessage({ text: 'You have not bookmarked any 100 Bob spots yet.', type: 'error' });
      return;
    }
    setPendingAction({
      type: 'SAVE_SPOTS',
      description: `Save ${savedSpots.length} bookmarked 100 Bob meal spot(s) to your Google Drive?`,
      details: 'This will create or update "100_Bob_Meals_Kenya_Saved_Spots.md" in your Google Drive root folder.',
    });
  };

  const requestExportGuide = () => {
    setPendingAction({
      type: 'EXPORT_GUIDE',
      description: 'Export the complete Kenya 100 Bob Food Survival Guide to your Google Drive?',
      details: 'This will generate "100_Bob_Kenya_Street_Food_Guide.md" containing complete prices, street food recipes, locations, and insider tips.',
    });
  };

  const requestDeleteFile = (file: DriveFileInfo) => {
    setPendingAction({
      type: 'DELETE_FILE',
      description: `Permanently delete "${file.name}" from your Google Drive?`,
      details: 'This action will remove this file from your Google Drive account. This cannot be undone.',
      fileId: file.id,
      fileName: file.name,
    });
  };

  // Execute confirmed action
  const handleConfirmAction = async () => {
    if (!pendingAction || !accessToken) return;

    setIsExecutingAction(true);
    setStatusMessage(null);

    try {
      if (pendingAction.type === 'SAVE_SPOTS') {
        const file = await saveSpotsToDrive(accessToken, savedSpots);
        setStatusMessage({
          text: `Successfully saved ${savedSpots.length} spot(s) to Google Drive ("${file.name}")!`,
          type: 'success',
        });
        await loadDriveFiles();
      } else if (pendingAction.type === 'EXPORT_GUIDE') {
        const file = await exportSurvivalGuideToDrive(accessToken);
        setStatusMessage({
          text: `Survival Guide saved to Google Drive ("${file.name}")!`,
          type: 'success',
        });
        await loadDriveFiles();
      } else if (pendingAction.type === 'DELETE_FILE' && pendingAction.fileId) {
        await deleteDriveFile(accessToken, pendingAction.fileId);
        setStatusMessage({
          text: `Deleted "${pendingAction.fileName}" from Google Drive.`,
          type: 'success',
        });
        await loadDriveFiles();
      }
    } catch (err: any) {
      setStatusMessage({
        text: err.message || 'Operation failed on Google Drive.',
        type: 'error',
      });
    } finally {
      setIsExecutingAction(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#0C1E17] max-h-[90vh] overflow-y-auto border border-emerald-900/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00843D] flex-shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Google Drive Integration
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Save your favorite 100 Bob spots & budget food guides to your personal Drive.
            </p>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* User Not Signed In View */}
        {!user ? (
          <div className="text-center py-8 space-y-6">
            <div className="max-w-md mx-auto space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Sign in with your Google account to enable Google Drive storage. You will be able to export your custom 100 Bob meal plans, keep personal notes on vibandas, and access your offline food guide anywhere.
              </p>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left font-medium">
                🔒 <strong>Permission Notice</strong>: The app will only create and manage specific files you choose to save (using least-privilege <code>drive.file</code> scope). No other files are touched.
              </div>
            </div>

            <div>
              <GoogleSignInButton
                onClick={onSignIn}
                isLoading={isSigningIn}
                size="lg"
                text="Sign in with Google to Connect Drive"
              />
            </div>
          </div>
        ) : (
          /* User Signed In View */
          <div className="space-y-6">
            {/* User Profile Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-emerald-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#00843D] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {user.displayName || 'Google Account Connected'}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Save Bookmarks Button */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#00843D] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-gray-500">
                      My Favorites
                    </span>
                    <span className="text-xs font-black bg-emerald-100 text-[#00843D] px-2 py-0.5 rounded-full">
                      {savedSpots.length} Spots
                    </span>
                  </div>
                  <h4 className="text-base font-black text-gray-900 mb-1">
                    Save Bookmarks to Drive
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mb-4">
                    Exports your current favorite 100 Bob food spots and prices into a Markdown file.
                  </p>
                </div>

                <button
                  onClick={requestSaveSpots}
                  disabled={savedSpots.length === 0}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00843D] hover:bg-[#006e33] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Sync to Drive</span>
                </button>
              </div>

              {/* Export Full Guide Button */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#F5BA13] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-gray-500">
                      Official Document
                    </span>
                    <span className="text-xs font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Kenya Edition
                    </span>
                  </div>
                  <h4 className="text-base font-black text-gray-900 mb-1">
                    Export Food Survival Guide
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mb-4">
                    Generates the complete 100 Bob Kenya Street Food Survival Guide document directly in your Google Drive.
                  </p>
                </div>

                <button
                  onClick={requestExportGuide}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F5BA13] hover:bg-[#e0a80d] text-[#0C1E17] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Export Guide to Drive</span>
                </button>
              </div>
            </div>

            {/* Currently Saved Spots Preview List */}
            {savedSpots.length > 0 && (
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase text-gray-700">
                    Locally Bookmarked Spots ({savedSpots.length})
                  </h4>
                  <span className="text-[11px] text-gray-500">Ready to sync</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {savedSpots.map((spot) => (
                    <div
                      key={spot.spotId}
                      className="flex items-center justify-between text-xs py-1.5 px-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div>
                        <span className="font-bold text-gray-900">{spot.spotName}</span>
                        <span className="text-gray-500 ml-2">
                          ({spot.neighborhood}, {spot.city})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#00843D]">{spot.price} KSh</span>
                        <button
                          onClick={() => onRemoveSavedSpot(spot.spotId)}
                          className="text-gray-400 hover:text-red-500"
                          title="Remove bookmark"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drive Files List */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase text-gray-700 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-[#00843D]" />
                  <span>Files in Your Google Drive</span>
                </h4>

                <button
                  onClick={loadDriveFiles}
                  disabled={isLoadingFiles}
                  className="text-xs text-[#00843D] hover:text-[#006e33] font-bold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingFiles ? (
                <div className="py-6 text-center text-xs text-gray-400 font-medium">
                  Loading files from Google Drive...
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-500">
                  No 100-Meal files created in your Drive yet. Click one of the buttons above to save your spots or export the guide!
                </div>
              ) : (
                <div className="space-y-2">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-gray-800 truncate">{file.name}</div>
                          <div className="text-[10px] text-gray-400">
                            Modified: {new Date(file.modifiedTime).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#00843D] hover:bg-emerald-50 rounded-lg flex items-center gap-1 font-bold text-[11px]"
                            title="Open in Google Drive"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <button
                          onClick={() => requestDeleteFile(file)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete from Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Confirmation Dialog (MANDATORY per Google Workspace Skill) */}
        {pendingAction && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="text-lg font-black text-gray-900">
                  Please Confirm Operation
                </h4>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-bold text-gray-900">{pendingAction.description}</p>
                {pendingAction.details && (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {pendingAction.details}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  disabled={isExecutingAction}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={isExecutingAction}
                  className={`w-1/2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase text-white shadow-md transition-all ${
                    pendingAction.type === 'DELETE_FILE'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#00843D] hover:bg-[#006e33]'
                  }`}
                >
                  {isExecutingAction ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

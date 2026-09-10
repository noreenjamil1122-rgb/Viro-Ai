import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  File, 
  Trash2, 
  Check, 
  Calendar, 
  Send, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialPlatform } from '../types';

export const ManualUploadView: React.FC = () => {
  const { createPost, setCurrentView, addNotification } = useApp();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram', 'linkedin']);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; previewUrl: string; type: string }[]>([]);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(14, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [publishAction, setPublishAction] = useState<'schedule' | 'now' | 'draft'>('schedule');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      // Validate format
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        addNotification('Invalid File', `${file.name} is not a supported image or video format`, 'error');
        return;
      }

      // Generate object URL for preview
      const previewUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: sizeMb,
          previewUrl,
          type: file.type.startsWith('video/') ? 'video' : 'image',
        },
      ]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(x => x !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;

    let status: 'draft' | 'scheduled' | 'published' = 'draft';
    if (publishAction === 'now') status = 'published';
    else if (publishAction === 'schedule') status = 'scheduled';

    const mediaUrls = uploadedFiles.map(f => f.previewUrl);

    await createPost({
      title,
      caption,
      platforms: selectedPlatforms,
      media_urls: mediaUrls.length > 0 ? mediaUrls : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'],
      status,
      scheduled_for: publishAction === 'schedule' ? new Date(scheduleDate).toISOString() : undefined,
      published_at: publishAction === 'now' ? new Date().toISOString() : undefined,
      ai_generated: false,
    });

    addNotification('Media Uploaded', `Successfully created "${title}" with custom uploaded media.`, 'success');
    setCurrentView('post-history');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
            Media Module
          </span>
          <span className="text-xs text-zinc-400">• Asset Management</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
          Media Upload
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Upload photos, graphics, or video files and schedule them across connected social channels.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Uploader & File Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Step 1: Upload Media Assets
            </h2>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-purple-700 bg-purple-50/40 dark:bg-purple-950/20'
                  : 'border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400 mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                PNG, JPG, WebP, MP4 up to 50MB
              </p>
            </div>

            {/* Uploaded Files Queue */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Attached Files ({uploadedFiles.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="aspect-video overflow-hidden rounded-lg bg-zinc-900 mb-2">
                        {file.type === 'video' ? (
                          <video src={file.previewUrl} className="h-full w-full object-cover" />
                        ) : (
                          <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-zinc-900 dark:text-white truncate">{file.name}</p>
                      <span className="text-[10px] text-zinc-400">{file.size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-3 right-3 rounded-md bg-rose-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Post Details & Schedule */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Step 2: Post Details & Targets
            </h2>

            {/* Post Title */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Post Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Behind the Scenes - Team Workshop"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Target Channels
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['instagram', 'linkedin', 'twitter', 'facebook'] as SocialPlatform[]).map((p) => {
                  const isSelected = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                        isSelected
                          ? 'bg-purple-800 text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {p === 'twitter' ? 'X' : p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Caption Copy *
              </label>
              <textarea
                required
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your custom caption, mentions, and hashtags..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Action Timing */}
            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Publishing Action
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { id: 'schedule', label: 'Schedule', icon: Calendar },
                  { id: 'now', label: 'Publish Now', icon: Send },
                  { id: 'draft', label: 'Save Draft', icon: Bookmark },
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setPublishAction(act.id as any)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold transition-all ${
                        publishAction === act.id
                          ? 'border-purple-700 bg-purple-50/60 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>

              {publishAction === 'schedule' && (
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Select Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              )}
            </div>

            <button
              id="btn-submit-manual-upload"
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 text-xs font-bold text-white shadow-md shadow-purple-950/30 hover:bg-purple-700 transition-all active:scale-98"
            >
              <span>Publish / Schedule Manual Post</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

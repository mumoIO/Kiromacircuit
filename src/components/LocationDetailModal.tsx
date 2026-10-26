/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Bookmark,
  BookmarkCheck,
  Navigation,
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Send,
  Sparkles,
  Tag,
  User as UserIcon,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Camera,
  MessageCircle,
} from 'lucide-react';
import { HotelLocation, EateryReview } from '../types';
import { User } from 'firebase/auth';
import CameraPhotoUploader from './CameraPhotoUploader';

// Official Twitter / X Glyph Icon
function TwitterXIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Official WhatsApp Glyph Icon
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.511 2 2.016 6.496 2.016 12.016c0 1.94.555 3.754 1.517 5.29L2 22l4.857-1.498c1.477.893 3.208 1.414 5.174 1.414 5.52 0 10.016-4.496 10.016-10.016S17.551 2 12.031 2zm5.836 14.199c-.244.686-1.218 1.309-1.996 1.473-.531.112-1.226.202-3.558-.764-2.981-1.236-4.908-4.28-5.056-4.478-.148-.198-1.206-1.606-1.206-3.064 0-1.458.764-2.176 1.036-2.471.272-.295.594-.369.792-.369.198 0 .396.002.57.01.184.009.432-.07.676.516.25.602.855 2.086.93 2.24.075.154.125.334.025.533-.1.199-.15.323-.298.497-.148.174-.312.389-.446.522-.148.148-.303.31-.13.608.173.298.77 1.268 1.65 2.052 1.134 1.01 2.089 1.323 2.386 1.472.297.149.471.124.645-.075.174-.199.744-.868.942-1.166.198-.298.396-.248.67-.149.274.099 1.734.818 2.031.967.297.149.495.223.57.347.075.124.075.72-.169 1.406z" />
    </svg>
  );
}

interface LocationDetailModalProps {
  location: HotelLocation | null;
  onClose: () => void;
  onSaveToDrive: (loc: HotelLocation) => void;
  isSaved: boolean;
  currentUser?: User | null;
  reviews?: EateryReview[];
  onAddReview?: (review: Omit<EateryReview, 'id' | 'date'>) => void;
}

export default function LocationDetailModal({
  location,
  onClose,
  onSaveToDrive,
  isSaved,
  currentUser,
  reviews = [],
  onAddReview,
}: LocationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  // Review form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>(currentUser?.displayName || '');
  const [comment, setComment] = useState<string>('');
  const [selectedDish, setSelectedDish] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fast Service', 'Generous Portion']);
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Sharing states
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCopiedFullPost, setIsCopiedFullPost] = useState<boolean>(false);
  const [customShoutout, setCustomShoutout] = useState<string>('');
  const [showSharePreview, setShowSharePreview] = useState<boolean>(false);
  const [activeSharePlatform, setActiveSharePlatform] = useState<'whatsapp' | 'twitter'>('whatsapp');

  if (!location) return null;

  // Filter reviews for this specific location
  const locationReviews = reviews.filter((r) => r.locationId === location.id);
  const averageRating =
    locationReviews.length > 0
      ? (locationReviews.reduce((acc, r) => acc + r.rating, 0) / locationReviews.length).toFixed(1)
      : '5.0';

  const quickTags = [
    'Fast Service',
    'Generous Portion',
    'Free Supu',
    'Hot Chapatis',
    'Clean Seating',
    'Fresh Kachumbari',
    'Friendly Staff',
    'Open Late',
  ];

  const ratingDescriptions: Record<number, string> = {
    1: 'Poor / Bad Experience',
    2: 'Fair / Could Be Better',
    3: 'Good 100 Bob Value 👍',
    4: 'Very Good & Fresh 😋',
    5: 'Legendary Kibanda! 🔥',
  };

  const getShareableUrl = () => {
    if (typeof window === 'undefined') return '';
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('spot', location.id);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  // Generate customized Twitter / X tweet text with location details
  const getTwitterPostText = () => {
    const shoutoutPrefix = customShoutout.trim() ? `"${customShoutout.trim()}" — ` : '';
    return `${shoutoutPrefix}Found an authentic 100 Bob meal at ${location.name} in ${location.neighborhood}, ${location.city}! 🍽️🇰🇪\n\n🍲 Signature: ${location.signatureMeal} (${location.signaturePrice} KSh)\n📍 Landmark: ${location.landmark}\n\n#100BobMeals #KenyanStreetFood #NairobiEats`;
  };

  // Generate formatted WhatsApp message with emojis, bold headers, and key details
  const getWhatsAppMessageText = () => {
    const note = customShoutout.trim() ? `💬 *My Recommendation:* "${customShoutout.trim()}"\n\n` : '';
    const till = location.mpesaTill ? `💳 *Lipa Na M-Pesa Till:* ${location.mpesaTill}\n` : '';
    const shareUrl = getShareableUrl();
    return `*100-MEAL KENYA SPOT FIND!* 🍽️🇰🇪\n\n${note}Hey! Check out *${location.name}* in ${location.neighborhood}, ${location.city}.\n\n🍲 *Signature Meal:* ${location.signatureMeal}\n💰 *Price:* ${location.signaturePrice} KSh (strictly 100 Bob or less!)\n📍 *Landmark:* ${location.landmark}\n⏰ *Hours:* ${location.hours.monFri}\n${till}📞 *Phone:* ${location.phone}\n\n👉 *View map, reviews & menu:*\n${shareUrl}`;
  };

  // Generate intent URLs for direct browser / app redirection
  const getTwitterShareUrl = () => {
    const text = getTwitterPostText();
    const shareUrl = getShareableUrl();
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  };

  const getWhatsAppShareUrl = () => {
    const text = getWhatsAppMessageText();
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const shareText = `Twendeni kula! Check out ${location.name} in ${location.neighborhood}, ${location.city}. Signature meal: ${location.signatureMeal} for only ${location.signaturePrice} KSh! #100BobMeals`;

  // Trigger Native Web Share or fallback to copy
  const handleShare = async () => {
    const shareUrl = getShareableUrl();
    const shareData = {
      title: `${location.name} — 100 Bob Meals Kenya`,
      text: getTwitterPostText(),
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully via device share!');
        setTimeout(() => setShareFeedback(null), 3500);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Web Share API error, using fallback:', err);
      }
    }

    // Fallback: Copy link and message to clipboard
    handleCopyLink();
  };

  // Copy shareable link directly to clipboard
  const handleCopyLink = async () => {
    const shareUrl = getShareableUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setIsCopied(true);
        setShareFeedback('✓ Direct invitation link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2500);
        setTimeout(() => setShareFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Copy full social media formatted post text (for Instagram, Facebook, or manual paste)
  const handleCopyFullPost = async (platform: 'whatsapp' | 'twitter') => {
    const textToCopy = platform === 'whatsapp' ? getWhatsAppMessageText() : `${getTwitterPostText()}\n${getShareableUrl()}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopiedFullPost(true);
        setShareFeedback(`✓ Full ${platform === 'whatsapp' ? 'WhatsApp' : 'Twitter / X'} message copied!`);
        setTimeout(() => setIsCopiedFullPost(false), 2500);
        setTimeout(() => setShareFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Failed to copy full post:', err);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (onAddReview) {
      onAddReview({
        locationId: location.id,
        userName: userName.trim() || currentUser?.displayName || 'Anonymous Diner',
        userAvatar: currentUser?.photoURL || undefined,
        rating,
        comment: comment.trim(),
        favoriteDish: selectedDish || location.signatureMeal,
        tags: selectedTags,
        photoUrl: reviewPhoto || undefined,
      });
    }

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setComment('');
      setReviewPhoto(null);
      setActiveTab('reviews');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#0C1E17] max-h-[92vh] overflow-y-auto border border-emerald-900/10">
        {/* Top Header Actions (Share & Close) */}
        <div className="absolute top-6 right-6 flex items-center gap-1.5 sm:gap-2">
          {/* Quick WhatsApp Share */}
          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            title="Post this 100 Bob meal find to WhatsApp"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-[#25D366] text-[#00843D] hover:text-white border border-emerald-200 transition-all active:scale-95 shadow-sm text-xs font-bold"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Quick Twitter / X Share */}
          <a
            href={getTwitterShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            title="Post this 100 Bob meal find to Twitter / X"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-black text-[#00843D] hover:text-white border border-emerald-200 transition-all active:scale-95 shadow-sm text-xs font-bold"
          >
            <TwitterXIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tweet</span>
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            title="Close modal"
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Header */}
        <div className="mb-4 pr-24">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{location.status}</span>
            </span>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-[#F5BA13] text-[#F5BA13]" />
              <span>{averageRating}</span>
              <span className="text-gray-500">({locationReviews.length} reviews)</span>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#0C1E17] tracking-tight">
            {location.name}
          </h3>
          <p className="text-sm font-bold text-[#00843D]">
            {location.neighborhood}, {location.city}
          </p>
        </div>

        {/* Eatery / Dish Photo if available */}
        {location.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-5 border border-emerald-200 bg-gray-100 shadow-sm">
            <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#F5BA13]" />
              <span>{location.signatureMeal}</span>
            </div>
          </div>
        )}

        {/* Share Feedback Toast */}
        {shareFeedback && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00843D] flex-shrink-0" />
              <span>{shareFeedback}</span>
            </div>
            <button
              onClick={() => setShareFeedback(null)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tabs: Info vs Reviews */}
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'info'
                ? 'border-[#00843D] text-[#00843D]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <span>Overview & Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-[#00843D] text-[#00843D]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Reviews ({locationReviews.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & MENU */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Address and Details */}
            <div className="space-y-4 text-sm bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200">
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                  Exact Address
                </div>
                <p className="font-bold text-gray-900">{location.address}</p>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                  <span>Landmark: {location.landmark}</span>
                </p>
              </div>

              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                  Operating Hours
                </div>
                <div className="text-xs font-semibold text-gray-700 space-y-0.5">
                  <div>Mon–Fri: {location.hours.monFri}</div>
                  <div>Saturday: {location.hours.sat}</div>
                  <div>Sunday: {location.hours.sun}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                  Contact & Phone
                </div>
                <a
                  href={`tel:${location.phone}`}
                  className="font-bold text-gray-900 hover:text-[#00843D] flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-[#00843D]" />
                  <span>{location.phone}</span>
                </a>
              </div>

              {location.mpesaTill && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
                    Lipa Na M-Pesa Buy Goods Till
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-sm">
                      {location.mpesaTill}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">
                      Instant cashless payment
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Signature 100 Bob Special */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
                ⭐ Featured 100 Bob Meal
              </div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-gray-900">
                  {location.signatureMeal}
                </span>
                <span className="text-2xl font-black text-[#00843D]">
                  {location.signaturePrice} KSh
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1 font-medium">
                Strictly under 100 Bob threshold. Never frozen, freshly cooked.
              </div>
            </div>

            {/* Social Media Share / Post 100 Bob Find Section */}
            <div className="bg-[#F8F9F5] p-4 sm:p-5 rounded-2xl border border-emerald-200/90 space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00843D] text-white flex items-center justify-center">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                      Post This 100 Bob Find
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Instantly share to Twitter / X, WhatsApp & lunch groups
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black uppercase bg-[#25D366] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <WhatsAppIcon className="w-2.5 h-2.5" /> WhatsApp
                  </span>
                  <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TwitterXIcon className="w-2.5 h-2.5" /> X
                  </span>
                </div>
              </div>

              {/* Optional Custom Note / Foodie Shoutout */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-700">
                  Personal recommendation or note (optional):
                </label>
                <input
                  type="text"
                  value={customShoutout}
                  onChange={(e) => setCustomShoutout(e.target.value)}
                  placeholder="e.g. Best chapo in town! Ask for extra meat soup splash..."
                  className="w-full bg-white border border-gray-300 focus:border-[#00843D] focus:ring-1 focus:ring-[#00843D] rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-all"
                />
              </div>

              {/* Primary Instant Share Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* 1. Post to Twitter / X */}
                <a
                  href={getTwitterShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-extrabold tracking-wide transition-all shadow-md active:scale-95 text-center group"
                >
                  <TwitterXIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Post to Twitter / X</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 ml-0.5" />
                </a>

                {/* 2. Post to WhatsApp */}
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-extrabold tracking-wide transition-all shadow-md active:scale-95 text-center group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Send on WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-white/70 ml-0.5" />
                </a>
              </div>

              {/* Secondary Actions (Copy Link, Copy Full Post, Device Share) */}
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                {/* Copy Formatted Post Button */}
                <button
                  type="button"
                  onClick={() => handleCopyFullPost(activeSharePlatform)}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  {isCopiedFullPost ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>{isCopiedFullPost ? 'Post Copied!' : 'Copy Formatted Text'}</span>
                </button>

                {/* Direct Link Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>{isCopied ? 'Link Copied!' : 'Copy Link Only'}</span>
                </button>

                {/* Native Device Share Sheet */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-all active:scale-95 border border-emerald-300"
                  title="More sharing options"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#00843D]" />
                  <span>More Apps</span>
                </button>
              </div>

              {/* Toggle Live Social Post Preview */}
              <div className="pt-1 border-t border-gray-200/80">
                <button
                  type="button"
                  onClick={() => setShowSharePreview(!showSharePreview)}
                  className="text-[11px] font-bold text-[#00843D] hover:underline flex items-center gap-1"
                >
                  <span>{showSharePreview ? 'Hide Post Preview' : '👁️ View Live Post Preview (WhatsApp / X)'}</span>
                </button>

                {showSharePreview && (
                  <div className="mt-2.5 p-3 rounded-xl bg-white border border-gray-200 text-xs space-y-2 animate-fade-in shadow-inner">
                    {/* Platform Selector */}
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <span className="text-[10px] font-black uppercase text-gray-400">Preview For:</span>
                      <button
                        type="button"
                        onClick={() => setActiveSharePlatform('whatsapp')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                          activeSharePlatform === 'whatsapp'
                            ? 'bg-[#25D366] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <WhatsAppIcon className="w-3 h-3" />
                        <span>WhatsApp Message</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSharePlatform('twitter')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                          activeSharePlatform === 'twitter'
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <TwitterXIcon className="w-3 h-3" />
                        <span>Twitter / X Tweet</span>
                      </button>
                    </div>

                    {/* Preview Box */}
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 font-sans text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                      {activeSharePlatform === 'whatsapp' ? getWhatsAppMessageText() : getTwitterPostText()}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                      <span>Live format generated with {location.name} details</span>
                      <button
                        type="button"
                        onClick={() => handleCopyFullPost(activeSharePlatform)}
                        className="text-[#00843D] font-bold hover:underline"
                      >
                        Copy this text
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Community Review Highlight */}
            {locationReviews.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-gray-500">
                    Latest Diner Review
                  </span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-[#00843D] font-bold hover:underline"
                  >
                    See all ({locationReviews.length}) →
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= locationReviews[0].rating
                            ? 'fill-[#F5BA13] text-[#F5BA13]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {locationReviews[0].userName}
                  </span>
                </div>
                <p className="text-xs text-gray-600 italic">
                  &quot;{locationReviews[0].comment}&quot;
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Navigation className="w-4 h-4 text-[#F5BA13]" />
                  <span>Directions</span>
                </a>

                <a
                  href={`tel:${location.phone}`}
                  className="py-3 px-4 rounded-xl bg-[#00843D] hover:bg-[#006e33] text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Joint</span>
                </a>
              </div>

              <button
                onClick={() => onSaveToDrive(location)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border transition-all ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#00843D]" />
                    <span>Saved in Your Google Drive List</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-[#00843D]" />
                    <span>Bookmark & Sync to Google Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REVIEWS SYSTEM */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* 1. Review Submission Form */}
            <div className="bg-[#F8F9F5] p-5 sm:p-6 rounded-2xl border border-gray-200">
              <h4 className="text-base font-black text-[#0C1E17] mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00843D]" />
                <span>Rate & Review this 100 Bob Eatery</span>
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Share your experience, portion size, and insider tips with fellow budget diners.
              </p>

              {reviewSubmitted ? (
                <div className="py-6 px-4 text-center text-emerald-800 bg-emerald-50 rounded-2xl border border-emerald-200 animate-scale-up space-y-3">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                  <div className="font-extrabold text-sm sm:text-base">Asante sana for your review!</div>
                  <div className="text-xs text-emerald-700">
                    Your {rating}★ rating and tips have been published to the community board.
                  </div>
                  {/* Share Newly Published Review to Social Media */}
                  <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `I just left a ${rating}★ review for *${location.name}* on 100-Meal Kenya!\n\n🍲 Signature: ${location.signatureMeal} (${location.signaturePrice} KSh) in ${location.neighborhood}, ${location.city}.\n\nCheck out the spot:\n${getShareableUrl()}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20ba5a] transition-transform active:scale-95"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Share on WhatsApp</span>
                    </a>

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Just gave ${rating}★ to ${location.name} on 100-Meal Kenya! 🍽️ Signature dish: ${location.signatureMeal} (${location.signaturePrice} KSh) in ${location.neighborhood}. #100BobMeals #KenyanStreetFood`
                      )}&url=${encodeURIComponent(getShareableUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black text-white text-xs font-bold shadow-sm hover:bg-neutral-800 transition-transform active:scale-95"
                    >
                      <TwitterXIcon className="w-3.5 h-3.5" />
                      <span>Post to Twitter / X</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star Rating Interactive Selector */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = star <= (hoverRating || rating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                className={`w-7 h-7 ${
                                  isFilled
                                    ? 'fill-[#F5BA13] text-[#F5BA13]'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-xs font-extrabold text-[#00843D] ml-2">
                        {ratingDescriptions[hoverRating || rating]}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Mwangi J., Campus Diner"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                    />
                  </div>

                  {/* Camera Photo Capture for Review */}
                  <CameraPhotoUploader
                    label="Snap a Photo of Your 100 Bob Plate"
                    hint="Show fellow diners what the portion looks like! Snap live or upload."
                    photoUrl={reviewPhoto}
                    onPhotoChange={setReviewPhoto}
                  />

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Short Review & Tips *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was the food? Was it fresh? Any insider tip like asking for sababisha broth?..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                    />
                  </div>

                  {/* Quick Praise Tags */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                      Highlights & Tags:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {quickTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all border ${
                              isSelected
                                ? 'bg-[#00843D] text-white border-[#00843D]'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}
            </div>

            {/* 2. Existing Reviews List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-wider text-gray-700">
                  Diner Reviews ({locationReviews.length})
                </h4>
                <div className="text-xs text-gray-500 font-semibold">
                  Average Rating: <strong>{averageRating} / 5</strong>
                </div>
              </div>

              {locationReviews.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-500">
                  No reviews yet for this spot. Be the first to rate it above!
                </div>
              ) : (
                <div className="space-y-3.5">
                  {locationReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2 text-xs"
                    >
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">
                              {rev.userName}
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium">
                              Reviewed on {rev.date} • <span className="text-[#00843D] font-bold">Verified 100 Bob Diner</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? 'fill-[#F5BA13] text-[#F5BA13]'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-gray-700 leading-relaxed font-medium pt-1">
                        &quot;{rev.comment}&quot;
                      </p>

                      {/* Attached Meal Photo */}
                      {rev.photoUrl && (
                        <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-48 my-2 border border-emerald-500/20 bg-gray-900">
                          <img
                            src={rev.photoUrl}
                            alt="Diner meal photo"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#F5BA13]" />
                            <span>Photo by {rev.userName}</span>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {rev.tags && rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {rev.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold border border-emerald-200/50"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

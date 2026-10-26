/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, PlusCircle, CheckCircle2, MapPin, DollarSign, Cloud, Sparkles, Camera } from 'lucide-react';
import { HotelLocation } from '../types';
import CameraPhotoUploader from './CameraPhotoUploader';

interface SubmitSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSpot: (newSpot: Omit<HotelLocation, 'id'>) => void;
  userEmail?: string;
  hasGoogleDrive: boolean;
}

export default function SubmitSpotModal({
  isOpen,
  onClose,
  onSubmitSpot,
  hasGoogleDrive,
}: SubmitSpotModalProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState<'Nairobi' | 'Mombasa' | 'Kisumu' | 'Nakuru' | 'Eldoret'>('Nairobi');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [signatureMeal, setSignatureMeal] = useState('');
  const [signaturePrice, setSignaturePrice] = useState<number>(80);
  const [phone, setPhone] = useState('');
  const [mpesaTill, setMpesaTill] = useState('');
  const [monFriHours, setMonFriHours] = useState('6:30 AM – 9:00 PM');
  const [spotPhoto, setSpotPhoto] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (signaturePrice > 100) {
      alert('Maximum price must be 100 KSh or under for 100-Meal spots!');
      return;
    }

    const newLoc: Omit<HotelLocation, 'id'> = {
      name,
      city,
      neighborhood: neighborhood || city,
      address,
      landmark: landmark || 'Near town stage',
      signatureMeal,
      signaturePrice,
      hours: {
        monFri: monFriHours,
        sat: '7:00 AM – 8:30 PM',
        sun: '8:00 AM – 6:00 PM',
      },
      phone: phone || '+254 700 000 000',
      email: 'community@100kshmeals.co.ke',
      mpesaTill: mpesaTill || undefined,
      status: 'OPEN NOW',
      lat: -1.286389,
      lng: 36.817223,
      mapEmbedQuery: `${encodeURIComponent(address + ' ' + city + ' Kenya')}`,
      hygieneCertified: true,
      seatingCapacity: 25,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address + ' ' + city)}`,
      imageUrl: spotPhoto || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    };

    onSubmitSpot(newLoc);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset
      setName('');
      setNeighborhood('');
      setAddress('');
      setLandmark('');
      setSignatureMeal('');
      setSignaturePrice(80);
      setPhone('');
      setMpesaTill('');
      setSpotPhoto(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#0C1E17] max-h-[90vh] overflow-y-auto border border-emerald-900/10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00843D] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Spot Added Successfully!</h3>
            <p className="text-sm text-gray-600">
              Asante sana! Your submitted 100 Bob spot with photo is now visible in the directory and can be saved to Google Drive.
            </p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00843D] text-xs font-black uppercase mb-3 border border-emerald-200">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Community Spot Discovery</span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Pawa A Kibanda (Submit 100 Bob Spot)
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Know a hidden gem or kibanda in Kenya serving great food under 100 KSh? Share it with the community!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Camera Photo Capture Field */}
              <CameraPhotoUploader
                label="Snap a Photo of the Eatery or Meal"
                hint="Capture a live photo using your camera or choose an image."
                photoUrl={spotPhoto}
                onPhotoChange={setSpotPhoto}
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Kibanda / Joint Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mama Oliech Madondo Corner"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    City / Town *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Eldoret">Eldoret</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Neighborhood / Estate *
                  </label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. River Road, South B, Fig Tree"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Tom Mboya St, Behind Odeon stage"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Signature Meal under 100 KSh *
                  </label>
                  <input
                    type="text"
                    required
                    value={signatureMeal}
                    onChange={(e) => setSignatureMeal(e.target.value)}
                    placeholder="e.g. 2 Chapos + Ndengu"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Price (KSh - Max 100 Bob) *
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={100}
                    required
                    value={signaturePrice}
                    onChange={(e) => setSignaturePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-black text-[#00843D] focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Phone / Contact (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    M-Pesa Buy Goods Till (Optional)
                  </label>
                  <input
                    type="text"
                    value={mpesaTill}
                    onChange={(e) => setMpesaTill(e.target.value)}
                    placeholder="e.g. 842199"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                  />
                </div>
              </div>

              {hasGoogleDrive && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
                  <Cloud className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                  <span>This spot can be automatically synced to your Google Drive bookmarks.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white font-black text-sm uppercase tracking-wider transition-all shadow-md mt-4 active:scale-98"
              >
                Submit 100 Bob Spot
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

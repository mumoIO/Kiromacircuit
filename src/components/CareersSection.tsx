/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Clock, MapPin, ArrowRight, CheckCircle2, X, Briefcase, UserCheck } from 'lucide-react';
import { JOB_OPENINGS } from '../data/mealsAndLocations';
import { JobOpening } from '../types';

export default function CareersSection() {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [submittedJob, setSubmittedJob] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredBranch, setPreferredBranch] = useState('Nairobi CBD');
  const [experience, setExperience] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmittedJob(selectedJob.title);
    setTimeout(() => {
      setSelectedJob(null);
      setFullName('');
      setPhone('');
      setEmail('');
      setExperience('');
    }, 1800);
  };

  return (
    <section id="careers" className="py-20 bg-[#F8F9F5] text-[#0C1E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#00843D]" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-emerald-800">
              JOIN OUR TEAM
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0C1E17]">
            Join <span className="text-[#00843D]">100-Meal</span>
          </h2>

          <p className="mt-3 text-lg text-gray-600 font-medium">
            We&apos;re looking for reliable, hardworking people ready to grow with us.
          </p>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00843D]" />
              <span className="text-xs font-black tracking-widest uppercase text-emerald-800">
                OPENINGS BY LOCATION
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0C1E17]">
              Choose A <span className="text-[#00843D]">Role</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto font-medium">
              Find a branch near you and start your culinary career journey with the 100-Meal family today.
            </p>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOB_OPENINGS.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-7 shadow-lg border border-gray-200 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200"
            >
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight text-[#0C1E17] mb-4">
                  {job.title}
                </h4>

                <div className="space-y-2 mb-5 text-xs text-gray-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-6 font-medium line-clamp-4">
                  {job.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="w-full py-3.5 px-6 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#0C1E17] max-h-[90vh] overflow-y-auto border border-emerald-900/10">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedJob ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Application Received!</h3>
                <p className="text-sm text-gray-600">
                  Asante sana! Our branch operations manager will reach out via WhatsApp/Phone ({phone || 'provided number'}) within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00843D] text-xs font-black uppercase mb-3 border border-emerald-200">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Job Application</span>
                </div>

                <h3 className="text-2xl font-black text-gray-900">
                  Apply for {selectedJob.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  {selectedJob.location} • {selectedJob.type}
                </p>

                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Brian Mwangi"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="brian@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Preferred Branch Location
                    </label>
                    <select
                      value={preferredBranch}
                      onChange={(e) => setPreferredBranch(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                    >
                      <option>Nairobi CBD — Fire Station</option>
                      <option>Ngara — Fig Tree</option>
                      <option>Westlands — Mpaka Rd</option>
                      <option>Eastleigh — 1st Ave</option>
                      <option>Mombasa — Old Town Kibokoni</option>
                      <option>Kisumu — Oile Park</option>
                      <option>Nakuru — Section 58</option>
                      <option>Eldoret — Zion Mall</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Previous Food, Service, or Hustle Experience
                    </label>
                    <textarea
                      rows={3}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Tell us briefly about any food handling, cashier, chapo cooking, or customer service experience..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md mt-4 active:scale-98"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { B2BProject } from '../types';
import { 
  Building2, 
  Hotel, 
  Compass, 
  CheckCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';

export const B2BPortal: React.FC = () => {
  const { b2bProjects, submitB2BRFP, advanceB2BMilestone } = useApp();

  // RFP Form State
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState<B2BProject['projectType']>('Luxury Hotel / Resort');
  const [scope, setScope] = useState('');
  const [estimatedUnits, setEstimatedUnits] = useState(25);
  const [budgetUSD, setBudgetUSD] = useState(45000);
  const [showRfpSuccess, setShowRfpSuccess] = useState(false);

  // Selected Active Project View
  const [selectedProjectId, setSelectedProjectId] = useState<string>(b2bProjects[0]?.id || '');

  const activeProject = b2bProjects.find(p => p.id === selectedProjectId) || b2bProjects[0];

  const handleRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !contactName || !email) return;

    submitB2BRFP({
      organizationName: orgName,
      contactPerson: contactName,
      email,
      projectType,
      scopeDescription: scope,
      estimatedUnits,
      budgetUSD
    });

    setShowRfpSuccess(true);
    setOrgName('');
    setContactName('');
    setEmail('');
    setScope('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      
      {/* Enterprise Header */}
      <section className="bg-[#1C1917] text-white border-b border-[#38332E] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#F59E0B] font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Architectural & Hospitality Procurement</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              B2B Guild Commissions & Heritage Procurement
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#D6D3D1] font-light leading-relaxed">
              Equip luxury resorts, private villas, corporate collections, and diplomatic embassies with 
              authentic Newari architectural woodwork, monumental lost-wax bronze installations, and hand-loomed textiles. 
              Protected by Shilpaya’s sovereign <strong>50/50 Milestone Billing Protocol</strong>.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[#A8A29E] pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F59E0B]" />
                <span>50% Upfront Guild Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F59E0B]" />
                <span>50% Post-QC Kathmandu Hub Release</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F59E0B]" />
                <span>Tamper-Evident Hologram Seals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: RFP Form & Active Project Milestone Tracker */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 1: Milestone Billing System Overview */}
        <section className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-semibold text-[#B45309] uppercase tracking-wider mb-1">
              Escrow Governance
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
              The 50/50 Sovereign Milestone Billing Protocol
            </h2>
            <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
              Protects institutional buyers and traditional artisan guilds against currency volatility, raw material price surges, and quality defects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-[#1C1917]">Stage 1: 50% Upfront Escrow Deposit</span>
                <span className="font-mono text-xs font-bold text-[#B45309] bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  Deposit 50%
                </span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Paid into Shilpaya Institutional Escrow upon prototype and architectural drafting approval. Unlocks advance funds for aged Himalayan Sal wood procurement, virgin copper ingots, and 24K gold foil allocation.
              </p>
              <ul className="text-xs text-[#78716C] space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Artisan master contracts locked in Patan & Bhaktapur</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bi-weekly photo/video craft milestone briefings</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-[#1C1917]">Stage 2: 50% Post-QC Kathmandu Hub Settlement</span>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Balance 50%
                </span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Settled only after finished items pass physical inspection at the central Kathmandu Heritage Vault, complete with spectrometer metal assay, timber moisture verification (&lt;12%), and tamper-proof hologram seals.
              </p>
              <ul className="text-xs text-[#78716C] space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>FHAN Lab assay certificate stamped & issued</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dispatched via insured diplomatic or commercial air freight</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: Active B2B Projects & Milestone Progress Visualizer */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#B45309] uppercase tracking-wider mb-1">
                Live Procurement Tracking
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                Active Enterprise Project Dossiers
              </h2>
            </div>

            {/* Project Selector */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {b2bProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap cursor-pointer transition-colors ${
                    p.id === activeProject?.id
                      ? 'bg-[#1C1917] text-white'
                      : 'bg-white text-[#57534E] border border-[#E7E2D9] hover:bg-stone-50'
                  }`}
                >
                  {p.organizationName.split(' ')[0]} ({p.id.toUpperCase()})
                </button>
              ))}
            </div>
          </div>

          {activeProject && (
            <div className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs space-y-8">
              
              {/* Project Header Info */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#F5F2EB]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
                    <span className="font-mono font-bold text-[#1C1917]">{activeProject.id.toUpperCase()}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#B45309]">{activeProject.projectType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Submitted {activeProject.submittedAt}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                    {activeProject.organizationName}
                  </h3>
                  <p className="text-xs text-[#57534E] mt-1">
                    Contact: {activeProject.contactPerson} ({activeProject.email})
                  </p>
                  <p className="text-xs text-[#57534E] mt-2 max-w-2xl leading-relaxed">
                    Scope: {activeProject.scopeDescription}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <div className="text-xs text-[#78716C]">Total Contract Budget</div>
                  <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums">
                    ${activeProject.budgetUSD.toLocaleString()} USD
                  </div>
                  <div className="text-xs text-[#78716C]">
                    Volume: <strong className="text-[#1C1917]">{activeProject.estimatedUnits} Consecrated Units</strong>
                  </div>

                  {activeProject.currentMilestone < 5 && (
                    <button
                      onClick={() => advanceB2BMilestone(activeProject.id)}
                      className="mt-2 px-3 py-1.5 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Simulate Next Stage Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 5-Stage Milestone Billing Pipeline */}
              <div>
                <h4 className="font-serif text-base font-bold text-[#1C1917] mb-6">
                  Milestone Execution & Payment Gateway
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {activeProject.milestones.map((ms, idx) => {
                    const isDone = ms.status === 'completed';
                    const isCurrent = ms.status === 'in_progress';
                    return (
                      <div
                        key={ms.stageNumber}
                        className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                          isDone 
                            ? 'bg-emerald-50/50 border-emerald-300' 
                            : isCurrent 
                            ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/20 shadow-xs' 
                            : 'bg-stone-50/60 border-stone-200 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-mono font-bold text-[11px] text-[#78716C]">
                              STAGE 0{ms.stageNumber}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              isDone ? 'bg-emerald-200 text-emerald-900' :
                              isCurrent ? 'bg-amber-200 text-amber-900' :
                              'bg-stone-200 text-stone-700'
                            }`}>
                              {ms.status.replace('_', ' ')}
                            </span>
                          </div>

                          <h5 className="font-serif text-sm font-bold text-[#1C1917] leading-snug">
                            {ms.title}
                          </h5>

                          <p className="mt-2 text-[11px] text-[#57534E] leading-relaxed">
                            {ms.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-200 text-[10px] text-[#78716C]">
                          <div className="font-semibold text-[#1C1917]">Gate Requirement:</div>
                          <div>{ms.paymentRequirement}</div>
                          {ms.completionDate && (
                            <div className="text-emerald-700 font-medium mt-0.5">
                              Completed {ms.completionDate}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </section>

        {/* SECTION 3: Request for Proposal (RFP) Form */}
        <section className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs max-w-4xl mx-auto">
          <div className="border-b border-[#F5F2EB] pb-4 mb-6">
            <div className="text-xs font-semibold text-[#B45309] uppercase tracking-wider mb-1">
              Institutional Commission Dossier
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
              Submit Request for Proposal (RFP)
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              For hospitality developments, luxury boutique retreats, diplomatic embassies, and cultural collections.
            </p>
          </div>

          {showRfpSuccess ? (
            <div className="p-8 text-center bg-emerald-50 rounded border border-emerald-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-950">
                Institutional RFP Received
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your dossier has been registered in the B2B pipeline. A senior curator from the Kathmandu Hub will prepare a master artisan allocation matrix and milestone draft within 24 hours.
              </p>
              <button
                onClick={() => setShowRfpSuccess(false)}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleRfpSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Organization / Resort Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shangri-La Mountain Retreat, Pokhara"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Contact Person Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Shrestha, Chief of Design"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Project Typology
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none bg-white"
                  >
                    <option value="Luxury Hotel / Resort">Luxury Hotel / Resort</option>
                    <option value="Boutique Residence">Boutique Residence</option>
                    <option value="Embassy / Diplomatic Mission">Embassy / Diplomatic Mission</option>
                    <option value="Corporate Gallery">Corporate Gallery</option>
                    <option value="Museum Acquisition">Museum Acquisition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Estimated Masterwork Units
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={estimatedUnits}
                    onChange={(e) => setEstimatedUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Estimated Total Budget ($ USD)
                </label>
                <div className="relative max-w-sm">
                  <input
                    type="number"
                    step={1000}
                    min={5000}
                    value={budgetUSD}
                    onChange={(e) => setBudgetUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none font-mono"
                  />
                  <div className="text-[11px] text-[#78716C] mt-1 flex justify-between">
                    <span>50% Milestone Deposit: ${(budgetUSD * 0.5).toLocaleString()}</span>
                    <span>Final QC Settlement: ${(budgetUSD * 0.5).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Project Architectural Scope & Material Specifications
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail requirements: e.g. 18 hand-carved Newari Sal-wood peacock lattice windows, 4 monumental lost-wax bronze Shakyamuni statues, custom Dhaka textile runners..."
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Submit Institutional RFP Dossier</span>
                </button>
              </div>
            </form>
          )}
        </section>

      </div>

    </div>
  );
};

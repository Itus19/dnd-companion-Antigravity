'use client';
import React, { useState } from 'react';
import { X, Download, Upload, Plus, Trash2, Palette, ShieldAlert } from 'lucide-react';
import { WikiCategory } from '../types';

interface CustomCategory {
  id: string;
  label: string;
  color: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onChangeTheme: (theme: string) => void;
  pages: any[];
  onImportCampaign: (importedPages: any[]) => void;
  customCategories: CustomCategory[];
  onAddCustomCategory: (label: string, color: string) => void;
  onDeleteCustomCategory: (id: string) => void;
  onResetToDefault?: () => void;
}

const PRESET_COLORS = [
  '#f5b014', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
  '#06b6d4', '#84cc16', '#eab308', '#f97316', '#64748b', '#a1a1aa'
];

export default function SettingsModal({
  isOpen, onClose, theme, onChangeTheme, pages,
  onImportCampaign, customCategories, onAddCustomCategory, onDeleteCustomCategory,
  onResetToDefault
}: SettingsModalProps) {
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[0]);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('dnd_companion_api_key') || '';
    return '';
  });

  if (!isOpen) return null;

  // Export JSON
  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pages, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `campagne-codex-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Erreur lors de l'exportation : " + e);
    }
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportCampaign(parsed);
          alert("Campagne importée avec succès !");
          onClose();
        } else {
          alert("Format de fichier invalide. Il doit s'agir d'un tableau JSON d'articles.");
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier JSON : " + err);
      }
    };
    reader.readAsText(file);
  };

  // Add custom category
  const handleAddCat = () => {
    if (!newCatLabel.trim()) return;
    onAddCustomCategory(newCatLabel.trim(), newCatColor);
    setNewCatLabel('');
  };

  // Save API Key
  const handleSaveApiKey = (val: string) => {
    setApiKey(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dnd_companion_api_key', val.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[150] p-4 select-none">
      <div className="settings-modal-panel w-full max-w-2xl bg-[#0b0c10]/98 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gold-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Configuration du Codex</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Theme selection */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Thème Visuel (Inspiré de vvd.world)</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'slate', label: '1. Forêt Obscure', desc: 'Très Sombre' },
                { id: 'default', label: '2. Dusk Doré', desc: 'Sombre' },
                { id: 'neon', label: '3. Cimes Bleues', desc: 'Intermédiaire' },
                { id: 'grimoire', label: '4. Vallée Lumineuse', desc: 'Clair' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => onChangeTheme(t.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    theme === t.id 
                       ? 'bg-gold-500/10 border-gold-500 text-gold-500 font-bold shadow-lg' 
                      : 'modal-glass-card text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Custom Categories Manager */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Types de Documents Personnalisés</h3>
            
            {/* Create dynamic category */}
            <div className="flex items-end gap-3 modal-glass-card p-4 rounded-xl">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Nom du type</label>
                <input
                  value={newCatLabel}
                  onChange={e => setNewCatLabel(e.target.value)}
                  placeholder="ex: Objets Magiques, Sorts..."
                  className="w-full bg-dark-950 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-gold-500/50 placeholder-slate-600"
                />
              </div>
              <div className="space-y-1.5 shrink-0">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Couleur</label>
                <div className="flex items-center gap-1.5 modal-glass-card px-2 py-1 rounded-lg">
                  <span className="w-4 h-4 rounded-full border border-black/40" style={{ background: newCatColor }} />
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={e => setNewCatColor(e.target.value)}
                    className="w-5 h-5 opacity-0 absolute cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Palette</span>
                </div>
              </div>
              <button
                onClick={handleAddCat}
                className="flex items-center gap-1 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-dark-950 text-xs font-black rounded-lg transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Créer
              </button>
            </div>

            {/* List Custom categories */}
            <div className="grid grid-cols-2 gap-2">
              {customCategories.length === 0 && (
                <div className="col-span-2 text-xs text-slate-700 italic py-2">Aucun type personnalisé.</div>
              )}
              {customCategories.map(c => (
                <div key={c.id} className="flex items-center gap-2 p-2.5 modal-glass-card rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-slate-300 font-medium flex-1 truncate">{c.label}</span>
                  <button
                    onClick={() => onDeleteCustomCategory(c.id)}
                    className="p-1 text-slate-700 hover:text-red-400 hover:bg-white/3 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Export / Import JSON */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Sauvegarde & Base de Données</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-4 modal-glass-card rounded-xl transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-200">Exporter la Campagne</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sauvegarder tout en JSON</div>
                </div>
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button
                  className="w-full flex items-center justify-center gap-2 p-4 modal-glass-card rounded-xl transition cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-sky-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-200">Importer une Campagne</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Charger un JSON</div>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => {
                  if (confirm("Voulez-vous réinitialiser votre base de données avec la campagne par défaut et les règles D&D 2024 ? Vos modifications actuelles seront écrasées.")) {
                    if (onResetToDefault) onResetToDefault();
                  }
                }}
                className="col-span-2 flex items-center justify-center gap-2 p-3 mt-2 border border-red-950 bg-red-950/10 hover:bg-red-950/20 text-red-400 rounded-xl transition cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-bold">Réinitialiser aux règles D&D 2024 par défaut</span>
              </button>
            </div>
          </div>

          {/* 4. API Key setup for generator */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Clé API Générateur Lore (Optionnel)</h3>
            <div className="modal-glass-card p-4 rounded-xl space-y-2">
              <p className="text-[10px] text-slate-500 leading-normal">
                Insérez votre clé API **Gemini** ou **OpenAI** pour activer de véritables générations textuelles par IA. 
                Si laissé vide, le système génère du contenu de façon procédurale (simulé localement).
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={e => handleSaveApiKey(e.target.value)}
                placeholder="AI API Key (sk-... ou AIzaSy...)"
                className="w-full modal-glass-card text-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500/50 font-mono"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

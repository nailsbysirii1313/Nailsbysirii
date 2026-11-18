import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  Search,
  Sparkles,
  Clock,
  Check,
  Image as ImageIcon
} from 'lucide-react';

export default function CatalogueManagerView({
  designs = [],
  onSaveDesign,
  onDeleteDesign,
  onAddToast
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designToEdit, setDesignToEdit] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [imgErrors, setImgErrors] = useState({});

  const categories = [
    'ALL',
    'Acrylic Nails',
    'BIAB / Builder Gel',
    'Gel-X Extensions',
    'Hand-Painted Art',
    'Bridal & Occasion',
    'Press-On Nails'
  ];

  const shapes = ['Almond', 'Coffin', 'Square', 'Squoval', 'Round', 'Stiletto'];
  const lengths = ['Short', 'Medium', 'Long', 'Extra Long'];
  const finishes = [
    'Natural Gloss',
    'Hailey Glazed Chrome',
    'Velvet Magnetic Cat-Eye',
    'Molten Silver Drips',
    'Pearl Luster',
    'French Minimalist Line'
  ];

  const samplePhotoPresets = [
    { label: 'French Ombré', url: '/catalogue/french-ombre.jpg' },
    { label: 'Glazed Donut', url: '/catalogue/glazed-donut.jpg' },
    { label: 'Milky White', url: '/catalogue/milky-white.jpg' },
    { label: 'Luxe Pearl', url: '/catalogue/luxe-pearl.jpg' },
    { label: 'Soft & Simple', url: '/hero/soft-simple.jpg' },
    { label: 'Little Sparkle', url: '/hero/little-sparkle.jpg' },
    { label: 'Velvet Cat-Eye', url: '/hero/make-statement.jpg' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Acrylic Nails',
    tag: 'Studio Signature',
    desc: '',
    imageUrl: '',
    shape: 'Almond',
    length: 'Medium',
    baseColor: '#E8C5C8',
    finish: 'Natural Gloss',
    durationNum: 90,
    highlightsText: ''
  });

  const handleOpenModal = (design = null) => {
    if (design) {
      setDesignToEdit(design);
      setFormData({
        title: design.title || '',
        category: design.category || 'Acrylic Nails',
        tag: design.tag || '',
        desc: design.desc || '',
        imageUrl: design.imageUrl || '',
        shape: typeof design.shape === 'object' ? design.shape.name : (design.shape || 'Almond'),
        length: typeof design.length === 'object' ? design.length.name : (design.length || 'Medium'),
        baseColor: design.baseColor || (design.base?.hex) || '#E8C5C8',
        finish: typeof design.finish === 'object' ? design.finish.name : (design.finish || 'Natural Gloss'),
        durationNum: design.durationNum || 90,
        highlightsText: (design.highlights || []).join('\n')
      });
    } else {
      setDesignToEdit(null);
      setFormData({
        title: '',
        category: 'Acrylic Nails',
        tag: 'Studio Classic',
        desc: '',
        imageUrl: '',
        shape: 'Almond',
        length: 'Medium',
        baseColor: '#E8C5C8',
        finish: 'Natural Gloss',
        durationNum: 90,
        highlightsText: 'Customized apex reinforcement\nRussian dry e-file prep included\nLong-lasting durability'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (!formData.imageUrl.trim()) {
      alert('Photo Image URL is required. Only image-based designs are published in the catalogue.');
      return;
    }

    const highlights = formData.highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...(designToEdit ? { id: designToEdit.id } : {}),
      title: formData.title.trim(),
      category: formData.category,
      tag: formData.tag.trim(),
      desc: formData.desc.trim(),
      imageUrl: formData.imageUrl.trim(),
      shape: formData.shape,
      length: formData.length,
      baseColor: formData.baseColor,
      finish: formData.finish,
      durationNum: Number(formData.durationNum) || 90,
      highlights
    };

    onSaveDesign(payload);
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the design catalogue?`)) {
      onDeleteDesign(id);
    }
  };

  const filtered = designs.filter((item) => {
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const q = search.trim().toLowerCase();
    if (!q) return matchCat;
    return (
      matchCat &&
      ((item.title || '').toLowerCase().includes(q) ||
        (item.desc || '').toLowerCase().includes(q) ||
        (item.tag || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <BookOpen className="w-3.5 h-3.5 text-brand-wine" />
            <span>Design Catalogue & Lookbook</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Catalogue Lookbook Manager
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Curate signature nail designs visible in the client design booklet. Real-time updates automatically reflect on the public catalogue page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/#catalogue"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-2xl border border-border-subtle bg-studio-surface hover:bg-studio-canvas text-text-secondary text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 min-h-[44px]"
            title="Preview Client Catalogue"
          >
            <span>Preview Client View</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>

          <button
            onClick={() => handleOpenModal(null)}
            className="px-4 py-2.5 rounded-2xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Design</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
                categoryFilter === cat
                  ? 'bg-brand-wine text-white shadow-studio font-bold'
                  : 'bg-studio-surface text-text-secondary border border-border-subtle hover:bg-studio-canvas'
              }`}
            >
              {cat === 'ALL' ? `All Designs (${designs.length})` : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-studio-surface border border-border-subtle rounded-xl text-xs text-text-ink outline-none focus:border-brand-wine min-h-[38px]"
          />
        </div>
      </div>

      {/* Grid of Designs */}
      {filtered.length === 0 ? (
        <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="font-display font-semibold text-lg text-text-ink">
            No Designs in this Category
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Add a signature design to showcase your studio craftsmanship in the client catalogue.
          </p>
          <button
            onClick={() => handleOpenModal(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wineHover shadow-studio min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Design</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const hasImage = Boolean(item.imageUrl && !imgErrors[item.id]);
            const shapeName = typeof item.shape === 'object' ? item.shape.name : item.shape || 'Almond';
            const lengthName = typeof item.length === 'object' ? item.length.name : item.length || 'Medium';

            return (
              <div
                key={item.id}
                className="bg-studio-surface rounded-3xl border border-border-subtle hover:border-brand-wine/40 shadow-xs hover:shadow-studio transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Visual Photography Preview */}
                <div className="relative h-48 bg-studio-canvas overflow-hidden flex items-center justify-center border-b border-border-subtle">
                  <img
                    src={item.imageUrl || '/catalogue/french-ombre.jpg'}
                    alt={item.title}
                    onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    loading="lazy"
                  />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-studio-surface/90 text-brand-wine text-[10px] font-bold border border-border-subtle shadow-xs">
                    {item.category}
                  </span>

                  {item.tag && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-studio-surface/90 text-text-secondary text-[10px] font-semibold border border-border-subtle shadow-xs">
                      {item.tag}
                    </span>
                  )}

                  <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-medium backdrop-blur-xs">
                    {shapeName} • {lengthName}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-base text-text-ink group-hover:text-brand-wine transition-colors leading-snug">
                        {item.title}
                      </h3>
                      {item.durationNum && (
                        <span className="text-[11px] text-text-muted font-medium flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-brand-wine" />
                          ~{item.durationNum}m
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {item.desc || 'No description provided.'}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-border-subtle text-[11px] text-text-secondary">
                        {item.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 truncate">
                            <Check className="w-3 h-3 text-brand-wine shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-brand-wine">
                      Connect for Pricing
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 rounded-xl hover:bg-studio-canvas text-text-muted hover:text-text-ink transition-colors border border-border-subtle min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Edit Design"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors border border-border-subtle min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Delete Design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Design Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-text-ink/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-studio-surface rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-studio border border-border-subtle relative max-h-[92vh] overflow-y-auto font-sans">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-text-muted hover:text-text-ink hover:bg-studio-canvas transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-studio-subtle text-brand-wine text-[11px] font-semibold mb-1 border border-border-subtle">
                <Sparkles className="w-3 h-3 text-brand-wine" />
                <span>{designToEdit ? 'Edit Lookbook Design' : 'Add New Lookbook Design'}</span>
              </div>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-text-ink">
                {designToEdit ? 'Update Design Look' : 'New Signature Design'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Design Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. French Ombré Acrylic Sculpture"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-xs font-medium text-text-ink"
                  >
                    <option value="Acrylic Nails">Acrylic Nails</option>
                    <option value="BIAB / Builder Gel">BIAB / Builder Gel</option>
                    <option value="Gel-X Extensions">Gel-X Extensions</option>
                    <option value="Hand-Painted Art">Hand-Painted Art</option>
                    <option value="Bridal & Occasion">Bridal & Occasion</option>
                    <option value="Press-On Nails">Press-On Nails</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Style Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Studio Classic, Trending"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine text-xs"
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Photo Image URL <span className="text-brand-wine">*</span> <span className="text-[11px] font-normal text-text-muted">(Required — Only image-based designs are published)</span>
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. /catalogue/french-ombre.jpg or https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine text-xs font-mono"
                  />

                  {/* Preset photo shortcuts */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-text-muted uppercase font-bold">Studio Presets:</span>
                    {samplePhotoPresets.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className="px-2 py-0.5 rounded-lg bg-studio-canvas border border-border-subtle text-[10px] text-text-secondary hover:border-brand-wine"
                      >
                        {preset.label}
                      </button>
                    ))}
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="text-[10px] text-rose-600 hover:underline ml-1"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommended Shape & Length */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Shape
                  </label>
                  <select
                    value={formData.shape}
                    onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-xs font-medium"
                  >
                    {shapes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Length
                  </label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-xs font-medium"
                  >
                    {lengths.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="30"
                    step="5"
                    value={formData.durationNum}
                    onChange={(e) => setFormData({ ...formData, durationNum: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Design Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the technique, nail bed transition, or crystal accents..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine text-xs resize-none"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Key Highlights (One per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Seamless pink-and-white blend&#10;Structural apex reinforcement&#10;Russian dry e-file prep"
                  value={formData.highlightsText}
                  onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary text-xs font-semibold hover:bg-studio-canvas min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 min-h-[40px]"
                >
                  {designToEdit ? 'Save Changes' : 'Add Design to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

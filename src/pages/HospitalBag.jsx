import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Trash2, Luggage, Info, Sparkles } from 'lucide-react';
import {
  getHospitalBagItems,
  toggleHospitalBagItem,
  getCustomBagItems,
  addCustomBagItem,
  removeCustomBagItem,
} from '../utils/storage';
import { HOSPITAL_BAG_CATEGORIES, DEFAULT_HOSPITAL_BAG_ITEMS } from '../data/hospitalBagData';
import './HospitalBag.css';

function HospitalBag({ hideBackButton = false }) {
  const navigate = useNavigate();
  const [packedIds, setPackedIds] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('mama');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'packed'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('mama');

  useEffect(() => {
    async function loadData() {
      const [packed, custom] = await Promise.all([
        getHospitalBagItems(),
        getCustomBagItems(),
      ]);
      setPackedIds(packed);
      setCustomItems(custom);
    }
    loadData();
  }, []);

  const allItems = useMemo(() => {
    const customFormatted = customItems.map((ci) => ({
      id: ci.id,
      category: ci.category,
      title: ci.text,
      qty: ci.qty || '1 buah',
      notes: 'Item kustom tambahan Anda',
      isCustom: true,
    }));
    return [...DEFAULT_HOSPITAL_BAG_ITEMS, ...customFormatted];
  }, [customItems]);

  const handleToggle = async (id) => {
    await toggleHospitalBagItem(id);
    const updated = await getHospitalBagItems();
    setPackedIds(updated);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const added = await addCustomBagItem(newItemCategory, newItemTitle.trim());
    setCustomItems((prev) => [...prev, added]);
    setNewItemTitle('');
    setNewItemQty('');
    setShowAddForm(false);
  };

  const handleRemoveCustom = async (id) => {
    const updated = await removeCustomBagItem(id);
    setCustomItems(updated);
    const updatedPacked = await getHospitalBagItems();
    setPackedIds(updatedPacked);
  };

  // Stats calculation
  const totalCount = allItems.length;
  const packedCount = allItems.filter((item) => packedIds.includes(item.id)).length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Category counts
  const categoryStats = useMemo(() => {
    const stats = {};
    HOSPITAL_BAG_CATEGORIES.forEach((cat) => {
      const catItems = allItems.filter((item) => item.category === cat.id);
      const catPacked = catItems.filter((item) => packedIds.includes(item.id)).length;
      stats[cat.id] = { total: catItems.length, packed: catPacked };
    });
    return stats;
  }, [allItems, packedIds]);

  // Current filtered items
  const displayedItems = useMemo(() => {
    let list = allItems.filter((item) => item.category === activeCategory);
    if (filter === 'pending') {
      list = list.filter((item) => !packedIds.includes(item.id));
    } else if (filter === 'packed') {
      list = list.filter((item) => packedIds.includes(item.id));
    }
    return list;
  }, [allItems, activeCategory, filter, packedIds]);

  return (
    <div className="page-content hospital-bag-page" id="hospital-bag-page">
      {/* Top Header */}
      <header className="hb-header animate-fade-in-up">
        {!hideBackButton && (
          <button className="hb-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <div className="hb-header-badge">
            <Luggage size={14} /> Persiapan Persalinan
          </div>
          <h2>Tas Rumah Sakit</h2>
        </div>
      </header>

      {/* Progress & Milestone Alert */}
      <section className="hb-progress-card card animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <div className="hb-progress-row">
          <div>
            <span className="hb-progress-label">Kesiapan Barang Bawaan</span>
            <div className="hb-progress-numbers">
              <strong>{packedCount}</strong> dari {totalCount} barang siap
            </div>
          </div>
          <div className="hb-progress-circle">
            <span>{progressPct}%</span>
          </div>
        </div>
        <div className="hb-progress-track">
          <div className="hb-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="hb-tip-box">
          <Info size={16} className="hb-tip-icon" />
          <p>
            <strong>Waktu Ideal:</strong> Mulai dicicil di <em>Minggu 32</em>, dan wajib siap rapi di dalam mobil atau dekat pintu utama sebelum <em>Minggu 36</em>!
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <nav className="hb-tabs animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        {HOSPITAL_BAG_CATEGORIES.map((cat) => {
          const stats = categoryStats[cat.id] || { total: 0, packed: 0 };
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`hb-tab-btn ${isActive ? 'hb-tab-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="hb-tab-emoji">{cat.emoji}</span>
              <span className="hb-tab-name">{cat.label.replace('Perlengkapan ', '')}</span>
              <span className="hb-tab-pill">
                {stats.packed}/{stats.total}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Filter Chips & Add Action */}
      <div className="hb-filter-bar animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        <div className="hb-filter-chips">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Belum' },
            { id: 'packed', label: 'Sudah' },
          ].map((f) => (
            <button
              key={f.id}
              className={`hb-filter-chip ${filter === f.id ? 'hb-filter-chip--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          className="btn btn-secondary hb-add-trigger-btn"
          onClick={() => {
            setNewItemCategory(activeCategory);
            setShowAddForm(!showAddForm);
          }}
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      {/* Add Custom Item Modal / Inline Form */}
      {showAddForm && (
        <form className="hb-add-form card animate-scale-in" onSubmit={handleAddItem}>
          <div className="hb-form-title">
            <Sparkles size={16} color="var(--color-accent-dark)" />
            <span>Tambah Barang untuk {HOSPITAL_BAG_CATEGORIES.find((c) => c.id === newItemCategory)?.label}</span>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Nama barang (contoh: Selimut wol tambahan)"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="hb-form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowAddForm(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={!newItemTitle.trim()}>
              Simpan ke Tas
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="hb-items-list stagger-children">
        {displayedItems.map((item) => {
          const isPacked = packedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`hb-item-card card ${isPacked ? 'hb-item-card--packed' : ''}`}
              onClick={() => handleToggle(item.id)}
              role="button"
              tabIndex={0}
            >
              <button
                type="button"
                className={`hb-checkbox ${isPacked ? 'hb-checkbox--checked' : ''}`}
                aria-label={isPacked ? 'Tandai belum siap' : 'Tandai sudah siap'}
              >
                {isPacked && <Check size={14} strokeWidth={3} />}
              </button>

              <div className="hb-item-content">
                <div className="hb-item-top">
                  <h4 className={`hb-item-title ${isPacked ? 'hb-item-title--packed' : ''}`}>
                    {item.title}
                  </h4>
                  {item.qty && <span className="hb-item-qty">{item.qty}</span>}
                </div>
                {item.notes && <p className="hb-item-notes">{item.notes}</p>}
              </div>

              {item.isCustom && (
                <button
                  type="button"
                  className="hb-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustom(item.id);
                  }}
                  title="Hapus barang kustom"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}

        {displayedItems.length === 0 && (
          <div className="hb-empty-state card">
            <span className="hb-empty-emoji">{filter === 'packed' ? '🎒' : '🎉'}</span>
            <p>
              {filter === 'packed'
                ? 'Belum ada barang yang ditandai masuk ke tas.'
                : 'Semua barang dalam kategori ini sudah siap!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalBag;

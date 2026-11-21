import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Trash2, Luggage, Info } from 'lucide-react';
import {
  getHospitalBagItems,
  toggleHospitalBagItem,
  getCustomBagItems,
  addCustomBagItem,
  removeCustomBagItem,
} from '../utils/storage';
import { HOSPITAL_BAG_CATEGORIES, DEFAULT_HOSPITAL_BAG_ITEMS } from '../data/hospitalBagData';
import './HospitalBag.css';

function HospitalBag({ hideBackButton = false, isEmbedded = false }) {
  const navigate = useNavigate();
  const [packedIds, setPackedIds] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('mama');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'packed'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('mama');
  const addFormRef = useRef(null);

  useEffect(() => {
    if (showAddForm && addFormRef.current) {
      addFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showAddForm]);

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
      notes: 'Item tambahan Anda',
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
    const added = await addCustomBagItem(newItemCategory, newItemTitle.trim(), newItemQty.trim());
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

  const totalCount = allItems.length;
  const packedCount = allItems.filter((item) => packedIds.includes(item.id)).length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const categoryStats = useMemo(() => {
    const stats = {};
    HOSPITAL_BAG_CATEGORIES.forEach((cat) => {
      const catItems = allItems.filter((item) => item.category === cat.id);
      const catPacked = catItems.filter((item) => packedIds.includes(item.id)).length;
      stats[cat.id] = { total: catItems.length, packed: catPacked };
    });
    return stats;
  }, [allItems, packedIds]);

  const displayedItems = useMemo(() => {
    let list = allItems.filter((item) => item.category === activeCategory);
    if (filter === 'pending') {
      list = list.filter((item) => !packedIds.includes(item.id));
    } else if (filter === 'packed') {
      list = list.filter((item) => packedIds.includes(item.id));
    }
    return list;
  }, [allItems, activeCategory, filter, packedIds]);

  const HeadingTag = isEmbedded ? 'h2' : 'h1';

  return (
    <div className={`${isEmbedded ? 'hospital-bag-embedded' : 'page-content hospital-bag-page'}`} id="hospital-bag-page">
      {/* Top Header */}
      <header className="hb-header animate-fade-in-up">
        {!hideBackButton && (
          <button
            type="button"
            className="hb-back-btn"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            aria-label="Kembali"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        )}
        <div>
          <div className="hb-header-badge">
            <Luggage size={14} aria-hidden="true" />
            <span>Persiapan Persalinan</span>
          </div>
          <HeadingTag className="hb-page-title">Tas Rumah Sakit</HeadingTag>
        </div>
      </header>

      {/* Progress & Milestone Alert */}
      <section className="hb-progress-card card animate-fade-in-up" style={{ animationDelay: '40ms' }}>
        <div className="hb-progress-row">
          <div>
            <span className="hb-progress-label">Kesiapan Barang Bawaan</span>
            <div className="hb-progress-numbers tabular-nums">
              <strong>{packedCount}</strong> dari {totalCount} barang siap
            </div>
          </div>
          <div className="hb-progress-circle tabular-nums" aria-label={`Progres ${progressPct} persen`}>
            <span>{progressPct}%</span>
          </div>
        </div>
        <div className="hb-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="hb-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="hb-tip-box">
          <Info size={16} className="hb-tip-icon" aria-hidden="true" />
          <p>
            <strong>Waktu Ideal:</strong> Mulai dicicil di Minggu 32, dan siapkan di dekat pintu utama atau bagasi sebelum Minggu 36.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <nav className="hb-tabs animate-fade-in-up" style={{ animationDelay: '80ms' }} aria-label="Kategori barang tas bersalin">
        {HOSPITAL_BAG_CATEGORIES.map((cat) => {
          const stats = categoryStats[cat.id] || { total: 0, packed: 0 };
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              className={`hb-tab-btn ${isActive ? 'hb-tab-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="hb-tab-emoji" aria-hidden="true">{cat.emoji}</span>
              <span className="hb-tab-name">{cat.label.replace('Perlengkapan ', '')}</span>
              <span className="hb-tab-pill tabular-nums">
                {stats.packed}/{stats.total}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Filter Chips & Add Action */}
      <div className="hb-filter-bar animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <div className="hb-filter-chips" role="group" aria-label="Filter status barang">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Belum' },
            { id: 'packed', label: 'Sudah' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              className={`hb-filter-chip ${filter === f.id ? 'hb-filter-chip--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-secondary hb-add-trigger-btn"
          onClick={() => {
            setNewItemCategory(activeCategory);
            setShowAddForm(!showAddForm);
          }}
        >
          <Plus size={16} aria-hidden="true" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Add Custom Item Inline Form */}
      {showAddForm && (
        <form ref={addFormRef} className="hb-add-form card animate-scale-in" onSubmit={handleAddItem}>
          <div className="hb-form-title">
            <Plus size={16} color="var(--color-primary)" aria-hidden="true" />
            <span>Tambah Barang untuk {HOSPITAL_BAG_CATEGORIES.find((c) => c.id === newItemCategory)?.label}</span>
          </div>
          <div className="input-group">
            <label htmlFor="hb-new-title">Nama Barang</label>
            <input
              id="hb-new-title"
              type="text"
              className="input-field"
              placeholder="Contoh: Selimut wol tambahan"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ marginTop: '10px' }}>
            <label htmlFor="hb-new-qty">Jumlah</label>
            <input
              id="hb-new-qty"
              type="text"
              className="input-field"
              placeholder="Contoh: 2 buah atau 1 pasang"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
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
            >
              <button
                type="button"
                className="hb-item-toggle"
                onClick={() => handleToggle(item.id)}
                aria-pressed={isPacked}
                aria-label={`${isPacked ? 'Sudah siap' : 'Belum siap'}: ${item.title}`}
              >
                <span className={`hb-checkbox ${isPacked ? 'hb-checkbox--checked' : ''}`} aria-hidden="true">
                  {isPacked && <Check size={14} strokeWidth={3} />}
                </span>

                <span className="hb-item-content">
                  <span className="hb-item-top">
                    <span className={`hb-item-title ${isPacked ? 'hb-item-title--packed' : ''}`}>
                      {item.title}
                    </span>
                    {item.qty && <span className="hb-item-qty tabular-nums">{item.qty}</span>}
                  </span>
                  {item.notes && <span className="hb-item-notes">{item.notes}</span>}
                </span>
              </button>

              {item.isCustom && (
                <button
                  type="button"
                  className="hb-delete-btn"
                  onClick={() => handleRemoveCustom(item.id)}
                  aria-label={`Hapus ${item.title}`}
                  title="Hapus barang tambahan"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}

        {displayedItems.length === 0 && (
          <div className="hb-empty-state card">
            <p>
              {filter === 'packed'
                ? 'Belum ada barang yang ditandai masuk ke tas.'
                : 'Semua barang dalam kategori ini sudah siap.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalBag;

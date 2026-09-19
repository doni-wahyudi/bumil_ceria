import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../App';
import { getCompletedItems, toggleChecklistItem } from '../utils/storage';
import { getChecklistByRole, getCategories } from '../data/weeklyData';
import RoleToggle from '../components/RoleToggle';
import ChecklistItem from '../components/ChecklistItem';
import HospitalBag from './HospitalBag';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  ListChecks,
  Luggage,
  Sparkles,
  Layers,
  Maximize2,
  Minimize2,
  Calendar,
} from 'lucide-react';
import './Checklist.css';

function Checklist() {
  const { role, pregnancyData } = useApp();
  const [subTab, setSubTab] = useState('weekly'); // 'weekly' | 'hospitalBag'
  const [completedItems, setCompletedItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'done'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | categoryId
  const [scopeFilter, setScopeFilter] = useState('all'); // 'all' | 'currentWeek'
  const [collapsedCats, setCollapsedCats] = useState(new Set());
  const [fullyExpandedCats, setFullyExpandedCats] = useState(new Set());

  const currentWeek = pregnancyData?.currentWeek || 1;

  useEffect(() => {
    getCompletedItems().then(setCompletedItems);
  }, []);

  const handleToggle = async (id) => {
    await toggleChecklistItem(id);
    const updated = await getCompletedItems();
    setCompletedItems(updated);
  };

  const categories = getCategories(role);
  const allItems = useMemo(() => getChecklistByRole(role), [role]);

  // Filter items by completion status and week scope
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Status filter
      if (filter === 'pending' && completedItems.includes(item.id)) return false;
      if (filter === 'done' && !completedItems.includes(item.id)) return false;

      // Scope filter: current week only vs all
      if (scopeFilter === 'currentWeek' && item.week !== currentWeek) return false;

      return true;
    });
  }, [allItems, completedItems, filter, scopeFilter, currentWeek]);

  // Group by category
  const groupedItems = useMemo(() => {
    const groups = {};
    categories.forEach((cat) => {
      groups[cat.id] = filteredItems.filter((item) => item.category === cat.id);
    });
    return groups;
  }, [filteredItems, categories]);

  const totalItems = allItems.length;
  const totalDone = allItems.filter((item) => completedItems.includes(item.id)).length;
  const progressPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  // Toggle individual category collapse
  const toggleCategory = (catId) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      next.has(catId) ? next.delete(catId) : next.add(catId);
      return next;
    });
  };

  // Toggle full expansion (expand beyond max-height scroll)
  const toggleFullExpansion = (catId) => {
    setFullyExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(catId) ? next.delete(catId) : next.add(catId);
      return next;
    });
  };

  // Collapse or Expand All
  const handleToggleAll = () => {
    if (collapsedCats.size === categories.length) {
      // All are collapsed, expand all
      setCollapsedCats(new Set());
    } else {
      // Collapse all
      setCollapsedCats(new Set(categories.map((c) => c.id)));
    }
  };

  const allCollapsed = collapsedCats.size === categories.length;

  // Visible categories based on activeCategoryFilter
  const visibleCategories = useMemo(() => {
    if (activeCategoryFilter === 'all') return categories;
    return categories.filter((cat) => cat.id === activeCategoryFilter);
  }, [categories, activeCategoryFilter]);

  return (
    <div className="page-content checklist-page" id="checklist-page">
      {/* Sub-Tab Switcher between Weekly Tasks and Hospital Bag */}
      <div className="checklist-subtabs animate-fade-in-up">
        <button
          type="button"
          className={`checklist-subtab-btn ${subTab === 'weekly' ? 'checklist-subtab-btn--active' : ''}`}
          onClick={() => setSubTab('weekly')}
        >
          <ListChecks size={16} />
          <span>Tugas Mingguan</span>
        </button>
        <button
          type="button"
          className={`checklist-subtab-btn ${subTab === 'hospitalBag' ? 'checklist-subtab-btn--active' : ''}`}
          onClick={() => setSubTab('hospitalBag')}
        >
          <Luggage size={16} />
          <span>Tas Bersalin 🎒</span>
        </button>
      </div>

      {subTab === 'hospitalBag' ? (
        <HospitalBag hideBackButton={true} />
      ) : (
        <>
          <header className="checklist-header animate-fade-in-up">
            <div>
              <h2>Checklist Tugas</h2>
              <p className="text-secondary text-sm">
                {totalDone} dari {totalItems} tugas selesai
              </p>
            </div>
            <RoleToggle />
          </header>

          {/* Overall Progress Card */}
          <div className="checklist-progress-card card animate-fade-in-up" style={{ animationDelay: '40ms' }}>
            <div className="checklist-progress-card__top">
              <div className="checklist-progress-card__label">
                <Sparkles size={14} color="var(--color-primary)" />
                <span>Kesiapan Kehamilan {role === 'mama' ? 'Mama' : 'Papa'}</span>
              </div>
              <span className="checklist-progress-card__pct">{progressPct}%</span>
            </div>
            <div className="checklist-progress__bar">
              <div
                className="checklist-progress__fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Scope & Collapse Control Bar */}
          <div className="checklist-controls-bar animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            {/* Week Scope Switcher */}
            <div className="checklist-scope-toggle">
              <button
                type="button"
                className={`checklist-scope-btn ${scopeFilter === 'all' ? 'checklist-scope-btn--active' : ''}`}
                onClick={() => setScopeFilter('all')}
              >
                <Layers size={13} />
                <span>Semua Minggu (1–40)</span>
              </button>
              <button
                type="button"
                className={`checklist-scope-btn ${scopeFilter === 'currentWeek' ? 'checklist-scope-btn--active' : ''}`}
                onClick={() => setScopeFilter('currentWeek')}
              >
                <Calendar size={13} />
                <span>Fokus Mg {currentWeek}</span>
              </button>
            </div>

            {/* Collapse / Expand All button */}
            <button
              type="button"
              className="checklist-collapse-all-btn"
              onClick={handleToggleAll}
              title={allCollapsed ? 'Buka Semua Bagian' : 'Tutup Semua Bagian'}
            >
              {allCollapsed ? 'Buka Semua' : 'Tutup Semua'}
            </button>
          </div>

          {/* Status Filter Chips */}
          <div className="checklist-filters animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <Filter size={15} color="var(--color-text-tertiary)" className="checklist-filter-icon" />
            {[
              { value: 'all', label: 'Semua Status' },
              { value: 'pending', label: 'Belum Selesai' },
              { value: 'done', label: 'Sudah Selesai' },
            ].map((f) => (
              <button
                key={f.value}
                className={`checklist-filter-btn ${filter === f.value ? 'checklist-filter-btn--active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Horizontal Pill Navigation Bar */}
          <div className="checklist-cat-pills animate-fade-in-up" style={{ animationDelay: '140ms' }}>
            <button
              type="button"
              className={`checklist-cat-pill ${activeCategoryFilter === 'all' ? 'checklist-cat-pill--active' : ''}`}
              onClick={() => setActiveCategoryFilter('all')}
            >
              Semua Kategori
            </button>
            {categories.map((cat) => {
              const catTotal = (groupedItems[cat.id] || []).length;
              const isActive = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`checklist-cat-pill ${isActive ? 'checklist-cat-pill--active' : ''}`}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                >
                  <span className="checklist-cat-pill__emoji">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  {catTotal > 0 && <span className="checklist-cat-pill__badge">{catTotal}</span>}
                </button>
              );
            })}
          </div>

          {/* Categories Section List */}
          <div className="checklist-categories stagger-children">
            {visibleCategories.map((cat) => {
              const items = groupedItems[cat.id] || [];
              if (items.length === 0) {
                // If filtered to this category but no items match status
                if (activeCategoryFilter === cat.id) {
                  return (
                    <div key={cat.id} className="checklist-category-card card">
                      <div className="checklist-category__header-static">
                        <span className="checklist-category__emoji">{cat.emoji}</span>
                        <h4>{cat.label}</h4>
                      </div>
                      <p className="text-secondary text-xs" style={{ padding: '12px 0', textAlign: 'center' }}>
                        Tidak ada tugas yang sesuai filter di kategori ini.
                      </p>
                    </div>
                  );
                }
                return null;
              }

              const catDone = items.filter((item) => completedItems.includes(item.id)).length;
              const isCollapsed = collapsedCats.has(cat.id);
              const isFullyExpanded = fullyExpandedCats.has(cat.id);

              return (
                <div key={cat.id} className="checklist-category-card card">
                  {/* Category Header */}
                  <button
                    type="button"
                    className="checklist-category__header"
                    onClick={() => toggleCategory(cat.id)}
                    aria-expanded={!isCollapsed}
                  >
                    <div className="checklist-category__title">
                      <span className="checklist-category__emoji">{cat.emoji}</span>
                      <div className="checklist-category__names">
                        <h4>{cat.label}</h4>
                        <span className="checklist-category__sub-meta">
                          {catDone} dari {items.length} selesai
                        </span>
                      </div>
                    </div>

                    <div className="checklist-category__header-right">
                      <span className="checklist-category__count-badge">
                        {Math.round((catDone / items.length) * 100)}%
                      </span>
                      <div className={`checklist-category__chevron ${isCollapsed ? 'checklist-category__chevron--collapsed' : ''}`}>
                        <ChevronUp size={18} />
                      </div>
                    </div>
                  </button>

                  {/* Category Progress Bar */}
                  <div className="checklist-category__progress">
                    <div
                      className="checklist-category__progress-fill"
                      style={{ width: `${items.length > 0 ? (catDone / items.length) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Scrollable Category Items Box */}
                  {!isCollapsed && (
                    <div className="checklist-category__body">
                      <div
                        className={`checklist-category__items ${isFullyExpanded ? 'checklist-category__items--expanded' : 'checklist-category__items--scrollable'}`}
                      >
                        {items
                          .sort((a, b) => {
                            const aCompleted = completedItems.includes(a.id);
                            const bCompleted = completedItems.includes(b.id);
                            if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
                            const aIsCurrent = a.week === currentWeek;
                            const bIsCurrent = b.week === currentWeek;
                            if (aIsCurrent !== bIsCurrent) return aIsCurrent ? -1 : 1;
                            return a.week - b.week;
                          })
                          .map((item) => (
                            <ChecklistItem
                              key={item.id}
                              item={item}
                              isCompleted={completedItems.includes(item.id)}
                              onToggle={handleToggle}
                            />
                          ))}
                      </div>

                      {/* Section Scroll Cue / Full Expansion Footer */}
                      {items.length > 3 && (
                        <div className="checklist-category__footer">
                          <span className="checklist-category__footer-hint">
                            {isFullyExpanded
                              ? `Menampilkan seluruh ${items.length} tugas`
                              : `Scroll di dalam kotak (${items.length} tugas)`}
                          </span>
                          <button
                            type="button"
                            className="checklist-category__expand-toggle"
                            onClick={() => toggleFullExpansion(cat.id)}
                          >
                            {isFullyExpanded ? (
                              <>
                                <Minimize2 size={12} />
                                <span>Mode Scroll</span>
                              </>
                            ) : (
                              <>
                                <Maximize2 size={12} />
                                <span>Buka Penuh</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="checklist-empty card">
              <span className="checklist-empty__emoji">{filter === 'done' ? '📋' : '🎉'}</span>
              <p>
                {filter === 'done'
                  ? 'Belum ada tugas yang diselesaikan dengan filter ini.'
                  : 'Semua tugas pada filter ini sudah selesai!'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Checklist;

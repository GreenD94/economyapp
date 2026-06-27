'use client';
import { DotsMenu }     from '@/features/core/components/DotsMenu.component';
import { ConfirmModal } from '@/features/core/components/ConfirmModal.component';
import { Modal }        from '@/features/core/components/Modal.component';
import { InfoModal }    from '@/features/core/components/InfoModal.component';
import { INFO }         from '@/features/core/content/info.content';
import styles from '../styles/Wishlist.module.css';
import { CARD_CLASS, TAB_CLASS, verdictToColor, EMPTY_FORM, type ColorFilter } from '../wishlist.types';
import { fmtAmt } from '@/features/core/utils/currency.formatters';
import { ItemForm }          from '../components/ItemForm';
import { useWishlistState }  from '../hooks/useWishlistState.hook';

export function WishlistContainer() {
  const ctx = useWishlistState();
  const {
    loading, error, filtered, countByColor, countPending,
    colorFilter, setColorFilter, showFilters, setShowFilters,
    nameFilter, setNameFilter, maxPrice, setMaxPrice,
    priorityFilter, setPriorityFilter,
    addOpen, setAddOpen, addForm, setAddForm, handleAdd,
    editItem, setEditItem, editForm, setEditForm, handleEdit,
    confirm, setConfirm, infoOpen, setInfoOpen,
    getMenuItems,
  } = ctx;

  const infoW = INFO.purchases.wishlist;

  return (
    <div className={styles.page}>
      <div className={styles.pendingHero}>
        ${fmtAmt(countPending)}
      </div>

      <div className={styles.controlsRow}>
        <button className={styles.filterBtn} onClick={() => setShowFilters(v => !v)} aria-label="Filtros">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
        <button className={styles.infoBtn} onClick={() => setInfoOpen(true)} aria-label="Info">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <input className={styles.filterInput} placeholder="Buscar por nombre..." value={nameFilter}
            onChange={e => setNameFilter(e.target.value)} />
          <input className={styles.filterInput} type="number" min="0" placeholder="Precio máximo ($)"
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          <div className={styles.priorityPills}>
            {['Todas', 'Alta', 'Media', 'Baja'].map(p => (
              <button key={p}
                className={`${styles.priorityPill} ${priorityFilter === p ? styles.priorityPillActive : ''}`}
                onClick={() => setPriorityFilter(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.colorTabs}>
        {(['all', 'green', 'yellow', 'red', 'grey'] as ColorFilter[]).map(c => {
          const labels: Record<ColorFilter, string> = { all: 'Todos', green: `Verde (${countByColor.green})`, yellow: `Amarillo (${countByColor.yellow})`, red: `Rojo (${countByColor.red})`, grey: `Gris (${countByColor.grey})` };
          return (
            <button key={c}
              className={`${styles.colorTab} ${styles[TAB_CLASS[c]]} ${colorFilter === c ? styles.colorTabActive : ''}`}
              onClick={() => setColorFilter(c)}>
              {labels[c]}
            </button>
          );
        })}
      </div>

      {loading && <div className={styles.loading}>Cargando...</div>}
      {error   && <div className={styles.error}>{error}</div>}
      <div className={styles.list}>
        {filtered.length === 0 && !loading && <p className={styles.empty}>No hay artículos para mostrar.</p>}
        {filtered.map(item => {
          const color = verdictToColor(item.verdict);
          return (
            <div key={item.id} className={`${styles.card} ${styles[CARD_CLASS[color]]}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardName}>{item.item}</span>
                <DotsMenu items={getMenuItems(item)} />
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardPrice}>${fmtAmt(parseFloat(item.price))}</span>
                <span className={styles.priorityChip}>{item.priority}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button className={styles.fab} onClick={() => setAddOpen(true)} aria-label="Agregar artículo">+</button>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setAddForm(EMPTY_FORM); }} title="Agregar artículo">
        <ItemForm form={addForm} onChange={setAddForm} onSubmit={handleAdd}
          onCancel={() => { setAddOpen(false); setAddForm(EMPTY_FORM); }} title="Guardar" />
      </Modal>

      <Modal open={editItem !== null} onClose={() => setEditItem(null)} title="Editar artículo">
        <ItemForm form={editForm} onChange={setEditForm} onSubmit={handleEdit}
          onCancel={() => setEditItem(null)} title="Guardar cambios" />
      </Modal>

      {confirm && (
        <ConfirmModal open={true} onClose={() => setConfirm(null)} onConfirm={confirm.action}
          message={confirm.msg} confirmLabel={confirm.label} />
      )}

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} title={infoW.title}
        howItWorks={<>{infoW.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>}
        glossary={infoW.glossary} />
    </div>
  );
}

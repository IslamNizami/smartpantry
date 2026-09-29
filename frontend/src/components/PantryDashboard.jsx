import { useState, useEffect, useCallback } from "react";
import { RefrigeratorIcon, Trash2, Plus, Search, AlertTriangle,
         CheckCircle2, Clock, Loader2, PackageOpen } from "lucide-react";
import { pantryApi } from "../services/api";
import AddItemForm from "./AddItemForm";

// ── Helpers ────────────────────────────────────────────────────────────────
const daysUntilExpiry = (d) => {
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.ceil((new Date(d) - t) / 86400000);
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

const UNIT_SHORT = {
  PIECES:"pcs", GRAMS:"g", KILOGRAMS:"kg",
  MILLILITERS:"ml", LITERS:"l", TABLESPOONS:"tbsp", CUPS:"cup",
};

const CATEGORY_LABEL = {
  FRUITS:"Fruits", VEGETABLES:"Vegetables", DAIRY:"Dairy",
  MEAT:"Meat", SEAFOOD:"Seafood", PANTRY_STAPLES:"Pantry Staples",
  BAKERY:"Bakery", FROZEN:"Frozen", BEVERAGES:"Beverages", SNACKS:"Snacks",
};

const CATEGORY_COLOR = {
  FRUITS:         { bg:"#fef9c3", color:"#854d0e" },
  VEGETABLES:     { bg:"#dcfce7", color:"#166534" },
  DAIRY:          { bg:"#dbeafe", color:"#1e40af" },
  MEAT:           { bg:"#fee2e2", color:"#991b1b" },
  SEAFOOD:        { bg:"#cffafe", color:"#155e75" },
  PANTRY_STAPLES: { bg:"#f3f4f6", color:"#374151" },
  BAKERY:         { bg:"#fef3c7", color:"#92400e" },
  FROZEN:         { bg:"#ede9fe", color:"#5b21b6" },
  BEVERAGES:      { bg:"#d1fae5", color:"#065f46" },
  SNACKS:         { bg:"#fce7f3", color:"#9d174d" },
};

// ── Sub-components ─────────────────────────────────────────────────────────
function ExpiryBadge({ daysLeft }) {
  if (daysLeft < 0)  return <span className="badge badge-expired">Expired</span>;
  if (daysLeft <= 3) return <span className="badge badge-danger"><AlertTriangle size={11}/>Expiring Soon</span>;
  if (daysLeft <= 7) return <span className="badge badge-warn">{daysLeft}d left</span>;
  return <span className="badge badge-fresh"><CheckCircle2 size={11}/>Fresh</span>;
}

function CategoryBadge({ category }) {
  const style = CATEGORY_COLOR[category] || { bg:"#f3f4f6", color:"#374151" };
  const label = CATEGORY_LABEL[category] || category;
  return (
    <span className="badge" style={{ background: style.bg, color: style.color }}>
      {label}
    </span>
  );
}

function StatsBar({ items }) {
  const expiring = items.filter(i => { const d=daysUntilExpiry(i.expiryDate); return d>=0&&d<=3; }).length;
  const expired  = items.filter(i => daysUntilExpiry(i.expiryDate) < 0).length;
  return (
    <div className="stats">
      <div className="stat stat-total">
        <div className="stat-label">Total Items</div>
        <div className="stat-value">{items.length}</div>
      </div>
      <div className="stat stat-warn">
        <div className="stat-label">Expiring Soon</div>
        <div className="stat-value">{expiring}</div>
      </div>
      <div className="stat stat-danger">
        <div className="stat-label">Expired</div>
        <div className="stat-value">{expired}</div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function PantryDashboard({ onItemCountChange }) {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await pantryApi.getAll();
      setItems(data);
      onItemCountChange?.(data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onItemCountChange]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleItemAdded = () => {
    setShowForm(false);
    fetchItems(); // always re-fetch from server — source of truth
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await pantryApi.delete(id);
      setItems(prev => {
        const next = prev.filter(i => i.id !== id);
        onItemCountChange?.(next.length);
        return next;
      });
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon">
            <RefrigeratorIcon size={20} color="var(--f600)" strokeWidth={1.8}/>
          </div>
          <div className="page-title">
            <h1>Pantry Inventory</h1>
            <p>{items.length} item{items.length !== 1 ? "s" : ""} tracked</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          <Plus size={16}/> Add Item
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <AddItemForm
            onItemAdded={handleItemAdded}
            onClose={() => setShowForm(false)}
            existingItems={items}
          />
        </div>
      )}

      {/* ── Stats ── */}
      {!loading && !error && items.length > 0 && <StatsBar items={items}/>}

      {/* ── Search ── */}
      {!loading && !error && items.length > 0 && (
        <div className="search-wrap">
          <Search size={15}/>
          <input
            className="input-field"
            placeholder="Search pantry items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="loading-center">
          <Loader2 size={28} className="animate-spin"/> Loading pantry…
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="card card-pad" style={{ textAlign:"center", borderColor:"#fecaca" }}>
          <p style={{ color:"#dc2626", fontWeight:500 }}>{error}</p>
          <button className="btn-ghost" style={{ marginTop:12, color:"#dc2626" }} onClick={fetchItems}>
            Retry
          </button>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <PackageOpen size={56} strokeWidth={1} style={{ opacity:.25 }}/>
          <h2>Your pantry is empty</h2>
          <p>Add your first item to get started</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16}/> Add First Item
          </button>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && !error && items.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding:"40px", textAlign:"center", color:"var(--f400)" }}>
                    No items match "{search}"
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const days = daysUntilExpiry(item.expiryDate);
                  const unitShort = UNIT_SHORT[item.unit] || item.unit || "";
                  return (
                    <tr
                      key={item.id}
                      className={days <= 3 ? "critical" : ""}
                      style={{ animationDelay:`${idx * 40}ms` }}
                    >
                      <td><CategoryBadge category={item.category}/></td>
                      <td className="td-name">{item.name}</td>
                      <td className="td-qty">{item.quantity.toFixed(2)} {unitShort}</td>
                      <td>
                        <div className="td-date">
                          <Clock size={13} color="var(--f400)"/>
                          {formatDate(item.expiryDate)}
                        </div>
                      </td>
                      <td><ExpiryBadge daysLeft={days}/></td>
                      <td>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                        >
                          {deleting === item.id
                            ? <Loader2 size={15} className="animate-spin"/>
                            : <Trash2 size={15}/>
                          }
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
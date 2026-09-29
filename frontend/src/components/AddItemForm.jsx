import { useState } from "react";
import { Plus, X, AlertCircle, Loader2 } from "lucide-react";
import { pantryApi } from "../services/api";

// ── Enum definitions ───────────────────────────────────────────────────────
const UNITS = [
  { value: "PIECES",      label: "Pieces" },
  { value: "GRAMS",       label: "Grams (g)" },
  { value: "KILOGRAMS",   label: "Kilograms (kg)" },
  { value: "MILLILITERS", label: "Milliliters (ml)" },
  { value: "LITERS",      label: "Liters (l)" },
  { value: "TABLESPOONS", label: "Tablespoons (tbsp)" },
  { value: "CUPS",        label: "Cups" },
];

const CATEGORIES = [
  { value: "FRUITS",         label: "Fruits" },
  { value: "VEGETABLES",     label: "Vegetables" },
  { value: "DAIRY",          label: "Dairy" },
  { value: "MEAT",           label: "Meat" },
  { value: "SEAFOOD",        label: "Seafood" },
  { value: "PANTRY_STAPLES", label: "Pantry Staples" },
  { value: "BAKERY",         label: "Bakery" },
  { value: "FROZEN",         label: "Frozen" },
  { value: "BEVERAGES",      label: "Beverages" },
  { value: "SNACKS",         label: "Snacks" },
];

const INITIAL_FORM = {
  name:       "",
  quantity:   "",
  expiryDate: "",
  unit:       "PIECES",
  category:   "PANTRY_STAPLES",
};

export default function AddItemForm({ onItemAdded, onClose }) {
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = "Item name is required.";
    } else if (form.name.length < 2) {
      e.name = "Name must be at least 2 characters.";
    } else if (form.name.length > 100) { 
      e.name = "Name is too long (max 100 characters).";
    }

    if (!form.quantity) e.quantity = "Quantity is required.";
    else if (Number(form.quantity) <= 0) e.quantity = "Must be greater than 0.";

    if (!form.expiryDate) e.expiryDate = "Expiry date is required.";
    else if (form.expiryDate < today) e.expiryDate = "Date cannot be in the past.";
    
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr(null);
    setErrors({});
    
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        name:       form.name.trim(),
        quantity:   parseFloat(form.quantity),
        expiryDate: form.expiryDate,
        unit:       form.unit,
        category:   form.category,
      };

      const { data } = await pantryApi.create(payload);


      const sanitizedItem = {
        ...data,
        expiryDate: typeof data.expiryDate === 'string' 
          ? data.expiryDate.split('T')[0] 
          : form.expiryDate // Fallback to what the user typed in the form
      };
      // ─────────────────────────────────────────────────────────────

      onItemAdded(sanitizedItem); 
      setForm(INITIAL_FORM);
      onClose?.();
    } catch (err) {
      if (err.response && err.response.status === 400 && typeof err.response.data === 'object') {
        setErrors(err.response.data);
        setApiErr("Please correct the errors highlighted below.");
      } else {
        const message = err.response?.data?.message || err.message || "An unexpected error occurred.";
        setApiErr(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-pad animate-slide-up">

      {/* ── Header ── */}
      <div className="form-header">
        <div>
          <h2>Add New Item</h2>
          <p>Fill in the details to add to your pantry</p>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── API Error Banner ── */}
      {apiErr && (
        <div className="error-banner">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{apiErr}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Row 1 — Name (full width) */}
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Item Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Organic Whole Milk"
            className={`input-field${errors.name ? " error" : ""}`}
          />
          {errors.name && (
            <div className="form-error"><AlertCircle size={12} />{errors.name}</div>
          )}
        </div>

        {/* Row 2 — Quantity + Unit */}
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <div>
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0.0"
              step="0.1"
              min="0"
              className={`input-field${errors.quantity ? " error" : ""}`}
            />
            {errors.quantity && (
              <div className="form-error"><AlertCircle size={12} />{errors.quantity}</div>
            )}
          </div>

          <div>
            <label className="form-label">Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
              {UNITS.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 — Category + Expiry Date */}
        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              min={today}
              className={`input-field${errors.expiryDate ? " error" : ""}`}
            />
            {errors.expiryDate && (
              <div className="form-error"><AlertCircle size={12} />{errors.expiryDate}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          {onClose && (
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
              : <><Plus size={16} /> Add to Pantry</>
            }
          </button>
        </div>

      </form>
    </div>
  );
}
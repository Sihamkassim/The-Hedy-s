import { useState, useEffect } from "react"
import { Search, Star, Leaf, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { therapistAPI } from "../api/services"
import { therapists as mockTherapists } from "../data/mockData"

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    therapistAPI.getAll()
      .then(res => setTherapists(res.data.data.therapists))
      .catch(() => setTherapists(mockTherapists))
      .finally(() => setLoading(false))
  }, [])

  const displayList = (therapists.length > 0 ? therapists : mockTherapists).filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name?.toLowerCase().includes(q) || t.specialization?.toLowerCase().includes(q)
    const matchFilter = filter === "all" ? true : filter === "free" ? (t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) : !(t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0)
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen" style={{ background: "#F7F4EF" }}>
      {/* Header */}
      <div className="py-16 px-4 text-center" style={{ background: "linear-gradient(135deg, #2C3E1E, #4A5E3A)" }}>
        <Leaf className="w-10 h-10 text-white/40 mx-auto mb-3" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Find Your Provider</h1>
        <p className="text-white/70 max-w-lg mx-auto text-sm leading-relaxed">Connect with compassionate professionals who understand your journey. Free support available for women in crisis.</p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col md:flex-row gap-4" style={{ border: "1px solid #E8EDE0" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all" style={{ borderColor: "#D4DBC8", color: "#2C3E1E" }} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {["all", "free", "paid"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                style={{ background: filter === f ? "#4A5E3A" : "#E8EDE0", color: filter === f ? "white" : "#4A5E3A" }}>
                {f === "all" ? "All" : f === "free" ? "Free Support" : "Paid Sessions"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map(i => <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "#E8EDE0" }} />)}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-widest">
              {displayList.length} provider{displayList.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayList.map((t, i) => (
                <div key={t.id || i} className="bg-white rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-1 transition-all group" style={{ borderColor: "#E8EDE0" }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #4A5E3A, #8A9E6C)" }}>
                      {(t.name || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate" style={{ color: "#2C3E1E" }}>{t.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{t.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-600">{t.rating || "5.0"}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: (t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) ? "#E8EDE0" : "#FEF3C7", color: (t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) ? "#4A5E3A" : "#78350F" }}>
                      {(t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) ? "Free" : `$${t.sessionPrice || t.priceAmount}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4">{t.bio}</p>
                  {t.availability && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(Array.isArray(t.availability) ? t.availability.slice(0, 2) : []).map((a, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8EDE0", color: "#4A5E3A" }}>{a}</span>
                      ))}
                    </div>
                  )}
                  <Link to={`/booking/${t.id}`}
                    className="block w-full py-2.5 rounded-xl font-semibold text-sm text-center text-white transition-all hover:shadow-md"
                    style={{ background: "linear-gradient(135deg, #4A5E3A, #6B7F5E)" }}>
                    Book Session
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

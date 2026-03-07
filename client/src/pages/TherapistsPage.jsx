import { useState, useEffect } from "react"
import { Search, Star, Leaf, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { therapistAPI, spiritualLeaderAPI } from "../api/services"
import { therapists as mockTherapists } from "../data/mockData"

export default function TherapistsPage() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [providerType, setProviderType] = useState("all") // all, therapist, spiritual

  useEffect(() => {
    Promise.all([
      therapistAPI.getAll().catch(() => ({ data: { data: { therapists: mockTherapists } } })),
      spiritualLeaderAPI.getAll().catch(() => ({ data: { data: { leaders: [] } } }))
    ])
      .then(([therapistRes, spiritualRes]) => {
        const therapists = therapistRes.data.data.therapists || []
        const mappedTherapists = therapists.map(t => ({ ...t, type: 'therapist' }))
        
        const leaders = spiritualRes.data.data.spiritualLeaders || []
        const mappedLeaders = leaders.map(l => ({ ...l, type: 'spiritual', name: l.user?.name || l.name || 'Spiritual Leader' }))
        
        setProviders([...mappedTherapists, ...mappedLeaders])
      })
      .finally(() => setLoading(false))
  }, [])

  const displayList = providers.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name?.toLowerCase().includes(q) || t.specialization?.toLowerCase().includes(q) || t.religion?.toLowerCase().includes(q)
    const matchFilter = filter === "all" ? true : filter === "free" ? (t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) : !(t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0)
    const matchType = providerType === "all" ? true : providerType === "therapist" ? t.type === "therapist" : t.type === "spiritual"
    return matchSearch && matchFilter && matchType
  })

  return (
    <div className="min-h-screen" style={{ background: "var(--base-bg)" }}>
      {/* Header */}
      <div className="py-16 px-4 text-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <Leaf className="w-10 h-10 text-primary-inverse opacity-40 mx-auto mb-3" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary-inverse mb-3">Find Your Provider</h1>
        <p className="text-primary-inverse opacity-70 max-w-lg mx-auto text-sm leading-relaxed">Connect with compassionate professionals who understand your journey. Free support available for women in crisis.</p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-base-bg p-1 rounded-2xl shadow-sm inline-flex" style={{ border: "1px solid color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
            {["all", "therapist", "spiritual"].map(type => (
              <button
                key={type}
                onClick={() => setProviderType(type)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${providerType === type ? 'text-primary-inverse' : 'text-gray-500 hover:text-gray-700'}`}
                style={{ background: providerType === type ? "linear-gradient(135deg, var(--primary), var(--primary))" : "transparent" }}
              >
                {type === "all" ? "All Providers" : type === "therapist" ? "Mental Health Doctors" : "Spiritual Assistance"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-base-bg rounded-2xl shadow-lg p-5 flex flex-col md:flex-row gap-4" style={{ border: "1px solid color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all" style={{ borderColor: "#D4DBC8", color: "var(--base-text)" }} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {["all", "free", "paid"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                style={{ background: filter === f ? "var(--primary)" : "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)", color: filter === f ? "var(--base-bg)" : "var(--primary)" }}>
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
            {[...Array(6)].map(i => <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }} />)}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-widest">
              {displayList.length} provider{displayList.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayList.map((t, i) => (
                <div key={t.id || i} className="bg-base-bg rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-1 transition-all group" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-inverse text-xl font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                      {(t.name || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate" style={{ color: "var(--base-text)" }}>{t.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{t.specialization || (t.type === 'spiritual' ? `Spiritual Guide (${t.religion})` : 'Therapist')}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-600">{t.rating || "5.0"}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: (t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) ? "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" : "#FEF3C7", color: (t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) ? "var(--primary)" : "#78350F" }}>
                      {(t.isFreeSupport || t.priceAmount === 0 || t.sessionPrice === 0) ? "Free" : `$${t.sessionPrice || t.priceAmount || t.pricePerSession || t.sessionPrice || "Paid"}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4">{t.bio || `Providing spiritual guidance and support.`}</p>
                  {t.availability && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(Array.isArray(t.availability) ? t.availability.slice(0, 2) : []).map((a, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)", color: "var(--primary)" }}>{a}</span>
                      ))}
                    </div>
                  )}
                  <Link to={`/booking/${t.id}?type=${t.type}`}
                    className="block w-full py-2.5 rounded-xl font-semibold text-sm text-center text-primary-inverse transition-all hover:shadow-md"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--primary))" }}>
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

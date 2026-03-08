import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Calendar, Clock, CheckCircle, ArrowLeft, Loader, Leaf } from "lucide-react"
import { therapistAPI, spiritualLeaderAPI, appointmentAPI } from "../api/services"
import { useAuth } from "../context/AuthContext"
import { therapists as mockTherapists } from "../data/mockData"

export default function BookingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const providerType = searchParams.get('type') || 'therapist'
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  useEffect(() => {
    if (providerType === 'spiritual') {
      spiritualLeaderAPI.getOne(id)
        .then(res => setProvider(res.data.data.spiritualLeader))
        .catch(() => setProvider(null))
        .finally(() => setLoading(false))
    } else {
      therapistAPI.getOne(id)
        .then(res => setProvider(res.data.data.therapist))
        .catch(() => { const mock = mockTherapists.find(t => String(t.id) === String(id)); setProvider(mock || null) })
        .finally(() => setLoading(false))
    }
  }, [id, providerType])

  const handleBook = async () => {
    if (!isAuthenticated) { setError("Please sign in to book a session."); return }
    if (!date || !time) { setError("Please select a date and time."); return }
    setError(""); setBooking(true)
    try {
      const payload = { date, time }
      if (providerType === 'spiritual') {
        payload.spiritualId = id
      } else {
        payload.therapistId = id
      }
      const response = await appointmentAPI.create(payload)
      const appointmentId = response.data.data.appointment.id
      
      // Check if session is paid or free
      const isFreeSession = provider?.isFreeSupport || provider?.sessionPrice === 0 || provider?.priceAmount === 0 || provider?.pricePerSession === 0
      
      if (isFreeSession) {
        // Free session - show success
        setSuccess(true)
      } else {
        // Paid session - redirect to checkout
        navigate(`/checkout/${appointmentId}`)
      }
    } catch (e) {
      setError(e.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setBooking(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--base-bg)" }}>
      <Loader className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
    </div>
  )

  if (!provider) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--base-bg)" }}>
      <p className="text-gray-500">Provider not found.</p>
      <button onClick={() => navigate("/therapists")} className="text-sm font-medium" style={{ color: "var(--primary)" }}>Back to Providers</button>
    </div>
  )

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--base-bg)" }}>
      <div className="bg-base-bg rounded-3xl p-12 text-center max-w-md shadow-xl border" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
        <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--primary)" }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--base-text)" }}>Session Booked!</h2>
        <p className="text-gray-500 text-sm mb-6">Your session with {provider.name || provider.user?.name} on {date} at {time} is confirmed.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-inverse" style={{ background: "var(--primary)" }}>View Dashboard</button>
          <button onClick={() => navigate("/therapists")} className="px-6 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: "#D4DBC8", color: "var(--primary)" }}>Find More</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--base-bg)" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="grid md:grid-cols-5 gap-8">
          {/* Therapist Profile */}
          <div className="md:col-span-2">
            <div className="bg-base-bg rounded-2xl border p-6" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-primary-inverse text-3xl font-bold mx-auto mb-4" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                {((provider.name || provider.user?.name) || "?").charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-center mb-1" style={{ color: "var(--base-text)" }}>{provider?.name || provider?.user?.name}</h2>
              <p className="text-sm text-gray-500 text-center mb-4">{provider?.specialization || provider?.religion || "Spiritual Guide"}</p>
              {provider?.bio && <p className="text-xs text-gray-500 leading-relaxed text-center">{provider.bio}</p>}
              <div className="mt-4 pt-4 border-t flex justify-between text-sm" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
                <span className="text-gray-400">Experience</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>{provider?.experience || provider?.yearsOfExperience || "5"}+ yrs</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Session Price</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>{(provider?.isFreeSupport || provider?.sessionPrice === 0 || provider?.priceAmount === 0 || provider?.pricePerSession === 0) ? "Free" : `ETB ${provider?.sessionPrice || provider?.priceAmount || provider?.pricePerSession || "Paid"}`}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-3">
            <div className="bg-base-bg rounded-2xl border p-6" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--base-text)" }}>Schedule Your Session</h3>
              </div>

              {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">{error}</div>}

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>
                    <Calendar className="inline w-3.5 h-3.5 mr-1" />Select Date
                  </label>
                  <input type="date" value={date} min={new Date().toISOString().split("T")[0]}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all" style={{ borderColor: "#D4DBC8", color: "var(--base-text)" }} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>
                    <Clock className="inline w-3.5 h-3.5 mr-1" />Select Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {times.map(t => (
                      <button key={t} onClick={() => setTime(t)}
                        className="py-2 rounded-xl text-xs font-medium transition-all border"
                        style={{ background: time === t ? "var(--primary)" : "var(--base-bg)", color: time === t ? "var(--base-bg)" : "var(--primary)", borderColor: time === t ? "var(--primary)" : "#D4DBC8" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleBook} disabled={booking || !date || !time}
                  className="w-full py-3.5 rounded-xl font-semibold text-primary-inverse text-sm flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--primary))" }}>
                  {booking ? <><Loader className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Session"}
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-xl px-4 py-2">
                    You need to sign in to book a session.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

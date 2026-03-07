import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowRight, Shield, Leaf, Star, ChevronRight } from "lucide-react"
import { therapistAPI } from "../api/services"
import { therapists as mockTherapists } from "../data/mockData"

export default function LandingPage() {
  const [therapists, setTherapists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    therapistAPI.getAll()
      .then(res => setTherapists(res.data.data.therapists.slice(0, 3)))
      .catch(() => setTherapists(mockTherapists.slice(0, 3)))
      .finally(() => setLoading(false))
  }, [])

  const steps = [
    { num: "01", title: "Complete the form", desc: "Tell us what you are going through so we can match you well." },
    { num: "02", title: "Get matched", desc: "We pair you with a provider whose approach fits your specific needs." },
    { num: "03", title: "Attend your first session", desc: "Meet your provider in a safe, confidential online or in-person session." },
  ]

  const formats = [
    { icon: "🌿", title: "Individual", desc: "One-on-one sessions focused entirely on your personal growth and healing journey." },
    { icon: "🌸", title: "Couples", desc: "Work through relationship challenges together with a skilled mediating therapist." },
    { icon: "🌻", title: "Free Crisis Support", desc: "24/7 emergency support for women in immediate distress. No cost, no barriers." },
  ]

  const testimonials = [
    { name: "Amara K.", quote: "I finally feel understood. My therapist has changed the way I see myself.", role: "Patient, 8 months" },
    { name: "Sofia R.", quote: "The free crisis line was there when I had no one else. It saved me.", role: "Free Support User" },
    { name: "Priya M.", quote: "The mindfulness challenge helped me rediscover peace in my daily life.", role: "Challenge Participant" },
  ]

  const displayTherapists = therapists.length > 0 ? therapists : mockTherapists.slice(0, 3)

  return (
    <div className="min-h-screen" style={{ background: "#F7F4EF" }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4" style={{ background: "linear-gradient(160deg, #2C3E1E 0%, #4A5E3A 50%, #6B7F5E 100%)" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "#8A9E6C", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#C17A55", transform: "translate(-30%, 30%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(255,255,255,0.15)", color: "#E8EDE0" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online & In-Person Sessions Available
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Psycho<span style={{ color: "#A3C17A" }}>therapy</span>
            <br />
            <span className="text-4xl md:text-5xl font-light text-white/80">for women, by care</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            A safe and supportive space where you can talk openly about your thoughts and feelings.
            Therapy can be short-term or long-term — we grow with you at your pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/therapists" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all hover:shadow-xl hover:-translate-y-0.5" style={{ background: "#E8EDE0", color: "#2C3E1E" }}>
              Meet a Provider <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/free-help" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-base border border-white/30 hover:bg-white/10 transition-all">
              <Shield className="w-4 h-4" /> Free Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8A9E6C" }}>What is Psychotherapy?</span>
            <h2 className="text-4xl font-bold mt-3 mb-5 leading-tight" style={{ color: "#2C3E1E" }}>A safe space for your mind to breathe</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Psychotherapy is a safe and supportive place where you can talk openly about your thoughts and feelings. Therapy can be short-term or long-term, going deeper into patterns and healing.</p>
            <p className="text-gray-600 leading-relaxed">In regular sessions you will work with a therapist to address challenges, understand your emotions, and develop healthier coping strategies.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ icon: "🧠", val: "94%", sub: "Satisfaction rate" }, { icon: "🌿", val: "2k+", sub: "Women helped" }, { icon: "🤝", val: "24/7", sub: "Crisis coverage" }, { icon: "⭐", val: "50+", sub: "Licensed professionals" }].map((s, i) => (
              <div key={i} className="rounded-2xl p-5 border hover:shadow-md transition-all" style={{ background: "white", borderColor: "#E8EDE0" }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ color: "#4A5E3A" }}>{s.val}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4" style={{ background: "#E8EDE0" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8A9E6C" }}>Process</span>
            <h2 className="text-4xl font-bold mt-3" style={{ color: "#2C3E1E" }}>Few steps to <em className="not-italic">begin</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white mb-4" style={{ background: "#4A5E3A" }}>{s.num}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#2C3E1E" }}>{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8A9E6C" }}>Our Team</span>
            <h2 className="text-4xl font-bold mt-3" style={{ color: "#2C3E1E" }}>Meet <em className="not-italic" style={{ color: "#6B7F5E" }}>our</em> providers</h2>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "#E8EDE0" }} />)}</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {displayTherapists.map((t, i) => (
                <Link to={`/booking/${t.id}`} key={t.id || i} className="group rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: "white", borderColor: "#E8EDE0" }}>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #4A5E3A, #8A9E6C)" }}>{(t.name || "?").charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate" style={{ color: "#2C3E1E" }}>{t.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{t.specialization}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6B7F5E] transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{t.bio}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{t.rating || "5.0"}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: (t.isFreeSupport || t.priceAmount === 0) ? "#E8EDE0" : "#FEF3C7", color: (t.isFreeSupport || t.priceAmount === 0) ? "#4A5E3A" : "#92400E" }}>
                      {(t.isFreeSupport || t.priceAmount === 0) ? "Free" : `$${t.sessionPrice || t.priceAmount}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/therapists" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white text-sm transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #4A5E3A, #6B7F5E)" }}>
              View All Providers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 px-4" style={{ background: "#2C3E1E" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8A9E6C" }}>Offerings</span>
            <h2 className="text-4xl font-bold mt-3 text-white">Therapy <em className="not-italic" style={{ color: "#A3C17A" }}>formats</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {formats.map((f, i) => (
              <div key={i} className="rounded-2xl p-7 border hover:border-[#6B7F5E] transition-all" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4" style={{ background: "#F7F4EF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold" style={{ color: "#2C3E1E" }}>
              Healing is not always a straight line.
              <br />
              <span className="text-2xl font-normal text-gray-500">But it does not have to be a circle.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border" style={{ background: "white", borderColor: "#E8EDE0" }}>
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#6B7F5E" }}>{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#2C3E1E" }}>{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(135deg, #4A5E3A 0%, #6B7F5E 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Leaf className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4">Other paths to <em className="not-italic" style={{ color: "#A3C17A" }}>wellness</em></h2>
          <p className="text-white/70 mb-8">Beyond therapy, explore wellness challenges, group coaching, and more paths back to yourself.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/challenges" className="px-7 py-3 rounded-full font-semibold text-sm transition-all hover:shadow-lg" style={{ background: "#E8EDE0", color: "#2C3E1E" }}>Explore Challenges</Link>
            <Link to="/free-help" className="px-7 py-3 rounded-full font-semibold text-white text-sm border border-white/30 hover:bg-white/10 transition-all">Free Crisis Support</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

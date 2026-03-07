import { useState } from 'react'
import { X, Leaf, Eye, EyeOff, Loader, Upload, User, Stethoscope, FileText, Award, Briefcase, Bird } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login')
  const [userType, setUserType] = useState('user')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    degree: '',
    certificate: '',
    experience: '',
    sessionPrice: '',
    bio: '',
    religion: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [degreeFile, setDegreeFile] = useState(null)
  const [certificateFile, setCertificateFile] = useState(null)

  const [imagePreview, setImagePreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        onClose()
      } else {
        if (userType === 'therapist') {
          const formData = new FormData()
          formData.append('name', form.name)
          formData.append('email', form.email)
          formData.append('password', form.password)
          formData.append('role', 'therapist')
          formData.append('specialization', form.specialization)
          if (form.degree) formData.append('degree', form.degree)
          if (form.certificate) formData.append('certificate', form.certificate)
          formData.append('experience', form.experience || '1')
          formData.append('sessionPrice', form.sessionPrice || '0')
          formData.append('bio', form.bio || 'New therapist.')
          if (profileImage) formData.append('profileImage', profileImage)
          if (degreeFile) formData.append('degreeFile', degreeFile)
          if (certificateFile) formData.append('certificateFile', certificateFile)

          await register(formData)
        } else if (userType === 'spiritual') {
          const formData = new FormData()
          formData.append('name', form.name)
          formData.append('email', form.email)
          formData.append('password', form.password)
          formData.append('role', 'spiritual_leader')
          formData.append('religion', form.religion || 'Ethiopian Orthodox')
          formData.append('specialization', form.specialization || 'Spiritual Support')
          formData.append('experience', form.experience || '1')
          formData.append('sessionPrice', form.sessionPrice || '0')
          formData.append('bio', form.bio || 'New spiritual guide.')
          
          await register(formData)
        } else {
          await register({ name: form.name, email: form.email, password: form.password, role: 'user' })
        }
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      specialization: '',
      degree: '',
      certificate: '',
      experience: '',
      sessionPrice: '',
      bio: '',
      religion: '',
    })
    setProfileImage(null)
    setDegreeFile(null)
    setCertificateFile(null)
    setImagePreview(null)
    setError('')
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  const switchUserType = (type) => {
    setUserType(type)
    resetForm()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(44,62,30,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg bg-base-bg rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary) 100%)' }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 text-primary-inverse opacity-70 hover:text-primary-inverse transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <Leaf className="w-7 h-7 text-primary-inverse" />
            <span className="text-primary-inverse font-bold text-xl">Tsinat</span>
          </div>
          <p className="text-primary-inverse opacity-80 text-sm">
            {mode === 'login' ? 'Welcome back. Your safe space awaits.' : 'Begin your healing journey today.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button onClick={() => switchMode('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'login' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'}`}>
            Sign In
          </button>
          <button onClick={() => switchMode('register')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'register' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'}`}>
            Create Account
          </button>
        </div>

        {/* User Type Selector for Register */}
        {mode === 'register' && (
          <div className="px-8 pt-6 pb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">I am a</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => switchUserType('user')}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 text-[11px] font-bold transition-all ${
                  userType === 'user'
                    ? 'border-[var(--primary)] bg-[color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)] text-[var(--base-text)]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                <User className="w-5 h-5 mb-1" />
                Patient
              </button>
              <button type="button" onClick={() => switchUserType('therapist')}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 text-[11px] font-bold transition-all ${
                  userType === 'therapist'
                    ? 'border-[var(--primary)] bg-[color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)] text-[var(--base-text)]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                <Stethoscope className="w-5 h-5 mb-1" />
                Therapist
              </button>
              <button type="button" onClick={() => switchUserType('spiritual')}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 text-[11px] font-bold text-center transition-all ${
                  userType === 'spiritual'
                    ? 'border-[var(--primary)] bg-[color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)] text-[var(--base-text)]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                <Bird className="w-5 h-5 mb-1" />
                Spiritual Guide
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Common Fields */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" placeholder="Your full name" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" placeholder="you@example.com" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Therapist Extra Fields */}
          {mode === 'register' && userType === 'therapist' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Degree (PDF/Doc)
                  </label>
                  <label className="block w-full cursor-pointer">
                    <div className="px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-[var(--primary)] text-sm text-gray-500 hover:text-[var(--primary)] transition-all text-center truncate">
                      {degreeFile ? degreeFile.name : 'Upload Degree…'}
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setDegreeFile(e.target.files?.[0])} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Certificate
                  </label>
                  <label className="block w-full cursor-pointer">
                    <div className="px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-[var(--primary)] text-sm text-gray-500 hover:text-[var(--primary)] transition-all text-center truncate">
                      {certificateFile ? certificateFile.name : 'Upload License…'}
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setCertificateFile(e.target.files?.[0])} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Specialization
                </label>
                <input type="text" placeholder="Anxiety, Depression, Trauma..." required value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Years Experience</label>
                  <input type="number" placeholder="e.g., 5" required value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Session Price ($)</label>
                  <input type="number" placeholder="0 for free" value={form.sessionPrice}
                    onChange={e => setForm({ ...form, sessionPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea rows={3} placeholder="Brief bio about your practice and approach..." value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm resize-none transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Profile Image (optional)
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-[var(--primary)] text-sm text-gray-500 hover:text-[var(--primary)] transition-all text-center">
                      {profileImage ? profileImage.name : 'Choose an image…'}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Spiritual Leader Extra Fields */}
          {mode === 'register' && userType === 'spiritual' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Bird className="w-3 h-3" /> Religion / Affiliation
                </label>
                <input type="text" placeholder="e.g., Ethiopian Orthodox, Islam..." required value={form.religion}
                  onChange={e => setForm({ ...form, religion: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Area of Guidance
                </label>
                <input type="text" placeholder="Family Counseling, Youth Empowerment..." required value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Years Experience</label>
                  <input type="number" placeholder="e.g., 5" required value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Session Price (ETB)</label>
                  <input type="number" placeholder="0 for free" value={form.sessionPrice}
                    onChange={e => setForm({ ...form, sessionPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea placeholder="Tell us about your background and how you guide others..." rows={3} value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm transition-all resize-none" />
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-primary-inverse text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: loading ? 'var(--secondary)' : 'linear-gradient(135deg, var(--primary), var(--primary))' }}>
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
            {mode === 'login' ? 'Sign In' : userType === 'therapist' ? 'Create Therapist Account' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-gray-400 pt-2">
            By continuing, you agree to our{' '}
            <span className="text-[var(--primary)] cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </form>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'am', label: '⩋≠⍫ቩ (Amharic)' },
  { code: 'om', label: 'Afaan Oromoo' },
  { code: 'so', label: 'Soomaali' },
  { code: 'ti', label: '⵵ክርቩ (Tigrinya)' }
]

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-base-bg text-base-text hover:border-primary/50 transition-colors shadow-sm text-sm font-medium"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="uppercase">{language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-base-bg border border-accent/20 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${language === lang.code ? 'bg-primary/10 text-primary font-semibold' : 'text-base-text hover:bg-accent/10'}`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

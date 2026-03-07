const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const hooksDir = path.join(__dirname, 'src', 'hooks');
if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

// --- DICTIONARIES ---
const en = {
  nav: {
    dashboard: "My Dashboard",
    therapists: "Therapists",
    challenges: "Challenges",
    freeHelp: "Free Help",
    chat: "Chat",
    aiAssistant: "AI Assistant"
  },
  ai: {
    title: "Your AI Companion",
    subtitle: "A safe space to share your thoughts and feelings. Always here, always listening.",
    newChat: "New Chat",
    recentChats: "Recent Chats",
    crisis: "Crisis detected — please call 988 or text HOME to 741741 for immediate help.",
    welcomeTitle: "How can I support you today?",
    welcomeSubtitle: "I am your private, safe space. Your chats are saved locally so you can pick up right where you left off.",
    placeholder: "Share how you're feeling…",
    placeholderAuth: "Sign in to chat…",
    disclaimer: "AI can make mistakes. For clinical diagnosis or emergencies, please reach out to professional therapists or hotlines."
  },
  common: { theme: "Theme", language: "Language", login: "Login", logout: "Logout" }
};

const am = {
  nav: { dashboard: "??? ?????", therapists: "??????", challenges: "??????", freeHelp: "?? ????", chat: "????", aiAssistant: "???? ???" },
  ai: {
    title: "????? ??? ???", subtitle: "????? ?? ????? ???????? ????? ????? ???", newChat: "??? ????", recentChats: "???? ?? ?????",
    crisis: "??? ????? — ???? 988 ????", welcomeTitle: "?? ???? ???? ??????", welcomeSubtitle: "????? ?? ????? ????? ??? ???",
    placeholder: "???? ???????? ???…", placeholderAuth: "?????? ???…", disclaimer: "AI ?????? ??? ????? ?????? ???? ???? ?????"
  },
  common: { theme: "???", language: "???", login: "??", logout: "??" }
};

const om = {
  nav: { dashboard: "Daashboordii", therapists: "Ogeeyyii Fayyaa", challenges: "Qormaata", freeHelp: "Gargaarsa Bilisaa", chat: "Haasaa", aiAssistant: "Gargaaraa AI" },
  ai: {
    title: "Hiriyaa AI Kee", subtitle: "Iddoo nagaa yaada kee itti qooddatu. Yeroo hunda as jira.", newChat: "Haasaa Haaraa", recentChats: "Haasaa Dhihoo",
    crisis: "Rakkoon uumameera — dafii 988 bilbili", welcomeTitle: "Har'a maaliinan si gargaaru danda'a?", welcomeSubtitle: "Ani iddoo nagaa fi dhuunfaa keeti.",
    placeholder: "Akkam akka sitti dhagahamu qoodi…", placeholderAuth: "Haasa'uuf seenaa…", disclaimer: "AI dogoggora uumuu danda'a. Gargaarsa ogeessaa gaafadhu."
  },
  common: { theme: "Bifa", language: "Afaan", login: "Seeni", logout: "Bahi" }
};

const so = {
  nav: { dashboard: "Dhashboodyga", therapists: "Daaweeyayaasha", challenges: "Caqabadaha", freeHelp: "Caawinaad Bilaash ah", chat: "Sheeko", aiAssistant: "Caawiyaha AI" },
  ai: {
    title: "Saaxiibkaaga AI", subtitle: "Meel ammaan ah oo aad ku wadaagto fikradahaaga.", newChat: "Sheeko Cusub", recentChats: "Sheekooyinkii U Dambeeyay",
    crisis: "Xaalad degdeg ah ayaa la ogaaday — fadlan wac 988", welcomeTitle: "Sidee baan ku caawin karaa maanta?", welcomeSubtitle: "Waxaan ahay meeshaada khaaska ah, ammaanka ah.",
    placeholder: "La wadaag sida aad dareemeyso…", placeholderAuth: "Gal si aad u sheekaysato…", disclaimer: "AI wuu qaldami karaa. Caawinaad xirfadle raadso."
  },
  common: { theme: "Mawduuca", language: "Luqadda", login: "Gal", logout: "Bax" }
};

const ti = {
  nav: { dashboard: "?????", therapists: "?????", challenges: "?????", freeHelp: "?? ???", chat: "???", aiAssistant: "?? AI ???" },
  ai: {
    title: "?? AI ????", subtitle: "?????? ??????? ?????? ??? ???", newChat: "??? ???", recentChats: "?? ??? ?? ????",
    crisis: "??? ???? — ???? 988 ???", welcomeTitle: "?? ???? ????? ?????", welcomeSubtitle: "?????? ???? ??? ???",
    placeholder: "??? ?? ????? ????…", placeholderAuth: "????? ??…", disclaimer: "AI ???? ???? ???? ??? ??? ?? ?????"
  },
  common: { theme: "???", language: "???", login: "??", logout: "???" }
};

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(localesDir, 'am.json'), JSON.stringify(am, null, 2));
fs.writeFileSync(path.join(localesDir, 'om.json'), JSON.stringify(om, null, 2));
fs.writeFileSync(path.join(localesDir, 'so.json'), JSON.stringify(so, null, 2));
fs.writeFileSync(path.join(localesDir, 'ti.json'), JSON.stringify(ti, null, 2));

// --- STORE & HOOK ---
const storeCode = \import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'app-language' }
  )
)
\;
fs.writeFileSync(path.join(__dirname, 'src', 'store', 'languageStore.js'), storeCode);

const hookCode = \import { useLanguageStore } from '../store/languageStore'
import en from '../locales/en.json'
import am from '../locales/am.json'
import om from '../locales/om.json'
import so from '../locales/so.json'
import ti from '../locales/ti.json'

const translations = { en, am, om, so, ti }

export function useTranslation() {
  const { language } = useLanguageStore()

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      if (value && value[k]) { value = value[k] } else { value = undefined; break }
    }
    if (!value) {
        let enVal = translations['en']
        for (const k of keys) {
          if (enVal && enVal[k]) enVal = enVal[k]
          else return key
        }
        return enVal || key
    }
    return value
  }

  return { t, language }
}
\;
fs.writeFileSync(path.join(hooksDir, 'useTranslation.js'), hookCode);

// --- LANGUAGE TOGGLE COMPONENT ---
const toggleCode = \import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'am', label: '???? (Amharic)' },
  { code: 'om', label: 'Afaan Oromoo' },
  { code: 'so', label: 'Soomaali' },
  { code: 'ti', label: '???? (Tigrinya)' }
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
                className={\w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors \\}
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
\;
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'LanguageToggle.jsx'), toggleCode);

console.log('Language files created successfully.');

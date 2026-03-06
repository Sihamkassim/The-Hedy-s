import { useState } from 'react'
import { Heart, Code, Zap, Github, Coffee, Star } from 'lucide-react'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)

  // Example axios usage
  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.github.com/repos/facebook/react')
      console.log('React repo data:', response.data)
      alert(`React has ${response.data.stargazers_count} stars on GitHub!`)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center gap-4 mb-8 animate-pulse">
          <Zap className="w-16 h-16 text-yellow-400" />
          <Code className="w-16 h-16 text-blue-400" />
          <Heart className="w-16 h-16 text-red-400" />
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Star className="text-yellow-400 animate-spin-slow" />
          Vite + React + Tailwind
          <Star className="text-yellow-400 animate-spin-slow" />
        </h1>
        
        <p className="text-gray-300 mb-8 flex items-center justify-center gap-2">
          <Coffee className="w-5 h-5" />
          Powered by Axios & Lucide Icons
        </p>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl mb-6">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto mb-4"
          >
            <Heart className="w-5 h-5" />
            Count is {count}
          </button>
          
          <button 
            onClick={fetchData}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Github className="w-5 h-5" />
            Fetch React Stars (Axios)
          </button>
          
          <p className="text-gray-300 mt-6">
            Edit <code className="bg-gray-700 px-2 py-1 rounded text-blue-400">src/App.jsx</code> and save to test HMR
          </p>
        </div>
        
        <div className="flex justify-center gap-6 text-gray-400 text-sm">
          <a href="https://vitejs.dev" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Zap className="w-4 h-4" />
            Vite Docs
          </a>
          <a href="https://react.dev" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Code className="w-4 h-4" />
            React Docs
          </a>
          <a href="https://lucide.dev" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Star className="w-4 h-4" />
            Lucide Icons
          </a>
        </div>
      </div>
    </div>
  )
}

export default App

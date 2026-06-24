import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Profile } from './pages/Profile'
import { Projects } from './pages/Projects'
import { Navbar } from './components/Navbar'
import { LumonAudio } from './components/LumonAudio'
import { WellnessSession } from './components/WellnessSession'
import { SeveredTransition } from './components/SeveredTransition '
import ProtectedRoute from './Routes/ProtectedRoute'
import PublicRoute from './Routes/PublicRoute'

function App() {
  const navigate = useNavigate()

  const [token, setToken] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [logged, setLogged] = useState(0)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) setToken(storedToken)
    setAuthChecked(true)
  }, [])

  const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    setToken(null)
    setLogged(0)
    navigate('/login')
  }
  const [sessionOpen, setSessionOpen] = useState(false)

  return (
    <div className="lumon-app">
      <div className="lumon-bg" />

      <div className="lumon-container">
        {token && <LumonAudio />}
        <Navbar onLogout={logout} />

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute token={token}>
                <Login setToken={setToken} setLogged={setLogged} />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute token={token}>
                <Home token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/severed"
            element={
              <ProtectedRoute token={token}>
                <SeveredTransition logged={logged} setLogged={setLogged} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute token={token}>
                <Profile
                  token={token}
                  sessionOpen={sessionOpen}
                  setSessionOpen={setSessionOpen}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute token={token}>
                <Projects token={token} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App

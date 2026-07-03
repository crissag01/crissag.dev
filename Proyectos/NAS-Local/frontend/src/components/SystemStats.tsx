import { useState, useEffect } from 'react'
import './SystemStats.css'

interface Stats {
  cpu: { percent: number; cores: number }
  ram: { used: number; total: number; percent: number }
  disk: { used: number; total: number; percent: number }
}

export function SystemStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
      setLoading(false)
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [])

  const getColor = (percent: number) => {
    if (percent < 50) return '#22c55e'
    if (percent < 80) return '#eab308'
    return '#ef4444'
  }

  if (loading || !stats) {
    return <div className="system-stats"><div className="stats-loading">Cargando...</div></div>
  }

  return (
    <div className="system-stats">
      <div className="stats-header">
        <h3>📊 Sistema</h3>
      </div>

      <div className="stats-content">
        {/* CPU */}
        <div className="stat-item">
          <div className="stat-label">
            <span className="stat-icon">⚙️</span>
            <span>CPU</span>
          </div>
          <div className="stat-value">{Math.round(stats.cpu.percent)}%</div>
          <div className="stat-bar">
            <div
              className="stat-fill"
              style={{
                width: `${Math.min(stats.cpu.percent, 100)}%`,
                backgroundColor: getColor(stats.cpu.percent)
              }}
            />
          </div>
          <div className="stat-detail">{stats.cpu.cores} núcleos</div>
        </div>

        {/* RAM */}
        <div className="stat-item">
          <div className="stat-label">
            <span className="stat-icon">🧠</span>
            <span>RAM</span>
          </div>
          <div className="stat-value">{Math.round(stats.ram.percent)}%</div>
          <div className="stat-bar">
            <div
              className="stat-fill"
              style={{
                width: `${Math.min(stats.ram.percent, 100)}%`,
                backgroundColor: getColor(stats.ram.percent)
              }}
            />
          </div>
          <div className="stat-detail">{stats.ram.used}/{stats.ram.total} MB</div>
        </div>

        {/* Disco */}
        <div className="stat-item">
          <div className="stat-label">
            <span className="stat-icon">💾</span>
            <span>Disco</span>
          </div>
          <div className="stat-value">{Math.round(stats.disk.percent)}%</div>
          <div className="stat-bar">
            <div
              className="stat-fill"
              style={{
                width: `${Math.min(stats.disk.percent, 100)}%`,
                backgroundColor: getColor(stats.disk.percent)
              }}
            />
          </div>
          <div className="stat-detail">{stats.disk.used}/{stats.disk.total} GB</div>
        </div>
      </div>
    </div>
  )
}

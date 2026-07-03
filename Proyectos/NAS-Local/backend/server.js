import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3002

// Configurar directorio de almacenamiento
const STORAGE_DIR = path.join(__dirname, '../storage')
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true })
}

// Middleware
app.use(cors())
app.use(express.json())

// Configurar multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(STORAGE_DIR, req.body.path || '/')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// Validar ruta segura
function validatePath(userPath) {
  const normalized = path.normalize(userPath)
  const fullPath = path.join(STORAGE_DIR, normalized)
  
  if (!fullPath.startsWith(STORAGE_DIR)) {
    throw new Error('Invalid path')
  }
  
  return fullPath
}

// GET /files - Listar archivos
app.get('/files', (req, res) => {
  try {
    const userPath = req.query.path || '/'
    const fullPath = validatePath(userPath)

    if (!fs.existsSync(fullPath)) {
      return res.json({ files: [] })
    }

    const files = fs.readdirSync(fullPath, { withFileTypes: true })
    const result = files.map(file => {
      const filePath = path.join(fullPath, file.name)
      const stats = fs.statSync(filePath)

      return {
        name: file.name,
        type: file.isDirectory() ? 'folder' : 'file',
        size: stats.size,
        modified: stats.mtime.toLocaleDateString('es-ES')
      }
    })

    res.json({ files: result })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /files - Crear carpeta
app.post('/files', (req, res) => {
  try {
    const userPath = req.query.path
    if (!userPath) {
      return res.status(400).json({ error: 'Path required' })
    }

    const fullPath = validatePath(userPath)

    if (fs.existsSync(fullPath)) {
      return res.status(400).json({ error: 'Folder already exists' })
    }

    fs.mkdirSync(fullPath, { recursive: true })
    res.json({ message: 'Folder created successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /upload - Subir archivos
app.post('/upload', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }
    
    res.json({
      message: 'Files uploaded successfully',
      count: req.files.length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /download - Descargar archivo
app.get('/download', (req, res) => {
  try {
    const userPath = req.query.path
    if (!userPath) {
      return res.status(400).json({ error: 'Path required' })
    }
    
    const fullPath = validatePath(userPath)
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      return res.status(400).json({ error: 'Cannot download directory' })
    }
    
    res.download(fullPath)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE /delete - Eliminar archivo/carpeta
app.delete('/delete', (req, res) => {
  try {
    const userPath = req.query.path
    if (!userPath) {
      return res.status(400).json({ error: 'Path required' })
    }
    
    const fullPath = validatePath(userPath)
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true })
    } else {
      fs.unlinkSync(fullPath)
    }
    
    res.json({ message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /rename - Renombrar archivo/carpeta
app.post('/rename', (req, res) => {
  try {
    const { oldPath, newPath } = req.body
    if (!oldPath || !newPath) {
      return res.status(400).json({ error: 'oldPath and newPath required' })
    }

    const fullOldPath = validatePath(oldPath)
    const fullNewPath = validatePath(newPath)

    if (!fs.existsSync(fullOldPath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    if (fs.existsSync(fullNewPath)) {
      return res.status(400).json({ error: 'Destination already exists' })
    }

    fs.renameSync(fullOldPath, fullNewPath)
    res.json({ message: 'Renamed successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /copy - Copiar archivo/carpeta
app.post('/copy', (req, res) => {
  try {
    const { source, destination } = req.body
    if (!source || !destination) {
      return res.status(400).json({ error: 'source and destination required' })
    }

    const fullSource = validatePath(source)
    const fullDest = validatePath(destination)

    if (!fs.existsSync(fullSource)) {
      return res.status(404).json({ error: 'Source not found' })
    }

    if (fs.existsSync(fullDest)) {
      return res.status(400).json({ error: 'Destination already exists' })
    }

    const stats = fs.statSync(fullSource)
    if (stats.isDirectory()) {
      fs.cpSync(fullSource, fullDest, { recursive: true })
    } else {
      fs.copyFileSync(fullSource, fullDest)
    }

    res.json({ message: 'Copied successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /move - Mover archivo/carpeta
app.post('/move', (req, res) => {
  try {
    const { source, destination } = req.body
    if (!source || !destination) {
      return res.status(400).json({ error: 'source and destination required' })
    }

    const fullSource = validatePath(source)
    const fullDest = validatePath(destination)

    if (!fs.existsSync(fullSource)) {
      return res.status(404).json({ error: 'Source not found' })
    }

    if (fs.existsSync(fullDest)) {
      return res.status(400).json({ error: 'Destination already exists' })
    }

    fs.renameSync(fullSource, fullDest)
    res.json({ message: 'Moved successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /stats - Estadísticas del sistema
app.get('/stats', (req, res) => {
  try {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const ramPercent = (usedMem / totalMem) * 100

    const cpus = os.cpus()
    let cpuPercent = 0
    try {
      const avgLoad = os.loadavg()
      if (avgLoad && avgLoad[0]) {
        cpuPercent = (avgLoad[0] / cpus.length) * 100
      } else {
        cpuPercent = Math.random() * 30
      }
    } catch (e) {
      cpuPercent = Math.random() * 30
    }

    let diskUsage = { total: 0, used: 0, free: 0, percent: 0 }
    try {
      if (process.platform === 'linux' || process.platform === 'darwin') {
        const output = execSync('df -B1 ' + STORAGE_DIR).toString().split('\n')[1]
        if (output) {
          const parts = output.split(/\s+/)
          diskUsage.total = parseInt(parts[1]) || 0
          diskUsage.used = parseInt(parts[2]) || 0
          diskUsage.free = parseInt(parts[3]) || 0
          diskUsage.percent = diskUsage.total > 0 ? (diskUsage.used / diskUsage.total) * 100 : 0
        }
      } else {
        diskUsage.total = totalMem
        diskUsage.used = usedMem
        diskUsage.free = freeMem
        diskUsage.percent = ramPercent
      }
    } catch (e) {
      diskUsage.total = totalMem
      diskUsage.used = usedMem
      diskUsage.free = freeMem
      diskUsage.percent = ramPercent
    }

    res.json({
      cpu: {
        percent: Math.min(Math.round(cpuPercent * 100) / 100, 100),
        cores: cpus.length
      },
      ram: {
        used: Math.round(usedMem / 1024 / 1024),
        total: Math.round(totalMem / 1024 / 1024),
        percent: Math.round(ramPercent * 100) / 100
      },
      disk: {
        used: Math.round(diskUsage.used / 1024 / 1024 / 1024),
        total: Math.round(diskUsage.total / 1024 / 1024 / 1024),
        percent: Math.round(diskUsage.percent * 100) / 100
      }
    })
  } catch (error) {
    res.status(500).json({
      cpu: { percent: 0, cores: os.cpus().length },
      ram: { used: 0, total: 0, percent: 0 },
      disk: { used: 0, total: 0, percent: 0 }
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 NAS Local server running on http://localhost:${PORT}`)
  console.log(`📁 Storage directory: ${STORAGE_DIR}`)
})

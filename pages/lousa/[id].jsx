import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useCallback } from 'react'
import Layout from '../../components/Layout'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'

// A4 (~96dpi)
const A4_W = 794
const A4_H = 1123
const MARGIN = 40
const PAD = 16
const INNER_W = A4_W - (MARGIN*2) - (PAD*2)
const INNER_H = A4_H - (MARGIN*2) - (PAD*2)

function useImage(url) {
  const [image, setImage] = useState(null)
  useEffect(() => {
    if (!url) return
    const img = new window.Image()
    img.onload = () => setImage(img)
    img.src = url
  }, [url])
  return image
}

function ImgNode({ it, isSelected, onClick, onDragMove, onTransformEnd }) {
  const img = useImage(it.src)
  return (
    <KImage
      id={`node-${it.id}`}
      image={img}
      x={it.x} y={it.y} width={it.w} height={it.h}
      onClick={onClick}
      draggable
      onDragMove={onDragMove}
      rotation={it.rotation || 0}
      onTransformEnd={e => onTransformEnd(e.target)}
      ref={node => {
        if (node && isSelected) {
          const tr = node.getLayer().findOne('Transformer')
          if (tr) {
            tr.nodes([node])
            tr.getLayer().batchDraw()
          }
        }
      }}
    />
  )
}

const KonvaBoard = dynamic(() => import('../../components/KonvaBoard'), { ssr: false })

export default function LousaPage() {
  const [tool, setTool] = useState('text') // 'select' | 'text' | 'pen' | 'eraser' | 'rect' | 'ellipse' | 'arrow'
  const [pages, setPages] = useState(1)
  const editorWrapRef = useRef(null)

  // TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types:['heading','paragraph']})
  // Memoriza a seleção atual para aplicar estilo mesmo clicando na UI
  const selRef = useRef({ from: 0, to: 0 })
  useEffect(() => {
    if (!editor) return
    const update = () => {
      const { from, to } = editor.state.selection
      selRef.current = { from, to }
    }
    editor.on('selectionUpdate', update)
    return () => editor.off('selectionUpdate', update)
  }, [editor])

  const restoreSelection = () => {
    if (!editor) return
    const { from, to } = selRef.current || {}
    if (typeof from === 'number' && typeof to === 'number') {
      editor.chain().setTextSelection({ from, to }).focus().run()
    } else {
      editor.commands.focus()
    }
  }
,
      TextStyle,
      Color,
      FontFamily,
    ],
    content: '',
    autofocus: 'end',
    immediatelyRender: false,
    editorProps: { attributes: { class: 'tiptap-content' } },
    onUpdate: () => queueMicrotask(repaginate),
  })

  // Desenhos via Konva
  const stageRef = useRef(null)
  const layerRef = useRef(null)
  const trRef = useRef(null)

  const [items, setItems] = useState([]) // {id, kind, ...}
  const [selectedIds, setSelectedIds] = useState([])
  const idSeq = useRef(1)
  const drawing = useRef(null)

  // Recalcular páginas pela altura do conteúdo (texto)
  const repaginate = useCallback(() => {
    const wrap = editorWrapRef.current
    if (!wrap) return
    const content = wrap.querySelector('.tiptap-content') || wrap.querySelector('.ProseMirror')
    const h = content ? content.scrollHeight : 0
    const need = Math.max(1, Math.ceil(h / INNER_H))
    if (need !== pages) setPages(need)
  }, [pages])

  useEffect(() => {
    repaginate()
    const onResize = () => repaginate()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [repaginate])

  
  // Mantém cursor piscando quando tool==='text' (sem atrapalhar desenho)
  useEffect(() => {
    if (!editor) return
    let t = null
    if (tool === 'text') {
      t = setInterval(() => {
        if (!editor.isFocused) editor.commands.focus()
      }, 600)
    }
    return () => { if (t) clearInterval(t) }
  }, [tool, editor])
// Hotkeys
  useEffect(() => {
    const onKey = (e) => {
      const focused = editor?.isFocused ?? false
      if (!focused) {
        if (e.key==='v' || e.key==='V') setTool('select')
        if (e.key==='t' || e.key==='T') setTool('text')
        if (e.key==='p' || e.key==='P') setTool('pen')
        if (e.key==='e' || e.key==='E') setTool('eraser')
        if (e.key==='r' || e.key==='R') setTool('rect')
        if (e.key==='c' || e.key==='C') setTool('ellipse')
        if (e.key==='a' || e.key==='A') setTool('arrow')
        if (e.key==='Delete') setItems(prev => prev.filter(it => !selectedIds.includes(it.id)))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editor, selectedIds])

  // Atualiza Transformer quando seleção muda
  useEffect(() => {
    const tr = trRef.current
    const layer = layerRef.current
    if (!tr || !layer) return
    const nodes = selectedIds.map(id => layer.findOne(`#node-${id}`)).filter(Boolean)
    tr.nodes(nodes)
    tr.getLayer()?.batchDraw()
  }, [selectedIds])

  // Handlers Stage
  const onStageMouseDown = (e) => {
    if (tool==='text') return
    const stage = stageRef.current
    const pos = stage.getPointerPosition()
    if (!pos) return

    const id = idSeq.current++

    if (tool==='pen') {
      drawing.current = { id, kind:'pen', points: [pos.x, pos.y] }
      setItems(prev => [...prev, drawing.current])
    } else if (tool==='eraser') {
      drawing.current = { id, kind:'eraser', points: [pos.x, pos.y] }
      setItems(prev => [...prev, drawing.current])
    } else if (tool==='rect') {
      drawing.current = { id, kind:'rect', x: pos.x, y: pos.y, w: 0, h: 0, rotation:0 }
      setItems(prev => [...prev, drawing.current])
    } else if (tool==='ellipse') {
      drawing.current = { id, kind:'ellipse', x: pos.x, y: pos.y, w: 0, h: 0, rotation:0 }
      setItems(prev => [...prev, drawing.current])
    } else if (tool==='arrow') {
      drawing.current = { id, kind:'arrow', x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y }
      setItems(prev => [...prev, drawing.current])
    } else if (tool==='select') {
      if (e.target === stage) setSelectedIds([])
    }
  }

  const onStageMouseMove = () => {
    const cur = drawing.current
    if (!cur) return
    const stage = stageRef.current
    const pos = stage.getPointerPosition()
    if (!pos) return
    const drawingId = cur.id

    setItems(prev => prev.map(it => {
      if (it.id !== drawingId) return it
      const clone = { ...it }
      if (clone.kind==='pen' || clone.kind==='eraser') {
        clone.points = [...clone.points, pos.x, pos.y]
      } else if (clone.kind==='rect' || clone.kind==='ellipse') {
        clone.w = pos.x - clone.x
        clone.h = pos.y - clone.y
      } else if (clone.kind==='arrow') {
        clone.x2 = pos.x; clone.y2 = pos.y
      }
      return clone
    }))
  }

  const onStageMouseUp = () => {
    const cur = drawing.current
    if (!cur) return
    drawing.current = null
    // Seleciona e muda para mouse
    setTool('select')
    setSelectedIds([cur.id])

    // Se borracha: remove itens que intersectam e remove o "risco" da borracha
    if (cur.kind === 'eraser') {
      const bbox = boundsOf(cur)
      setItems(prev => prev.filter(it => !intersects(boundsOf(it), bbox) && it.kind!=='eraser'))
    }
  }

  // Clique item
  const onItemClick = (id, e) => {
    if (tool!=='select') return
    const shift = e.evt.shiftKey
    setSelectedIds(prev => shift ? (prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]) : [id])
  }

  // Drag move
  const onDragMove = (id, e) => {
    const node = e.target
    const { x, y } = node.position()
    const cls = node.className
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it
      const next = { ...it }
      if (cls === 'Arrow') {
        const dx = x - (it.x || 0)
        const dy = y - (it.y || 0)
        next.x = x
        next.y = y
        next.x1 = it.x1 + dx
        next.y1 = it.y1 + dy
        next.x2 = it.x2 + dx
        next.y2 = it.y2 + dy
      } else {
        next.x = x
        next.y = y
      }
      return next
    }))
  }

  // Transform end
  const onTransformEnd = (id, node) => {
    const cls = node.className
    const rotation = node.rotation()
    const pos = node.position()
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    setItems(prev => prev.map(it => {
      if (it.id !== id) return it
      const next = { ...it, rotation }

      if (cls === 'Rect' || cls === 'Image') {
        const newW = Math.max(1, node.width() * scaleX)
        const newH = Math.max(1, node.height() * scaleY)
        next.w = newW
        next.h = newH
        next.x = pos.x
        next.y = pos.y
      } else if (cls === 'Ellipse') {
        const rx = node.radiusX() * scaleX
        const ry = node.radiusY() * scaleY
        const newW = Math.max(1, rx * 2)
        const newH = Math.max(1, ry * 2)
        next.w = newW
        next.h = newH
        next.x = pos.x - newW / 2
        next.y = pos.y - newH / 2
      } else if (cls === 'Line') {
        // Assar (bake) a escala nos points e manter posição
        const oldPts = node.points()
        const newPts = oldPts.map((v, i) => i % 2 === 0 ? v * scaleX : v * scaleY)
        next.points = newPts
        next.x = pos.x
        next.y = pos.y
      } else if (cls === 'Arrow') {
        const dx = pos.x - (it.x || 0)
        const dy = pos.y - (it.y || 0)
        next.x = pos.x
        next.y = pos.y
        next.x1 = it.x1 + dx
        next.y1 = it.y1 + dy
        next.x2 = it.x2 + dx
        next.y2 = it.y2 + dy
      }

      return next
    }))

    node.scaleX(1)
    node.scaleY(1)
  }

  // Imagem
  const fileRef = useRef(null)
  const onPickImage = () => fileRef.current?.click()
  const onImage = (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const id = idSeq.current++
      setItems(prev => [...prev, { id, kind:'image', x:MARGIN+PAD, y:MARGIN+PAD, w:220, h:160, rotation:0, src: reader.result }])
      setTool('select'); setSelectedIds([id])
    }
    reader.readAsDataURL(file)
    ev.target.value = ''
  }

  // Texto foco
  useEffect(() => { if (tool==='text' && editor) editor.commands.focus('end') }, [tool, editor])

  // Texto: estilos
  const setFontFamily = (ff) => { restoreSelection(); editor?.commands.setFontFamily(ff); }
  const setFontSize = (px) => { restoreSelection(); editor?.commands.setMark('textStyle', { fontSize: String(px)+'px' }); }
  const setFontColor = (hex) => { restoreSelection(); editor?.commands.setColor(hex); }

  const totalH = pages * A4_H
  const stagePointerEvents = tool !== 'text' ? 'auto' : 'none'

  return (
    <Layout>
      <div className="flex gap-4 h-full">
        <div className="flex-1 overflow-auto">
          <div className="w-full flex justify-center">
            <div className="relative my-6" style={{ width: A4_W, height: totalH }}>

              {/* Páginas A4 */}
              {Array.from({ length: pages }).map((_, i) => (
                <div key={i} className="absolute bg-white shadow-2xl border rounded-xl"
                     style={{ top: i*A4_H, left: 0, width: A4_W, height: A4_H }}>
                  {/* Máscaras com z-index alto para esconder fora das margens */}
                  <div className="absolute bg-white" style={{ top:0, left:0, right:0, height:MARGIN, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute bg-white" style={{ bottom:0, left:0, right:0, height:MARGIN, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute bg-white" style={{ top:0, bottom:0, left:0, width:MARGIN, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute bg-white" style={{ top:0, bottom:0, right:0, width:MARGIN, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute pointer-events-none border-2 border-gray-200 rounded-lg"
                       style={{ top:MARGIN, left:MARGIN, right:MARGIN, bottom:MARGIN, zIndex:45 }}/>
                  <div className="absolute bg-white" style={{ top:MARGIN, left:MARGIN, right:MARGIN, height:PAD, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute bg-white" style={{ bottom:MARGIN, left:MARGIN, right:MARGIN, height:PAD, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute bg-white" style={{ top:MARGIN, bottom:MARGIN, left:MARGIN, width:PAD, zIndex:50, pointerEvents:'none' }} />
                  <div className="absolute bg-white" style={{ top:MARGIN, bottom:MARGIN, right:MARGIN, width:PAD, zIndex:50, pointerEvents:'none' }} />
                </div>
              ))}

              {/* TEXTO */}
              <div
                ref={editorWrapRef}
                className="absolute"
                style={{
                  top: MARGIN + PAD,
                  left: MARGIN + PAD,
                  width: INNER_W,
                  height: pages * (A4_H - (2*MARGIN + 2*PAD)),
                  zIndex: tool==='text' ? 20 : 10,
                  pointerEvents: tool==='text' ? 'auto' : 'none'
                }}
                onMouseDown={() => { if (tool==='text') editor?.commands.focus('end') }}
              >
                <EditorContent editor={editor} />
              </div>

              {/* DESENHO (Konva) */}
              <div
                className="absolute"
                style={{ top: 0, left:0, width: A4_W, height: totalH, zIndex: tool==='text' ? 10 : 30, pointerEvents: stagePointerEvents }}
              >
                <KonvaBoard
                  stageRef={stageRef}
                  width={A4_W}
                  height={totalH}
                  items={items}
                  selectedIds={selectedIds}
                  tool={tool}
                  onStageMouseDown={onStageMouseDown}
                  onStageMouseMove={onStageMouseMove}
                  onStageMouseUp={onStageMouseUp}
                  onItemClick={onItemClick}
                  onDragMove={onDragMove}
                  onTransformEnd={(id, node) => onTransformEnd(id, node)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Barra lateral */}
        <aside className="w-72 shrink-0 space-y-4">
          <h2 className="text-lg font-semibold">Ferramentas</h2>
          <div className="grid grid-cols-2 gap-2">
            <Btn active={tool==='select'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('select')}>Mouse</Btn>
            <Btn active={tool==='text'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('text')}>Texto</Btn>
            <Btn active={tool==='pen'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('pen')}>Caneta</Btn>
            <Btn active={tool==='eraser'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('eraser')}>Borracha</Btn>
            <Btn active={tool==='rect'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('rect')}>Retângulo</Btn>
            <Btn active={tool==='ellipse'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('ellipse')}>Círculo</Btn>
            <Btn active={tool==='arrow'} onMouseDown={(e)=>e.preventDefault()} onClick={()=>setTool('arrow')}>Seta</Btn>
            <label className="botao-padrao w-full text-sm py-2 rounded-xl text-center cursor-pointer">
              Imagem<input type="file" className="hidden" accept="image/*" onChange={onImage} onClick={(e)=>{ e.target.value=null }} />
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Texto</h3>
            <label className="block text-xs text-gray-600">Fonte</label>
            <select className="w-full border rounded-md p-2" onMouseDown={(e)=>e.preventDefault()} onChange={(e)=>setFontFamily(e.target.value)}>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
              <option value="'Times New Roman', Times, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, Geneva, sans-serif">Verdana</option>
              <option value="'Courier New', Courier, monospace">Courier New</option>
            </select>

            <label className="block text-xs text-gray-600">Tamanho</label>
            <input type="number" min="8" max="72" defaultValue="16" className="w-full border rounded-md p-2"
                   onMouseDown={(e)=>e.preventDefault()}
                   onChange={(e)=>{ const v = parseInt(e.target.value || '16',10); if(!isNaN(v)) setFontSize(v) }} />

            <label className="block text-xs text-gray-600">Cor</label>
            <input type="color" defaultValue="#000000" className="w-full h-10 border rounded-md p-1"
                   onMouseDown={(e)=>e.preventDefault()}
                   onChange={(e)=>setFontColor(e.target.value)} />
          </div>

          <p className="text-xs text-gray-500">
            Atalhos: V=Mouse, T=Texto, P=Caneta, E=Borracha, R=Retângulo, C=Círculo, A=Seta. Del=excluir seleção.
          </p>
        </aside>
      </div>

      <style jsx global>{`
        .tiptap-content {
          outline: none;
          font-size: 16px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          width: 100%;
          max-width: 100%;
        }
        .tiptap-content p { margin: 0 0 0.75rem 0; }
        .tiptap h1 { font-size: 2rem; margin: 1rem 0; }
        .tiptap h2 { font-size: 1.5rem; margin: 0.75rem 0; }
        .tiptap h3 { font-size: 1.25rem; margin: 0.5rem 0; }
      `}</style>
    </Layout>
  )
}

function Btn({ children, onClick, active, onMouseDown }) {
  return (
    <button
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`botao-padrao w-full text-sm py-2 rounded-xl ${active ? 'ring-2 ring-blue-300' : ''}`}
    >
      {children}
    </button>
  )
}

// ===== Helpers =====
function boundsOf(it) {
  if (!it) return { x:0, y:0, w:0, h:0 }
  if (it.kind==='pen' || it.kind==='eraser') return boundsFromFlatPoints(it.points || [])
  if (it.kind==='rect' || it.kind==='ellipse') return normRect(it.x, it.y, it.w, it.h)
  if (it.kind==='arrow') {
    const x = Math.min(it.x1, it.x2), y = Math.min(it.y1, it.y2)
    const w = Math.abs(it.x2 - it.x1), h = Math.abs(it.y2 - it.y1)
    return { x, y, w, h }
  }
  if (it.kind==='image') return { x: it.x, y: it.y, w: it.w || 0, h: it.h || 0 }
  return { x:0, y:0, w:0, h:0 }
}

function boundsFromFlatPoints(pts) {
  if (!pts || pts.length<2) return { x:0, y:0, w:0, h:0 }
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity
  for (let i=0;i<pts.length;i+=2) {
    const x=pts[i], y=pts[i+1]
    if (x<minX) minX=x
    if (y<minY) minY=y
    if (x>maxX) maxX=x
    if (y>maxY) maxY=y
  }
  return { x:minX, y:minY, w:maxX-minX, h:maxY-minY }
}

function normRect(x, y, w, h) {
  const nx = Math.min(x, x + w)
  const ny = Math.min(y, y + h)
  return { x: nx, y: ny, w: Math.abs(w), h: Math.abs(h) }
}

function intersects(a, b) {
  if (!a || !b) return false
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y)
}
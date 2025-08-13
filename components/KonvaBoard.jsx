import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect as KRect, Ellipse as KEllipse, Arrow as KArrow, Line as KLine, Image as KImage, Transformer } from 'react-konva'

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

export default function KonvaBoard({
  width,
  height,
  items,
  selectedIds,
  tool,
  stageRef,
  onStageMouseDown,
  onStageMouseMove,
  onStageMouseUp,
  onItemClick,
  onDragMove,
  onTransformEnd,
}) {
  const layerRef = useRef(null)
  const trRef = useRef(null)

  useEffect(() => {
    const tr = trRef.current
    const layer = layerRef.current
    if (!tr || !layer) return
    const nodes = selectedIds.map(id => layer.findOne(`#node-${id}`)).filter(Boolean)
    tr.nodes(nodes)
    tr.getLayer()?.batchDraw()
  }, [selectedIds, items])

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={onStageMouseDown}
      onMouseMove={onStageMouseMove}
      onMouseUp={onStageMouseUp}
    >
      <Layer ref={layerRef}>
        {items.map(it => {
          const common = {
            id: `node-${it.id}`,
            key: it.id,
            onClick: (e)=>onItemClick(it.id, e),
            draggable: tool==='select',
            onDragMove: (e)=>onDragMove(it.id, e),
            rotation: it.rotation || 0,
          }
          if (it.kind==='pen') {
            return <KLine {...common} points={it.points} closed={false} stroke="black" strokeWidth={2} />
          }
          if (it.kind==='rect') {
            return <KRect {...common} x={it.x} y={it.y} width={Math.abs(it.w)} height={Math.abs(it.h)} stroke="black" />
          }
          if (it.kind==='ellipse') {
            return <KEllipse {...common} x={it.x + it.w/2} y={it.y + it.h/2} radiusX={Math.abs(it.w/2)} radiusY={Math.abs(it.h/2)} stroke="black" />
          }
          if (it.kind==='arrow') {
            return <KArrow {...common} points={[it.x1, it.y1, it.x2, it.y2]} pointerLength={10} pointerWidth={10} stroke="black" fill="black" strokeWidth={2} />
          }
          if (it.kind==='image') {
            const img = new window.Image()
            img.src = it.src
            return <KImage {...common} x={it.x} y={it.y} width={it.w} height={it.h} image={img} />
          }
          if (it.kind==='eraser') return null
          return null
        })}
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={['top-left','top-right','bottom-left','bottom-right','middle-left','middle-right','top-center','bottom-center']}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5) ? oldBox : newBox}
          onTransformEnd={() => {
            const node = trRef.current.nodes()[0]
            if (!node) return
            const id = parseInt((node.id() || '').replace('node-',''))
            onTransformEnd(id, node)
          }}
        />
      </Layer>
    </Stage>
  )
}
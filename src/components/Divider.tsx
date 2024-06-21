import React from 'react'

interface DividerProps {
  size?: number
  border?: boolean
  className?: string
}

function Divider({ size = 8, border, className }: DividerProps) {
  return border ? (
    <div className={`border ${className}`} style={{ marginTop: size * 4, marginBottom: size * 4 }} />
  ) : (
    <div
      style={{
        paddingTop: size * 4,
      }}
    />
  )
}

export default Divider

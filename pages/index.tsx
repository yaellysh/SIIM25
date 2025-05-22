import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import NavBar from './navBar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const images = [
  { src: '/Matplotlib_Chart.png', label: 'Chart' },
  { src: '/scan_eight.png', label: 'Scan 8' },
  { src: '/scan_five.png', label: 'Scan 5' },
  { src: '/scan_four.png', label: 'Scan 4' },
]

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(45)
  const [topHeight, setTopHeight] = useState(75)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingCol = useRef(false)
  const isDraggingRow = useRef(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()

    if (isDraggingCol.current) {
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      if (newLeftWidth > 20 && newLeftWidth < 80) setLeftWidth(newLeftWidth)
    }

    if (isDraggingRow.current) {
      const leftPanel = containerRef.current.querySelector('#left-panel') as HTMLElement
      if (!leftPanel) return
      const leftRect = leftPanel.getBoundingClientRect()
      const newTopHeight = ((e.clientY - leftRect.top) / leftRect.height) * 100
      if (newTopHeight > 20 && newTopHeight < 80) setTopHeight(newTopHeight)
    }
  }

  const startDraggingCol = () => {
    isDraggingCol.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopDragging)
  }

  const startDraggingRow = () => {
    isDraggingRow.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopDragging)
  }

  const stopDragging = () => {
    isDraggingCol.current = false
    isDraggingRow.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', stopDragging)
  }

  return (
    <div
      ref={containerRef}
      className={`${geistSans.className} ${geistMono.className} w-screen h-screen flex font-[family-name:var(--font-geist-sans)]`}
    >
      {/* Left Panel */}
      <div id="left-panel" className="bg-black text-white flex flex-col" style={{ width: `${leftWidth}%` }}>
        {/* Top Row */}
        <div className="p-8 w-full" style={{ height: `${topHeight}%` }}>
            <h2 className="text-lg font-bold mb-2">Uploaded Scan</h2>
            <div className="w-full h-full flex flex-col items-center justify-center pb-8">
            <div className="flex w-full max-w-[90%]">
              {images.map((img, idx) => (
              <button
                key={img.src}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 px-3 text-sm border ${
                activeIndex === idx
                  ? 'bg-teal-500 text-white'
                  : 'border-gray-400 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {img.label}
              </button>
              ))}
            </div>
            <div className="relative w-full max-w-[90%] max-h-[90%] aspect-square border-2 border-teal-400">
              <Image
              src={images[activeIndex].src}
              alt={`Image ${activeIndex + 1}`}
              fill
              className="rounded-sm object-cover"
              />
            </div>
          </div>
        </div>

        {/* Row Divider */}
        <div
          className="h-2 cursor-row-resize bg-gray-600 hover:bg-gray-400 transition"
          onMouseDown={startDraggingRow}
        />

        {/* Bottom Row */}
        <div className="p-8 w-full overflow-y-auto" style={{ flexGrow: 1 }}>
          <h2 className="text-lg font-bold mb-2">Patient Overview</h2>
          <p className="text-sm text-gray-300">Name: John Doe</p>
          <p className="text-sm text-gray-300">Age: 45</p>
          <p className="text-sm text-gray-300">Condition: Stable</p>
        </div>
      </div>

      {/* Column Divider */}
      <div
        className="w-2 cursor-col-resize bg-gray-600 hover:bg-gray-400 transition"
        onMouseDown={startDraggingCol}
      />

      {/* Right Panel */}
      <div className="bg-black p-8 flex-grow flex flex-col items-start overflow-y-auto text-white">
        <h2 className="text-xl font-semibold mb-4">Imaging Problem List</h2>
        <ul className="space-y-4">
          <li className="border-l-4 border-gray-500 pl-4">
            <h3 className="text-md font-bold text-white">Tear of Anterior Cruciate Ligament (ACL)</h3>
            <p className="text-sm text-gray-300">Status: <span className="font-medium text-green-400">Confirmed</span></p>
            <p className="text-sm text-gray-300">Onset: May 1, 2025</p>
            <p className="text-sm text-gray-300">Code: SNOMED CT 30812006</p>
          </li>

          <li className="border-l-4 border-gray-500 pl-4">
            <h3 className="text-md font-bold text-white">Mechanism of Injury</h3>
            <p className="text-sm text-gray-300">Narrative: Twisted knee during soccer game</p>
            <p className="text-sm text-gray-300">Code: LOINC 11376-1</p>
            <p className="text-sm text-gray-300">Date: May 1, 2025</p>
          </li>

          <li className="border-l-4 border-gray-500 pl-4">
            <h3 className="text-md font-bold text-white">MRI Findings</h3>
            <p className="text-sm text-gray-300">Narrative: Complete ACL rupture, mild joint effusion</p>
            <p className="text-sm text-gray-300">Modality: MRI</p>
            <p className="text-sm text-gray-300">Date: May 3, 2025</p>
          </li>

          <li className="border-l-4 border-gray-500 pl-4">
            <h3 className="text-md font-bold text-white">Secondary Signs</h3>
            <p className="text-sm text-gray-300">Bone bruise pattern involving lateral femoral condyle and lateral tibial plateau</p>
            <p className="text-sm text-gray-300">Code: SNOMED CT 111233009</p>
          </li>

          <li className="border-l-4 border-gray-500 pl-4">
            <h3 className="text-md font-bold text-white">Surgical Planning</h3>
            <p className="text-sm text-gray-300">Referral for orthopedic consultation placed</p>
            <p className="text-sm text-gray-300">Planned: Arthroscopic ACL reconstruction</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">SIIM Dashboard</div>
      <div className="flex space-x-4">
        <a href="#" className="hover:underline">
          Home
        </a>
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Contact
        </a>
      </div>
    </nav>
  )
}

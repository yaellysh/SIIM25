import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const patients = [
  {
    id: '001',
    name: 'John Doe',
    age: 45,
    status: 'Stable',
    complaint: 'Right knee pain after soccer injury',
    image: '/scan_four.png',
  },
  {
    id: '002',
    name: 'Jane Smith',
    age: 52,
    status: 'Pending Surgery',
    complaint: 'Shoulder dislocation during fall',
    image: '/scan_five.png',
  },
  {
    id: '003',
    name: 'Leo Turner',
    age: 60,
    status: 'Recovered',
    complaint: 'Hip replacement follow-up',
    image: '/scan_eight.png',
  },
  {
    id: '004',
    name: 'Maya Lin',
    age: 39,
    status: 'Under Evaluation',
    complaint: 'Lower back pain with numbness',
    image: '/Matplotlib_Chart.png',
  },
]

export default function Dashboard() {
  return (
    <div className={`min-h-screen bg-black text-white ${geistSans.className} ${geistMono.className}`}>
      <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Mission: Extraction</div>
        <div className="flex space-x-4 text-sm">
          <Link href="#" className="hover:underline">
            Home
          </Link>
          <Link href="#" className="hover:underline">
            About
          </Link>
          <Link href="#" className="hover:underline">
            Contact
          </Link>
        </div>
      </nav>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-md">
              <div className="relative w-full aspect-video rounded overflow-hidden border-2 border-teal-400 mb-4">
                <Image
                  src={patient.image}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold">{patient.name}</h2>
              <p className="text-sm text-gray-300">Age: {patient.age}</p>
              <p className="text-sm text-gray-300">Status: <span className="text-teal-400 font-medium">{patient.status}</span></p>
              <p className="text-sm text-gray-400 mt-2">{patient.complaint}</p>
              <Link href={`/#`} className="mt-3 inline-block text-sm text-teal-400 hover:underline">
                View Record →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

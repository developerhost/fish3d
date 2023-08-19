import Image from 'next/image'
import { Inter } from 'next/font/google'
import * as THREE from 'three'
import { useEffect } from 'react'
import ThreeObj from '@/components/ThreeObj'
import ThreeObjShark from '@/components/ThreeObjShark'
import GeoOcean from '@/components/GeoOcean'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // console.log(THREE)
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        {/* <ThreeObj /> */}
        {/* <ThreeObjShark /> */}
        <GeoOcean />
      </div>
    </main>
  )
}

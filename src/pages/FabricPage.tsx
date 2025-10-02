import React from 'react'
import FabricCard from '../components/FabricCard'
import { useParams } from 'react-router-dom'

export default function FabricPage() {
  const {fabricId} = useParams();
  const fabric = {
    id: fabricId as string  ,
    name: 'Floral Cotton Print',
    price: '$12.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY',
    description: 'A beautiful floral print cotton fabric perfect for summer dresses and light clothing. Made from 100% organic cotton with a soft hand feel.',
    type: 'Cotton',
    width: '150cm',
    weight: '150gsm',
    careInstructions: 'Machine wash cold, gentle cycle. Do not bleach. Tumble dry low. Iron on low heat.',
    stock: 25,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    sku: 'FCP-001',
    tags: ['summer', 'floral', 'lightweight', 'breathable']
  }
  return (
    <div className=' w-full flex flex-col items-center justify-center my-2'>
        <FabricCard   buttonTitle='احجز الأن' fabric={fabric} />
    </div>
  )
}

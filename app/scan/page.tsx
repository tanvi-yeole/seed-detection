import { ImageUploader } from '@/components/shared/ImageUpload'
import SeedScanner from '@/components/shared/Scanner'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-[100dvh] mx-20'>
      {/* <ImageUploader/> */}
      <SeedScanner/>
    </div>
  )
}

export default page

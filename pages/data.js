import { useRouter } from 'next/router'
import React from 'react'

const data = () => {
    const router = useRouter()
    console.log(router.query)
    
  return (
    <div>
      <h1>Hello!</h1>
      <a src={router.query.venu}>{router.query.venu}</a>
    </div>
  )
}

export default data



import React from 'react'
import {Link} from 'react-router-dom'
import {FaQuestionCircle,FaTicketAlt} from 'react-icons/fa'
function Home() {
  return (
    <>
    <section className='heading'>
        <h1>What do you need help With ?</h1>
        <p>Please choose from an option below</p>

    </section>
    <Link to='/newfasttag' className='btn btn-reverse'>
    <FaQuestionCircle/>New FastTag
    </Link>

    <Link to='/simulation' className='btn btn-reverse'>
    <FaQuestionCircle/>SIMULATION
    </Link>
    
    </>
  )
}

export default Home

import React from 'react'

import  '../css/styles.css'
import Header from '../components/header'
import Footer from '../components/footer'

const MyApp = ({Component, pageProps}) =>{

    return (
    <div>
      <Header/>
           
           <div className="container mx-auto">
                <Component {...pageProps} />
            </div>
      <Footer /> 
    </div>
    )
}

export default MyApp
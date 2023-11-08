import React from 'react'
import '../scss/games.scss'
import {motion} from 'framer-motion';
import Deep from '../images/Group 3.png'
const Games = () => {
  return (
    <div className="games">
       <motion.h2 initial={{ opacity: 0, y: 150 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }} transition={{duration:0.7 , type:"Spring" , bounce:0.4}}>Fun Time Games</motion.h2>
        <div className="play">
          <div className="box">
          <img src={Deep} alt="ef" />
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam fuga eaque consequatur atque, velit aperiam. Aspernatur culpa consequuntur aliquam amet sit, voluptatem doloribus corrupti possimus quas molestiae at explicabo fuga?</p>
          <button>Start</button>
          </div>
        </div>
    </div>
  )
}

export default Games
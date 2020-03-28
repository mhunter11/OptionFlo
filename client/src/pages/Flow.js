import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import FlowList from './FlowList'

// import styles from './Flow.module.css'

export default function Flow() {
  const [options, setOptions] = useState([])

  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080')

    socket.on('all_options', data =>
      setOptions(data)
    )

    socket.on('options', function (data) {
      let newOptionData = options
      newOptionData.unshift(...data)
      setOptions(newOptionData)
    })
  }, []);


  return (
    <div>
      <div>
        <ul>
          {options.map((data, index) => (
            <FlowList {...data} key={index} />
          ))}
        </ul>
      </div>
    </div>
  )

}

import React, {useState, useEffect, useContext} from 'react'
import {Redirect} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import {useQuery} from '@apollo/react-hooks'

import styles from './Flow.module.css'

import {GET_OPTIONS, GET_USER_INFO} from '../../util/gql'

import {AuthContext} from '../../context/auth'
import {ENVIRONMENT} from '../../env'

import FlowList from './FlowList'

export default function Flow() {
  const [options, setOptions] = useState([])
  const [saveOptions, setSaveOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [todayPuts, setTodayPuts] = useState(0)
  const [todayCalls, setTodayCalls] = useState(0)

  const {user} = useContext(AuthContext)
  let todayOptionData = []

  const {loading: loadingR, error: errorR, data: dataR} = useQuery(
    GET_USER_INFO,
    {
      variables: {
        myUserId: user ? user.id : null,
      },
    }
  )

  const {loading, error, data} = useQuery(GET_OPTIONS)

  function todayCount(put_call) {
    put_call.map(data => {
      if (data.put_call === 'CALL') {
        let newCalls = todayCalls++
        setTodayCalls(newCalls)
      }
      if (data.put_call === 'PUT') {
        let newPuts = todayPuts++
        setTodayPuts(newPuts)
      }
    })
  }

  function filterData(ticker) {
    if (!ticker) return null
    ticker = ticker.toUpperCase()
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()

    today = yyyy + '-' + mm + '-' + dd
    if (data !== undefined) {
      // TODO: on weekends show previous option on friday
      data.getOptions.map(data => {
        if (data.date === today) {
          todayOptionData.push(data)
        }

        return todayOptionData
      })
      // today option data that is saved on the database
    }

    // filtered option data
    const filteredOptionData = todayOptionData.filter(x => x.ticker === ticker)

    setSaveOptions(filteredOptionData.reverse())
    setFilteredOptions(!filteredOptions)
  }

  useEffect(() => {
    const socket = socketIOClient(ENVIRONMENT.DATA_SERVER_URL)

    socket.on('all_options', function (data) {
      setOptions(options => [...data, ...options])
      // todayCount(data)
    })

    socket.on('options', function (data) {
      setOptions(options => [...data, ...options])
      // todayCount(data)
    })

    socket.on('clear', function () {
      setOptions([])
    })
  }, [])

  if (loadingR) {
    return <div>Loading...</div>
  }

  if (errorR) {
    console.error(errorR)
    return <Redirect to="/" />
  }

  if (!user && !loadingR) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (!dataR && !loadingR) {
    return <Redirect to="/" />
  }

  if (!dataR.getUser && !loadingR) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (dataR.getUser.type === 'free' || dataR.getUser.type === '') {
    return <Redirect to="/subscription">Please subscribe</Redirect>
  }

  return (
    <div>
      <div className={styles.input_search}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyPress={e => (e.key === 'Enter' ? filterData(searchInput) : null)}
          placeholder="SPY"
        />
        <button onClick={() => filterData(searchInput)}>Filter</button>
      </div>
      <button onClick={() => setFilteredOptions(false)}>Reset</button>
      <ul className={styles.ul_list}>
        {!filteredOptions &&
          options.map((data, index) => (
            <FlowList
              {...data}
              key={index}
              onClick={() => filterData(data.ticker)}
            />
          ))}
        {filteredOptions &&
          saveOptions.map((data, index) => <FlowList {...data} key={index} />)}
      </ul>
    </div>
  )
}

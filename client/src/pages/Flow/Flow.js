import React, {useState, useEffect, useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import _ from 'lodash'

import styles from './Flow.module.scss'

import {GET_OPTIONS, GET_USER_INFO} from '../../util/gql'

import {socket} from '../../util/socket'
import {AuthContext} from '../../context/auth'

import FlowList from './FlowList'
import MobileFlowList from './MobileFlowList'

export default function Flow() {
  const [options, setOptions] = useState([])
  const [saveOptions, setSaveOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const {user} = useContext(AuthContext)
  // let todayOptionData = []

  const {loading: loadingR, error: errorR, data: dataR} = useQuery(
    GET_USER_INFO,
    {
      variables: {
        myUserId: user ? user.id : null,
      },
    }
  )

  // const {loading, error, data} = useQuery(GET_OPTIONS)
  function filterData(ticker) {
    if (!ticker || ticker.length === 0) {
      setFilteredOptions(false)
      setSearchInput('')
      return
    }
    // setSearchInput(ticker)
    // ticker = ticker.toUpperCase()
    // let today = new Date()
    // let dd = String(today.getDate()).padStart(2, '0')
    // let mm = String(today.getMonth() + 1).padStart(2, '0')
    // let yyyy = today.getFullYear()

    // today = yyyy + '-' + mm + '-' + dd
    // if (data !== undefined) {
    //   // TODO: on weekends show previous option on friday
    //   data.getOptions.map(data => {
    //     if (data.date === today) {
    //       todayOptionData.push(data)
    //     }

    //     return todayOptionData
    //   })
    //   // today option data that is saved on the database
    // }

    // socket data
    const filteredOptionData = options.filter(x => x.ticker === ticker)
    setSaveOptions(filteredOptionData)

    setFilteredOptions(true)
  }

  useEffect(() => {
    socket.on('all_options', function (data) {
      setOptions(options => [...options, ...data])
    })

    socket.on('options', data => {
      setOptions(options => _.uniqBy([...data, ...options], 'id'))

      data.map(dataOption => {
        if (dataOption.ticker === searchInput) {
          setSaveOptions(prevState =>
            _.uniqBy([dataOption, ...prevState], 'id')
          )
        }
      })
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

  let LAST_100_OPTIONS = _.takeRight(options, 200)

  return (
    <div className={styles.flow_background_color}>
      <div className={styles.desktop_view}>
        <div className={styles.input_search}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyPress={e =>
              e.key === 'Enter' ? filterData(searchInput) : null
            }
            placeholder="SPY"
          />
          <button onClick={() => filterData(searchInput)}>Filter</button>
        </div>
        <button onClick={() => setFilteredOptions(false)}>Reset</button>
        <div>
          <ul className={styles.ul_list}>
            {!filteredOptions &&
              LAST_100_OPTIONS.map(data => (
                <FlowList
                  ticker={data.ticker}
                  strike_price={data.strike_price}
                  date_expiration={data.date_expiration}
                  put_call={data.put_call}
                  option_activity_type={data.option_activity_type}
                  description={data.description}
                  sentiment={data.sentiment}
                  cost_basis={data.cost_basis}
                  updated={data.updated}
                  key={data.id}
                  onClick={() => filterData(data.ticker)}
                />
              ))}
            {filteredOptions &&
              saveOptions.map(data => (
                <FlowList
                  ticker={data.ticker}
                  strike_price={data.strike_price}
                  date_expiration={data.date_expiration}
                  put_call={data.put_call}
                  option_activity_type={data.option_activity_type}
                  description={data.description}
                  sentiment={data.sentiment}
                  cost_basis={data.cost_basis}
                  updated={data.updated}
                  key={data.id}
                />
              ))}
          </ul>
        </div>
      </div>
      <div className={styles.mobile_view}>
        <div className={styles.mobile_results_input}>
          {filteredOptions && (
            <div className={styles.mobile_results}>
              {saveOptions.length} Results
            </div>
          )}
          <div className={styles.input_search}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyPress={e =>
                e.key === 'Enter' ? filterData(searchInput) : null
              }
              placeholder="SPY"
            />
            <button onClick={() => filterData(searchInput)}>Filter</button>
          </div>
          <button onClick={() => setFilteredOptions(false)}>Reset</button>
        </div>
        <ul className={styles.ul_list}>
          {!filteredOptions &&
            LAST_100_OPTIONS.map(data => (
              <MobileFlowList
                ticker={data.ticker}
                strike_price={data.strike_price}
                date_expiration={data.date_expiration}
                put_call={data.put_call}
                option_activity_type={data.option_activity_type}
                description={data.description}
                cost_basis={data.cost_basis}
                updated={data.updated}
                key={data.id}
              />
            ))}
          {filteredOptions &&
            saveOptions.map(data => (
              <MobileFlowList
                ticker={data.ticker}
                strike_price={data.strike_price}
                date_expiration={data.date_expiration}
                put_call={data.put_call}
                option_activity_type={data.option_activity_type}
                description={data.description}
                cost_basis={data.cost_basis}
                updated={data.updated}
                key={data.id}
              />
            ))}
        </ul>
      </div>
    </div>
  )
}

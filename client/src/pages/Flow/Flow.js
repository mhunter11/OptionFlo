import React, {useState, useEffect, useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import {FixedSizeList as List} from 'react-window'
import _ from 'lodash'
import io from 'socket.io-client'

import styles from './Flow.module.scss'

import {
  FLOW_ROW_NAME,
  HEIGHT,
  WIDTH,
  ITEM_SIZE,
  MOBILE_WIDTH,
  MOBILE_HEIGHT,
  MOBILE_ITEM_SIZE,
  CLASSNAME,
} from './flow-data'

import VirtualTable from '../../components/VirtualTable';

import {GET_USER_INFO, GETS_OPTIONS_BY_DATE} from '../../util/gql'

import {FirebaseContext} from '../../context/auth'
import {ENVIRONMENT} from '../../env'

import FlowList from './FlowList'
import MobileFlowList from './MobileFlowList'
import Loading from '../../components/Loading'

export default function Flow() {
  const [options, setOptions] = useState([])
  const [saveOptions, setSaveOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
  const [searchTicker, setSearchTicker] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const {firebase, currentUser} = useContext(FirebaseContext)
  const socket = io(ENVIRONMENT.DATA_SERVER_URL, {transports: ['websocket']})
  const user = currentUser
  // let todayOptionData = []
  let todayOptionsTraded = []
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0')
  let yyyy = today.getFullYear()

  today = yyyy + '-' + mm + '-' + dd
  const {loading: loadingR, error: errorR, data: dataR} = useQuery(
    GET_USER_INFO,
    {
      variables: {
        myUserId: user ? user.uid : null,
      },
    }
  )

  const {loading, error, data} = useQuery(GETS_OPTIONS_BY_DATE, {
    variables: {
      inputDate: today,
      // inputTicker: searchInput,
    },
  })

  function filterData(ticker) {
    if (!ticker || ticker.length === 0) {
      clearFilter()
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
    const filteredOptionData = options.filter(
      x => x.ticker === ticker.toUpperCase()
    )
    const filteredDatabaseData = todayOptionsTraded.filter(
      x => x.ticker === ticker.toUpperCase()
    )

    _.uniqBy(filteredOptionData, 'id').map(x => (x.option_id = x.id))

    const filteredData = _.uniqBy(
      [...filteredOptionData, ...filteredDatabaseData.reverse()],
      'option_id'
    )
    setSaveOptions(filteredData)

    setFilteredOptions(true)
    // setSearchInput(ticker)
  }

  const Row = ({index, style}) => (
      <FlowList
        ticker={options[index].ticker}
        strike_price={options[index].strike_price}
        date_expiration={options[index].date_expiration}
        put_call={options[index].put_call}
        option_activity_type={options[index].option_activity_type}
        description={options[index].description}
        sentiment={options[index].sentiment}
        cost_basis={options[index].cost_basis}
        updated={options[index].updated}
        onClick={() => filterData(options[index].ticker)}
      />
  )

  const MobileRow = ({index, style}) => (
    <div key={index} style={style}>
      <MobileFlowList
        ticker={options[index].ticker}
        strike_price={options[index].strike_price}
        date_expiration={options[index].date_expiration}
        put_call={options[index].put_call}
        option_activity_type={options[index].option_activity_type}
        description={options[index].description}
        cost_basis={options[index].cost_basis}
        updated={options[index].updated}
      />
    </div>
  )

  if (data !== undefined) {
    todayOptionsTraded = data.getOptionsByDate
  }

  function filterInput(ticker) {
    if (!ticker || ticker.length === 0) {
      setSearchTicker(false)
    }

    setSearchInput(ticker)
    setSearchTicker(true)
  }

  function clearFilter() {
    setFilteredOptions(false)
    setSearchInput('')
    setSearchTicker(false)
  }

  useEffect(() => {
    socket.on('all_options', function (data) {
      setOptions(options => [...options, ...data])
    })

    socket.on('options', data => {
      setOptions(options => _.uniqBy([...data, ...options], 'id'))

      data.map(dataOption => {
        if (dataOption.ticker === searchInput) {
          setSaveOptions(prevState => _.uniqBy([dataOption, ...prevState]))
        }
      })
    })

    socket.on('clear', function () {
      setOptions([])
    })

    return () => {
      socket.close()
    }
  }, [])

  if (loadingR) {
    return <Loading />
  }

  if (errorR) {
    if (!firebase.user) {
      return <Redirect to="/" />
    } else {
      //Keep loading if we're waiting for a user that is logged in
      return <Loading />
    }
  }

  if (dataR == null) {
    //firebase.auth.signOut(); //Just sign the user out
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
      <VirtualTable
        itemCount={options.length}
        itemSize={ITEM_SIZE}
        width={WIDTH}
        height={HEIGHT}
        className={styles.flow_table}
        header={
            <thead>
            <tr style={{height: '50px'}}>
              {FLOW_ROW_NAME.map(data => {
                return (
                  <th
                    className={styles.flow_header_text}
                    key={data.name}
                  >
                    {data.name}
                  </th>
                )
              })}
            </tr>
            </thead>
        }
        row={Row}
      />

      {/*
      <table className={styles.flow_table}>
        <tr>
        
        </tr>
        <tr>
          {filteredOptions && saveOptions.length === 0 && (
            <div className={styles.no_options_found}>No Items Found</div>
          )}
          {!filteredOptions && !searchTicker && (
            <List
              className={CLASSNAME}
              height={HEIGHT}
              itemCount={options.length}
              itemSize={ITEM_SIZE}
              width={WIDTH}
            >
              {Row}
            </List>
          )}
          {filteredOptions &&
            saveOptions.map((data, index) => (
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
                key={index}
              />
            ))}
        </tr>
      </table>

    <div className={styles.flow_background_color}>
      <div className={styles.desktop_view}>
        <div className={styles.row_list}>
          {FLOW_ROW_NAME.map(data => {
            return (
              <div
                className={styles.row_name}
                style={{
                  paddingLeft: `${data.padding}rem`,
                }}
                key={data.name}
              >
                {data.name}
              </div>
            )
          })}
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
            <button
              className={styles.button}
              onClick={() => filterData(searchInput)}
            >
              Filter
            </button>
            <button
              className={styles.button}
              onClick={() => setFilteredOptions(false)}
            >
              Reset
            </button>
          </div>
        </div>
        <div>
          <ul className={styles.ul_list}>
            {filteredOptions && saveOptions.length === 0 && (
              <div className={styles.no_options_found}>No Items Found</div>
            )}
            {!filteredOptions && !searchTicker && (
              <List
                className={CLASSNAME}
                height={HEIGHT}
                itemCount={options.length}
                itemSize={ITEM_SIZE}
                width={WIDTH}
              >
                {Row}
              </List>
            )}
            {filteredOptions &&
              saveOptions.map((data, index) => (
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
                  key={index}
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
            <div>
              <input
                className={styles.input}
                type="text"
                value={searchInput}
                onChange={e => filterInput(e.target.value)}
                onKeyPress={e =>
                  e.key === 'Enter' ? filterData(searchInput) : null
                }
                placeholder="SPY"
              />
              {searchTicker && (
                <button
                  className={styles.close_icon}
                  type="reset"
                  onClick={clearFilter}
                />
              )}
            </div>
          </div>
        </div>
        <ul className={styles.ul_list}>
          {filteredOptions && saveOptions.length === 0 && (
            <div className={styles.no_options_found}>No Items Found</div>
          )}
          {!filteredOptions &&
            !searchTicker &&
            options.map((data, index) => (
              <MobileFlowList
                ticker={data.ticker}
                strike_price={data.strike_price}
                date_expiration={data.date_expiration}
                put_call={data.put_call}
                option_activity_type={data.option_activity_type}
                description={data.description}
                cost_basis={data.cost_basis}
                updated={data.updated}
                key={index}
              />
            ))}
          {filteredOptions &&
            saveOptions.map((data, index) => (
              <MobileFlowList
                ticker={data.ticker}
                strike_price={data.strike_price}
                date_expiration={data.date_expiration}
                put_call={data.put_call}
                option_activity_type={data.option_activity_type}
                description={data.description}
                cost_basis={data.cost_basis}
                updated={data.updated}
                key={index}
              />
            ))}
        </ul>
      </div>
    </div>
            */}
    </div>
  )
}

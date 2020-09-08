import React, {useState, useEffect, useContext, useCallback} from 'react'
import {isMobile, isTablet} from 'react-device-detect'
import cx from 'classnames'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import {FixedSizeList as List} from 'react-window'
import uniqBy from 'lodash/uniqBy'
import io from 'socket.io-client'

import styles from './Flow.module.scss'

import {FLOW_ROW_NAME, HEIGHT, WIDTH, ITEM_SIZE, CLASSNAME} from './flow-data'

import {GET_USER_INFO, GETS_OPTIONS_BY_DATE} from '../../util/gql'

import {FirebaseContext} from '../../context/auth'
import {ENVIRONMENT} from '../../env'

import FlowList from './FlowList'
import InputField from './InputField'
import MobileFlowList from './MobileFlowList'
import Loading from '../../components/Loading'

export default function Flow() {
  const [options, setOptions] = useState([])
  const [saveOptions, setSaveOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTicker, setSearchTicker] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const {firebase, currentUser} = useContext(FirebaseContext)
  const socket = io(ENVIRONMENT.DATA_SERVER_URL, {transports: ['websocket']})
  const user = currentUser
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

    // socket data
    const filteredOptionData = options.filter(
      x => x.ticker === ticker.toUpperCase()
    )
    const filteredDatabaseData = todayOptionsTraded.filter(
      x => x.ticker === ticker.toUpperCase()
    )

    uniqBy(filteredOptionData, 'id').map(x => (x.option_id = x.id))

    const filteredData = uniqBy(
      [...filteredOptionData, ...filteredDatabaseData.reverse()],
      'option_id'
    )
    setSaveOptions(filteredData)

    setFilteredOptions(true)
    // setSearchInput(ticker)
  }

  const Row = ({index, style}) => (
    <div key={index} style={style}>
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
    </div>
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
      setOptions(options => uniqBy([...data, ...options], 'id'))

      data.map(dataOption => {
        if (dataOption.ticker === searchInput) {
          setSaveOptions(prevState => uniqBy([dataOption, ...prevState]))
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
    <div className={styles.flow_background_color}>
    {(!isMobile) && (
      <div className={styles.desktop_view}>
        <InputField
          onChange={e => filterInput(e.target.value)}
          onKeyPress={e => (e.key === 'Enter' ? filterData(searchInput) : null)}
          onClick={() => filterData(searchInput)}
          value={searchInput}
          filterButtonClick={() => setShowFilter(!showFilter)}
        />
        {showFilter && <div>Filtering</div>}
        <div className={styles.row_list}>
          {FLOW_ROW_NAME.map(data => {
            return (
              <div
                className={cx(styles.row_name, ([styles.mr_5]: marginRight))}
                key={data.name}
              >
                {data.name}
              </div>
            )
          })}
        </div>
        <div className={styles.container_list}>
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
    )}
    {(isTablet || isMobile) && (
    <div className={styles.mobile_view}>
      <div className={styles.mobile_results_input}>
        {filteredOptions && (
          <div className={styles.mobile_results}>
            {saveOptions.length} Results
          </div>
        )}
        <div className={styles.input_search}>
          <div className={styles.df}>
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
            <button className={styles.mobile_search_button}>Search</button>
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
              volume={data.volume}
              key={index}
            />
          ))}
      </ul>
    </div>
    )}
    </div>
  )
}

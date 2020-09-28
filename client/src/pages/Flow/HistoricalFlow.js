import React, {useState, useContext} from 'react'
import Calendar from 'react-calendar'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'

import styles from './Flow.module.scss'
import 'react-calendar/dist/Calendar.css';

import {GET_USER_INFO, GETS_OPTIONS_BY_DATE} from '../../util/gql'
import {todayDate} from './FlowListFunction'
import {HISTORICAL_FLOW_ROW_NAME} from './flow-data'
import FlowList from './FlowList'
import Loading from '../../components/Loading'
import {FirebaseContext} from '../../context/auth'

export default function HistoricalFlow() {
  const {currentUser} = useContext(FirebaseContext)
  const user = currentUser
  const [date, setDate] = useState(todayDate)
  const [searchInput, setSearchInput] = useState('')
  const [saveOptions, setSaveOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
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
      inputDate: date,
      // inputTicker: searchInput,
    },
  })

  let dataOptions

  if (!loading) {
    dataOptions = data.getOptionsByDate
  }

  function filterData(date) {
    if (!date || date.length === 0 || date.split('-').length !== 3) {
      return
    }
    setDate(date)
  }

  function filterTicker(ticker) {
    if (!ticker || ticker.length === 0) {
      setFilteredOptions(false)
      return
    }
    const filterData = dataOptions.filter(
      x => x.ticker === ticker.toUpperCase()
    )
    setFilteredOptions(true)
    setSaveOptions(() => [...filterData])
  }

  //"loadingR"
  if (loadingR) {
    return <Loading />
  }

  if (errorR) {
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
    return <Redirect to="/select-a-plan">Please subscribe</Redirect>
  }

  return (
    <div className={styles.flow_background_color}>
      <div className={styles.desktop_view}>
        <div className={styles.row_list}>
          {HISTORICAL_FLOW_ROW_NAME.map(data => {
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
              placeholder="YYYY-MM-DD"
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
          {filteredOptions &&
            dataOptions !== undefined &&
            saveOptions.map((data, index) => (
              <FlowList
                key={index}
                ticker={data.ticker}
                strike_price={data.strike_price}
                date_expiration={data.date_expiration}
                put_call={data.put_call}
                option_activity_type={data.option_activity_type}
                description={data.description}
                sentiment={data.sentiment}
                cost_basis={data.cost_basis}
                date={date}
                onClick={() => filterTicker(data.ticker)}
              />
            ))}
          {!filteredOptions &&
            dataOptions !== undefined &&
            dataOptions.map((data, index) => (
              <FlowList
                key={index}
                ticker={data.ticker}
                strike_price={data.strike_price}
                date_expiration={data.date_expiration}
                put_call={data.put_call}
                option_activity_type={data.option_activity_type}
                description={data.description}
                sentiment={data.sentiment}
                cost_basis={data.cost_basis}
                date={date}
                onClick={() => filterTicker(data.ticker)}
              />
            ))}
        </div>
      </div>
      <div className={styles.mobile_view}>Mobile isn't supposted yet</div>
    </div>
  )
}

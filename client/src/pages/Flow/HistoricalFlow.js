import React, {useState, useContext} from 'react'
import Calendar from 'react-calendar'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import {FixedSizeList as List} from 'react-window'

import {GET_USER_INFO, GETS_OPTIONS_BY_DATE} from '../../util/gql'
import {todayDate} from './FlowListFunction'
import {
  HISTORICAL_FLOW_ROW_NAME,
  MIN_DATE,
  HEIGHT,
  WIDTH,
  ITEM_SIZE,
  CLASSNAME,
} from './flow-data'
import FlowList from './FlowList'
import MobileFlowList from './MobileFlowList'
import Loading from '../../components/Loading'
import {AuthContext} from '../../context/auth'

import styles from './Flow.module.scss'
import 'react-calendar/dist/Calendar.css'

export default function HistoricalFlow() {
  const {user} = useContext(AuthContext)
  const [options, setOptions] = useState([])
  const [date, setDate] = useState(todayDate)
  const [searchInput, setSearchInput] = useState('')
  const [saveOptions, setSaveOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const {loading: loadingR, error: errorR, data: dataR} = useQuery(
    GET_USER_INFO,
    {
      variables: {
        myUserId: user ? user.id : null,
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

  if (data !== undefined) {
    dataOptions = data.getOptionsByDate
  }

  const memorizedDay = React.useMemo(
    () =>
      function pickCalendarDay(date) {
        let dd = String(date.getDate()).padStart(2, '0')
        let mm = String(date.getMonth() + 1).padStart(2, '0')
        let yyyy = date.getFullYear()

        const userPickCalendarDay = yyyy + '-' + mm + '-' + dd
        setDate(userPickCalendarDay)
        setOpenCalendar(false)
      },
    [date]
  )

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

  if (loading) {
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
    return <Redirect to="/subscription">Please subscribe</Redirect>
  }

  const Row = ({index, style}) => (
    <div key={index} style={style}>
      <FlowList
        ticker={dataOptions[index].ticker}
        strike_price={dataOptions[index].strike_price}
        date_expiration={dataOptions[index].date_expiration}
        put_call={dataOptions[index].put_call}
        option_activity_type={dataOptions[index].option_activity_type}
        description={dataOptions[index].description}
        sentiment={dataOptions[index].sentiment}
        cost_basis={dataOptions[index].cost_basis}
        date={date}
        onClick={() => filterTicker(dataOptions[index].ticker)}
      />
    </div>
  )

  const SavedOptions = ({index, style}) => (
    <div key={index} style={style}>
      <FlowList
        ticker={saveOptions[index].ticker}
        strike_price={saveOptions[index].strike_price}
        date_expiration={saveOptions[index].date_expiration}
        put_call={saveOptions[index].put_call}
        option_activity_type={saveOptions[index].option_activity_type}
        description={saveOptions[index].description}
        sentiment={saveOptions[index].sentiment}
        cost_basis={saveOptions[index].cost_basis}
        date={date}
        onClick={() => filterTicker(saveOptions[index].ticker)}
      />
    </div>
  )

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
          <div className={styles.historicalInput}>
            <div className={styles.calendar_button}>
              <button
                className={styles.button}
                onClick={() => setOpenCalendar(!openCalendar)}
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
            {openCalendar && (
              <Calendar
                minDate={MIN_DATE}
                onChange={memorizedDay}
                value={new Date()}
              />
            )}
          </div>
        </div>
        <div>
          <ul className={styles.ul_list}>
            {filteredOptions && (
              <List
                className={CLASSNAME}
                height={HEIGHT}
                itemCount={saveOptions.length}
                itemSize={ITEM_SIZE}
                width={WIDTH}
              >
                {SavedOptions}
              </List>
            )}
            {!filteredOptions && (
              <List
                className={CLASSNAME}
                height={HEIGHT}
                itemCount={dataOptions.length}
                itemSize={ITEM_SIZE}
                width={WIDTH}
              >
                {Row}
              </List>
            )}
          </ul>
        </div>
      </div>
      <div className={styles.mobile_view}>Not available on mobile yet</div>
    </div>
  )
}

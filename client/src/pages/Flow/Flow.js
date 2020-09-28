import React, {useState, useEffect, useContext, useCallback} from 'react'
import {isMobile, isTablet} from 'react-device-detect'
import cx from 'classnames'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import uniqBy from 'lodash/uniqBy'
import io from 'socket.io-client'

import styles from './Flow.module.scss'
import filterStyles from './FilterSection.module.scss'

import {
  FLOW_ROW_NAME,
  ASK,
  ONE_MILL,
  FIVE_HUNDRED,
  ABOVE_ASK,
  STOCK_ONLY,
  ETFS_ONLY,
  CALLS_ONLY,
  PUTS_ONLY,
  FIFTY_CENTS,
  SWEEPS_ONLY,
  FILTER_SELECTION,
} from './flow-data'

import {getBidOrAskOrder, getNewContractPrice} from './FlowListFunction'

import {GET_USER_INFO, GETS_OPTIONS_BY_DATE} from '../../util/gql'

import {FirebaseContext} from '../../context/auth'
import {ENVIRONMENT} from '../../env'

import FlowList from './FlowList'
import InputField from './InputField'
import MobileFlowList from './MobileFlowList'
import Loading from '../../components/Loading'

export default function Flow() {
  const [options, setOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTicker, setSearchTicker] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [openOrders, setOpenOrders] = useState(false)
  const [oneMill, setOneMill] = useState(false)
  const [aboveAsk, setAboveAsk] = useState(false)
  const [stockOnly, setStockOnly] = useState(false)
  const [etfOnly, setEtfOnly] = useState(false)
  const [callsOnly, setCallsOnly] = useState(false)
  const [putsOnly, setPutsOnly] = useState(false)
  const [sweepsOnly, setSweepsOnly] = useState(false)
  const [fiftyCents, setFiftyCents] = useState(false)
  const [fiveHundred, setFiveHundred] = useState(false)
  const [filterSelection, setFilterSelection] = useState(FILTER_SELECTION)
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

    setSearchInput(ticker)
  }

  const memoizedfilterData = useCallback(() => {
    filterData(searchInput)
  }, [searchInput])

  const reset = useCallback(() => {
    setFilterSelection(FILTER_SELECTION)
    setOpenOrders(false)
    setOneMill(false)
    setAboveAsk(false)
  }, [])

  const ButtonProps = [
    {
      children: 'Clear All',
      onClick: reset,
      className: filterStyles.clear_button,
    },
    {
      children: 'Done',
      onClick: () => setShowFilter(!showFilter),
      className: filterStyles.done_button,
    },
  ]

  if (data !== undefined) {
    todayOptionsTraded = data.getOptionsByDate
  }

  function filterInput(ticker) {
    if (!ticker || ticker.length === 0) {
      setSearchTicker(false)
      setFilteredOptions(false)
    }

    setSearchInput(ticker)
    setSearchTicker(true)
  }

  function onFilterChange(e) {
    const {id, checked} = e.target
    if (id === ASK) {
      setOpenOrders(!openOrders)
    } else if (id === ONE_MILL) {
      setOneMill(!oneMill)
    } else if (id === ABOVE_ASK) {
      setAboveAsk(!aboveAsk)
    } else if (id === STOCK_ONLY) {
      setStockOnly(!stockOnly)
    } else if (id === ETFS_ONLY) {
      setEtfOnly(!etfOnly)
    } else if (id === CALLS_ONLY) {
      setCallsOnly(!callsOnly)
    } else if (id === PUTS_ONLY) {
      setPutsOnly(!putsOnly)
    } else if (id === SWEEPS_ONLY) {
      setSweepsOnly(!sweepsOnly)
    } else if (id === FIFTY_CENTS) {
      setFiftyCents(!fiftyCents)
    } else if (id === FIVE_HUNDRED) {
      setFiveHundred(!fiveHundred)
    }
  }

  const optionFilterFunction = option => {
    const conditions = []

    if (searchInput) {
      // setFilteredOptions(true)
      return option.ticker === searchInput.toUpperCase()
    }

    if (openOrders) {
      conditions.push(getBidOrAskOrder(option.description) === ('A' || 'AA'))
    }

    if (oneMill) {
      conditions.push(option.cost_basis >= 1000000)
    }

    if (fiveHundred) {
      conditions.push(option.cost_basis >= 500000)
    }

    if (stockOnly) {
      conditions.push(option.underlying_type === 'STOCK')
    }

    if (etfOnly) {
      conditions.push(option.underlying_type === 'ETF')
    }

    if (callsOnly) {
      conditions.push(option.put_call === 'CALL')
    }

    if (putsOnly) {
      conditions.push(option.put_call === 'PUT')
    }

    if (sweepsOnly) {
      conditions.push(option.option_activity_type === 'SWEEP')
    }

    if (fiftyCents) {
      conditions.push(
        getNewContractPrice(option.description).split('$')[1].trim() <= 0.5
      )
    }

    return conditions.every(Boolean)
  }

  const clearFilter = useCallback(() => {
    setFilteredOptions(false)
    setSearchInput('')
    setSearchTicker(false)
  }, [])

  useEffect(() => {
    socket.on('all_options', function (data) {
      setOptions(options => [...options, ...data])
    })

    socket.on('clear', function () {
      setOptions([])
    })

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    socket.on('options', data => {
      setOptions(options => uniqBy([...data, ...options], 'id'))
    })

    return () => {
      socket.close()
    }
  }, [data])

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
    return <Redirect to="/select-a-plan">Please subscribe</Redirect>
  }

  return (
    <div className={styles.flow_background_color}>
      {!isMobile && (
        <div className={styles.desktop_view}>
          <InputField
            onChange={e => filterInput(e.target.value)}
            // onKeyPress={e =>
            //   e.key === 'Enter' ? memoizedfilterData() : null
            // }
            // onClick={memoizedfilterData}
            value={searchInput}
            filterButtonClick={() => setShowFilter(!showFilter)}
            searchTicker={searchTicker}
            clearFilter={clearFilter}
            searchInput={searchInput}
          />

          <div
            className={cx(styles.filter_container, {
              [styles.filter_display_none]: !showFilter,
            })}
          >
            <div className={filterStyles.button_container}>
              {ButtonProps.map(data => {
                return (
                  <button
                    key={data.children}
                    onClick={data.onClick}
                    className={data.className}
                  >
                    {data.children}
                  </button>
                )
              })}
            </div>
            <div className={filterStyles.filter_selection_container}>
              {filterSelection.map(data => {
                return (
                  <label className={filterStyles.label} key={data.name}>
                    <input
                      className={filterStyles.input_checkbox}
                      type="checkbox"
                      id={data.name}
                      onChange={onFilterChange}
                      checked={data.checked}
                    />
                    <span className={filterStyles.span_name}>{data.name}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className={styles.row_list}>
            {FLOW_ROW_NAME.map(data => {
              return (
                <div className={cx(styles.row_name)} key={data.name}>
                  {data.name}
                </div>
              )
            })}
          </div>
          <div className={styles.container_list}>
            <ul className={styles.ul_list}>
              {filteredOptions && options.length === 0 && (
                <div className={styles.no_options_found}>No Items Found</div>
              )}
              {options.filter(optionFilterFunction).map((data, index) => (
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
                {options.length} Results
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
                    e.key === 'Enter' ? memoizedfilterData() : null
                  }
                  placeholder="SPY"
                />
                <button
                  className={styles.mobile_search_button}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  Filter
                </button>
                {searchTicker && (
                  <button
                    className={styles.close_icon}
                    type="reset"
                    onClick={clearFilter}
                  />
                )}
              </div>
            </div>

            <div
              className={cx(filterStyles.filter_container, {
                [styles.filter_display_none]: !showFilter,
              })}
            >
              <div className={filterStyles.button_container}>
                {ButtonProps.map(data => {
                  return (
                    <button
                      key={data.children}
                      onClick={data.onClick}
                      className={data.className}
                    >
                      {data.children}
                    </button>
                  )
                })}
              </div>
              <div className={filterStyles.filter_selection_container}>
                {filterSelection.map(data => {
                  return (
                    <label className={filterStyles.label} key={data.name}>
                      <input
                        className={filterStyles.input_checkbox}
                        type="checkbox"
                        id={data.name}
                        onChange={onFilterChange}
                        checked={data.checked}
                      />
                      <span className={filterStyles.span_name}>
                        {data.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <ul className={styles.ul_list}>
            {filteredOptions && options.length === 0 && (
              <div className={styles.no_options_found}>No Items Found</div>
            )}
            {options.filter(optionFilterFunction).map((data, index) => (
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
      )}
    </div>
  )
}

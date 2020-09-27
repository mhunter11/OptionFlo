import React, {useState, useCallback} from 'react'

import {
  ASK,
  ONE_MILL,
  FIVE_HUNDRED,
  ABOVE_ASK,
  STOCK_ONLY,
  ETFS_ONLY,
  CALLS_ONLY,
  PUTS_ONLY,
  WEEKLIES,
  FIFTY_CENTS,
  SWEEPS_ONLY,
} from './flow-data'

import styles from './FilterSection.module.scss'

export const FILTER_SELECTION_DATA = [
  {name: ASK, select: 'false', onChange: e => filterData(e)},
  {name: ONE_MILL, select: 'false', onChange: e => filterData(e)},
  {name: FIVE_HUNDRED, select: 'false', onChange: e => filterData(e)},
  {name: ABOVE_ASK, select: 'false', onChange: e => filterData(e)},
  {name: STOCK_ONLY, select: 'false', onChange: e => filterData(e)},
  {name: ETFS_ONLY, select: 'false', onChange: e => filterData(e)},
  {name: CALLS_ONLY, select: 'false', onChange: e => filterData(e)},
  {name: PUTS_ONLY, select: 'false', onChange: e => filterData(e)},
  {name: WEEKLIES, select: 'false', onChange: e => filterData(e)},
  {name: FIFTY_CENTS, select: 'false', onChange: e => filterData(e)},
  {name: SWEEPS_ONLY, select: 'false', onChange: e => filterData(e)},
]

const filterData = e => {
  console.dir(e.target.checked)
}

export default function FilterSection({onChange}) {
  const [filterSelection, setFilterSelection] = useState(FILTER_SELECTION_DATA)

  const reset = useCallback(() => {
    setFilterSelection(FILTER_SELECTION_DATA)
  }, [])

  const ButtonProps = [
    {
      children: 'Clear All',
      onClick: reset,
      className: styles.clear_button,
    },
    {children: 'Done', onClick: 'onClick', className: styles.done_button},
  ]

  return (
    <div className={styles.filter_container}>
      <div className={styles.button_container}>
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
      <div className={styles.filter_selection_container}>
        {filterSelection.map(data => {
          return (
            <label className={styles.label} key={data.name}>
              <input
                className={styles.input_checkbox}
                type="checkbox"
                id={data.name}
                onChange={onChange}
                checked={data.checked}
              />
              <span className={styles.span_name}>{data.name}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

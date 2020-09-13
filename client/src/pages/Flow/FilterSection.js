import React, {useState, useCallback} from 'react'

import styles from './FilterSection.module.scss'

export const FILTER_SELECTION_DATA = [
  {name: 'Opening Orders', select: 'false', onChange: e => filterData(e)},
  {name: '$1M and above', select: 'false', onChange: e => filterData(e)},
  {name: '$500k and above', select: 'false', onChange: e => filterData(e)},
  {name: 'Above ask', select: 'false', onChange: e => filterData(e)},
  {name: 'Stocks only', select: 'false', onChange: e => filterData(e)},
  {name: 'ETFs only', select: 'false', onChange: e => filterData(e)},
  {name: 'Calls only', select: 'false', onChange: e => filterData(e)},
  {name: 'Puts only', select: 'false', onChange: e => filterData(e)},
  {name: 'Weeklies', select: 'false', onChange: e => filterData(e)},
  {name: '$0.50 and less', select: 'false', onChange: e => filterData(e)},
  {name: 'Sweeps only', select: 'false', onChange: e => filterData(e)},
]

const filterData = e => {
  console.dir(e.target.checked)
}

export default function FilterSection() {
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
            <label className={styles.label}>
              <input
                className={styles.input_checkbox}
                type="checkbox"
                onChange={data.onChange}
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

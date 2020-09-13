import React from 'react'

import styles from './FilterSection.module.scss'

export default function FilterSection() {
  const ButtonProps = [
    {children: 'Clear All', onClick: 'onClick', className: styles.clear_button},
    {children: 'Done', onClick: 'onClick', className: styles.done_button},
  ]

  const FILTER_SELECTION = [
    {name: 'Opening Orders', select: 'false'},
    {name: '$1M and above', select: 'false'},
    {name: '$500k and above', select: 'false'},
    {name: 'Above ask', select: 'false'},
    {name: 'Stocks only', select: 'false'},
    {name: 'ETFs only', select: 'false'},
    {name: 'Calls only', select: 'false'},
    {name: 'Puts only', select: 'false'},
    {name: 'Weeklies', select: 'false'},
    {name: '$0.50 and less', select: 'false'},
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
        {FILTER_SELECTION.map(data => {
          return (
            <label className={styles.label}>
              <input
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

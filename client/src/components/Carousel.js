import React, {useState} from 'react'
import cx from 'classnames'

import styles from './Carousel.module.scss'

import NEXT from '../images/next.svg'
import PREVIOUS from '../images/previous.svg'

export default function Carousel({node}) {
  const [index, setIndex] = useState(0)
  const length = node.length - 1
  const handleNext = () =>
    index === length ? setIndex(0) : setIndex(index + 1)
  const handlePrevious = () =>
    index === 0 ? setIndex(length) : setIndex(index - 1)
  const childrenSrc = node[index]
  // const handlers = useSwipeable({
  //   onSwipedLeft: () => handleNext(),
  //   onSwipedRight: () => handlePrevious(),
  //   preventDefaultTouchmoveEvent: true,
  //   trackMouse: true,
  // })
  return (
    <div className={styles.carousel_container}>
      <div>
        <img className={cx(styles.prev_button, styles.buttons)} src={PREVIOUS} alt="Previous" onClick={handlePrevious} />
        <img className={cx(styles.next_button, styles.buttons)} src={NEXT} alt="Next" onClick={handleNext} />
      </div>
      {childrenSrc}
      <div className={styles.indicator_container}>
        {node.map((k, i) => {
          return (
            <span
              className={cx(styles.indicator, {[styles.current]: index === i})}
              onClick={() => setIndex(i)}
              key={i}
            />
          )
        })}
      </div>
    </div>
  )
}

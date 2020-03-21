import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import DASHBOARD_IMAGE from "../images/dashboard-flow.png";

import styles from "./LandingPage.module.css";

export default class LandingPage extends PureComponent {
  render() {
    return (
      <div className={styles.bg_color}>
        <div className={styles.container}>
          <section>
            <div className={styles.header_container}>
              <h2 className={styles.h2}>
                Most Affordable Real Time Option Flow
              </h2>
              <h5 className={styles.h5}>
                Track and monitor smart money activity in real time
              </h5>
              <Link className={styles.btn} to="/subscription">
                Start 7 Days Free Trial
              </Link>
              <span className={styles.span}>
                Then $59.99 per month. Auto renews
              </span>
            </div>
            <img className={styles.img} src={DASHBOARD_IMAGE}></img>
          </section>
          <section>
            <h2 className={styles.h2}>UNCOVER THE POWER OF OPTIONS FLOW</h2>
          </section>
        </div>
      </div>
    );
  }
}

import React from 'react';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import logo from '../assets/whilelogo.svg';
import styles from './UserLayout.less';



const UserLayout = props => {

  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>


      <div className={styles.container}>
        <div className={styles.first_half}>
          <div className={styles.main_sidebar_title}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                </Link>
              </div>
            </div>

            <div className={styles.sidebar_content}>
              <span className={styles.main_text1}>To put access to  </span>
              <span className={styles.main_text2}>healthcare in the hands of </span>
              <span className={styles.main_text3}> very person in the world</span>
            </div>

            <div className={styles.side_bar_footer}>

            </div>
          </div>


        </div>
        <div className={styles.second_half}>
          <div className={styles.content_blur} />
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>


    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);


import ProLayout, { PageLoading } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Link, useIntl, connect, useStore } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { getAgoraId } from '@/utils/autoLogin'
import styles from './styles.less'
import logo from '../assets/logo.svg';
import { setLocale, getLocale, FormattedMessage } from 'umi';


const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList => {
  return menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });
}



const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    // Dailog,
    location = {
      pathname: '/',
    },
  } = props;


  /**
   * constructor
   */

  useEffect(() => {

    setLocale('en-US');

    let aid = getAgoraId()
    try {
      aid = JSON.parse(aid)
      // GoLogin(uid);
      if (dispatch) {
        dispatch({
          type: 'agoraCenter/AgoraLogin',
          payload: { accountName: aid }
        });
      }
    } catch (error) {
      console.log(error)
    }
  }, []);

  useEffect(() => {
    // const aside =
      // console.log('aside', aside)
    // ReactDOM.render(<div>ads</div>, document.querySelector('.ant-pro-sider-menu-sider'));

  }, [])


  /**
   * init variables
   */
  // const handleClose = pay => {
  //   dispatch({
  //     type: 'global/changeDailog',
  //     payload: { open: false }
  //   })
  // }

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (


    <ProLayout
      className={styles.pro_layout}
      logo={logo}
      formatMessage={formatMessage}
      locale="en-US"
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}

      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={false}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        <PersistGate
          persistor={persistStore(useStore())}
          loading={<PageLoading />}
        >
          {children}
        </PersistGate>

      </Authorized>
    </ProLayout>

  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
  // Dailog: global.dailog,
}))(BasicLayout);

import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import { getUserId, getAutoLogin } from '@/utils/autoLogin';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const autologin = getAutoLogin()
    console.log(autologin)
    if (autologin) {
      const userid = getUserId()
    }
    const { dispatch, uid, currentUser } = this.props;
    let user_id = uid;
    if (currentUser && currentUser.user_id) {
    } else if (user_id) {
      if (dispatch) {
        dispatch({
          type: 'user/fetchCurrent',
          payload: { user_id },
        });
      }
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser, userRole } = this.props;


    const isLogin = currentUser && currentUser.user_id;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (userRole && userRole === 'doctor' && window.location.pathname !== '/providerroles') {
      return <Redirect to={`/providerroles`} />;

    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading, login }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  uid: login.uid,
  userRole: user.userRole,
}))(SecurityLayout);

import React from 'react';
import './App.scss';
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;

class App extends React.Component {
  handleClick = e => {
    console.log('click ', e);
    this.props.history.push(`/${e.key}`)
  };

  render() {
    return (

      <div>
        <div className="header">
          <div className="handle-btn">
            <i className="el-icon-s-unfold"></i>
          </div>
          <div className="user-name">
            <i className="iconfont icon-yonghu"></i
            ><span>剑客</span>
            <i className="iconfont icon-tuichu"></i>
          </div >
        </div >
        <div className='left'>
          <div className="title">
            <p>

            </p>
            <p className="title-name">海贼王</p>
          </div>
          <Menu
            onClick={this.handleClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu key='mywork' icon={<SettingOutlined />} title="我的工作">
              <Menu.Item key="people">拉人入伙</Menu.Item>
              <Menu.Item key="target">制定目标</Menu.Item>
              <Menu.Item key="do">执行下去</Menu.Item>
              <Menu.Item key="monitor">保障执行</Menu.Item>
            </SubMenu>
          </Menu>
        </div>

        <div className='right'>
          <Switch>
            <Route exact path="/people">
              <People />
            </Route>
            <Route path="/do">
              <Do />
            </Route>
            <Route path="/target">
              <Target />
            </Route>
            <Route path="/monitor">
              <Monitor />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}
function People() {
  return (
    <div>
      <h2>拉人入伙</h2>
    </div>
  );
}

function Do() {
  return (
    <div>
      <h2>执行下去</h2>
    </div>
  );
}

function Target() {
  return (
    <div>
      <h2>制定目标</h2>
    </div>
  );
}
function Monitor() {
  return (
    <div>
      <h2>保障执行</h2>
    </div>
  );
}
export default withRouter(App)
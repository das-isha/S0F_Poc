import React from 'react';
import { Menu } from 'antd';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { HomeOutlined, TeamOutlined, SearchOutlined, BarChartOutlined } from '@ant-design/icons';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location } = this.props;
    return (
      <Menu
        style={{ background: '#FFCCCC' }} // Change this line to the light red color
        mode="inline"
        defaultSelectedKeys={['/']}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/">
          <HomeOutlined style={{ color: '#000000' }} /> 
          <span style={{ color: '#000000' }}>Home</span>
          <NavLink to="/" />
        </Menu.Item>
        <Menu.Item key="/patients">
          <TeamOutlined style={{ color: '#000000' }} />
          <span style={{ color: '#000000' }}>Patient List</span>
          <NavLink to="/patients" />
        </Menu.Item>
        <Menu.Item key="/search">
          <SearchOutlined style={{ color: '#000000' }} />
          <span style={{ color: '#000000' }}>Search</span>
          <NavLink to="/search" />
        </Menu.Item>
        <Menu.Item key="/statistics">
          <BarChartOutlined style={{ color: '#000000' }} />
          <span style={{ color: '#000000' }}>Insights</span>
          <NavLink to="/statistics" />
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(SideMenu);

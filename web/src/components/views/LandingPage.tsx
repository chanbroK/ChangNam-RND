import React from 'react'
import {  Col, Card, Row } from 'antd';
import {UserOutlined} from '@ant-design/icons';
function LandingPage() {

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2> <UserOutlined /> 김국문님    </h2>
            </div>
        </div>
    )
}

export default LandingPage

import React from "react"
import {Layout} from "antd";


/*TODO
   Выдать списки:
   1.  Найденные предметы в своих кабинетах
   2.  Найденный предметы не в своих кабинетах
   3.  Не найденные предметы
   4.  Не проверенные предметы
 */

export default () => {
    const {Content} = Layout;
    return (
        <Content style={{padding: '0 50px'}}>
            <a>Закончить инвентаризацию</a>
            <Layout className="site-layout-background" style={{padding: '24px 0'}}>
                <Content style={{padding: '0 24px', minHeight: 280}}>
                    Report
                </Content>
            </Layout>
        </Content>
    )
}
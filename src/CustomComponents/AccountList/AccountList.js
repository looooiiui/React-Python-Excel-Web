import { useState, useEffect } from 'react';
import axios from 'axios';
//=================自定义工具引入==============================
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import { DebugTool } from '../../Util/DebugTool/DebugTool';
import CONSTPARAM from '../../Core/CONST/CONST';
//============自定义组件引入===============
import ThemedButton from '../OverrideCom/OverrideButton/ThemeButton';


function AccountLists() {
    const [accountList, setAccountList] = useState([]);
    const [changeState, setChangeState] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            let listUrl = `${CONSTPARAM.INFOIP}${CONSTPARAM.INFOBASE}/accountInfo`;
            const res = await axios.get(listUrl);
            DebugTool.debugLog("前端用户列表(封禁管理员): 发送用户请求: " + listUrl)
            // 把对象转成数组，方便渲染
            const list = Object.entries(res.data).map(([id, info]) => ({
                id,
                ...info
            }));
            setAccountList(list);
        };
        fetchData();
    }, [changeState]);

    // 封禁状态切换
    function banStatusToggle(accountId, banState) {
        DebugTool.debugLog(`前端用户信息组件: 封禁状态切换: ${accountId} : ${banState}(之前)`)
        InfomationSystem.sendBanOperator(accountId, () => {
            var newState = changeState == 0 ? 1 : 0;
            setChangeState(newState);
        })
    }

    return (
        <div>
            <h1>用户列表</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>账号ID</th>
                        <th>用户名</th>
                        <th>管理员标识</th>
                        <th>密码</th>
                        <th>封禁状态</th>
                        <th>封禁状态切换</th>
                    </tr>
                </thead>
                <tbody>
                    {accountList.map(account => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>{account.NAME}</td>
                            <td>{account.ADMIN == 1 ? '是' : '否'}</td>
                            <td>{account.PASSWORD}</td>
                            <td>{Number(account.PERMISSION) == 1 ? "封禁" : "正常"}</td>
                            <td><ThemedButton onClick={() => { banStatusToggle(account.id, account.PERMISSION) }}>切换封禁</ThemedButton></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AccountLists;
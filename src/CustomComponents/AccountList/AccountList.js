import { useState, useEffect } from 'react';
import axios from 'axios';
//=================自定义工具引入==============================
import { DebugTool } from '../../Util/DebugTool/DebugTool';
import CONSTPARAM from '../../Core/CONST/CONST';

function AccountLists() {
    const [accountList, setAccountList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${CONSTPARAM.INFOIP}${CONSTPARAM.INFOBASE}/accountInfo`);
            // 把对象转成数组，方便渲染
            const list = Object.entries(res.data).map(([id, info]) => ({
                id,
                ...info
            }));
            setAccountList(list);
        };
        fetchData();
    }, []);

    // 封禁状态切换
    function banStatusToggle(accountId, banState) {
        DebugTool.debugLog(`前端用户信息组件: 封禁状态切换: ${accountId} : ${banState}(现状态)`)
    }

    return (
        <div>
            <h1>用户列表</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>账号ID</th>
                        <th>管理员标识</th>
                        <th>封禁状态</th>
                        <th>封禁状态切换</th>
                    </tr>
                </thead>
                <tbody>
                    {accountList.map(account => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>{account.ADMIN === 1 ? '是' : '否'}</td>
                            <td>{account.PERMISSION === 1 ? "封禁" : "正常"}</td>
                            <td><button onClick={() => { banStatusToggle(account.id, account.PERMISSION) }}>切换封禁</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AccountLists;
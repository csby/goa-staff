const uri = {
  // 获取获取验证码
  getCaptcha: '/staff.api/auth/ad/captcha',
  // 用户登录
  login: '/staff.api/auth/ad/login',
  // 退出登录
  logout: '/staff.api/auth/ad/logout',
  // 获取登录账号
  getLoginAccount: '/staff.api/user/login/account',
  // 获取在线用户
  getOnlineUsers: '/opt.api/online/users',

  // 通知订阅
  websocketNotify: '/staff.api/user/login/notify',

  // 域控-用户
  // 新建用户
  adUserAccountCreate: '/staff.api/ad/user/account/create',
  // 重置密码
  adUserAccountPasswordReset: '/staff.api/ad/user/account/password/reset',
  // 修改密码
  adUserAccountPasswordChange: '/staff.api/ad/user/account/password/change',
  // 获取帐号列表
  adUserAccountList: '/staff.api/ad/user/account/list',
  // 获取帐号树
  adUserAccountTree: '/staff.api/ad/user/account/tree',
  // 获取组织单位列表
  adUserOrgUnitList: '/staff.api/ad/user/org/unit/list',
  // 获取下属列表
  adUserSubordinateList: '/staff.api/ad/user/subordinate/list',
  // 获取VPN启用状态
  adUserVpnEnableGet: '/staff.api/ad/user/vpn/enable/get',
  // 设置VPN启用状态
  adUserVpnEnableSet: '/staff.api/ad/user/vpn/enable/set',
  // 获取VPN用户列表
  adUserVpnEnableList: '/staff.api/ad/user/vpn/enable/list',

  // 域控-组
  // 获取用户列表
  adGroupUserList: '/staff.api/ad/group/user/list',
  // 获取角色组列表
  adGroupRoleList: '/staff.api/ad/group/role/list',
  // 添加组成员
  adGroupMemberAdd: '/staff.api/ad/group/member/add',
  // 移除组成员
  adGroupMemberRemove: '/staff.api/ad/group/member/remove',

  // 域控-服务器
  // 获取服务器列表
  adServerList: '/staff.api/ad/server/list',
  // 添加服务器
  adServerAdd: '/staff.api/ad/server/add',

  // 资源-域控-共享目录
  // 获取共享目录列表
  adShareList: '/staff.api/ad/share/list',
  // 添加共享目录
  adShareAdd: '/staff.api/ad/share/add',

  // 资源-SVN-存储库
  // 新建存储库
  svnRepositoryAdd: '/staff.api/svn/repository/add',
  // 获取存储库列表
  svnRepositoryList: '/staff.api/svn/repository/list',
  // 获取文件夹列表
  svnFolderList: '/staff.api/svn/folder/list',
  // 获取角色组列表
  svnGroupRoleList: '/staff.api/svn/group/role/list',
  // 获取当前登录用户权限列表
  svnPermissionUserList: '/staff.api/svn/permission/user/list',
  // 获取项目访问权限列表
  svnPermissionItemList: '/staff.api/svn/permission/item/list',
  // 添加项目访问权限
  svnPermissionItemAdd: '/staff.api/svn/permission/item/add',
  // 修改项目访问权限
  svnPermissionItemMod: '/staff.api/svn/permission/item/mod',
  // 删除项目访问权限
  svnPermissionItemDel: '/staff.api/svn/permission/item/del',

  // 邮件-收件人
  // 获取阻止列表(分页)
  mailReceiverBlockAddressPage: '/staff.api/mail/receiver/block/address/page',
  // 添加阻止地址
  mailReceiverBlockAddressAdd: '/staff.api/mail/receiver/block/address/add',
  // 删除阻止地址
  mailReceiverBlockAddressDel: '/staff.api/mail/receiver/block/address/del',

  // 邮件-发件人
  // 获取阻止列表(分页)
  mailSenderBlockAddressPage: '/staff.api/mail/sender/block/address/page',
  // 添加阻止地址
  mailSenderBlockAddressAdd: '/staff.api/mail/sender/block/address/add',
  // 删除阻止地址
  mailSenderBlockAddressDel: '/staff.api/mail/sender/block/address/del',

  // 邮件-发送IP
  // 获取阻止列表(分页)
  mailSenderBlockIpPage: '/staff.api/mail/sender/block/ip/page',

  // DHCP-筛选器
  // 获取筛选器列表
  dhcpFilterList: '/staff.api/dhcp/filter/list',
  // 添加筛选器
  dhcpFilterAdd: '/staff.api/dhcp/filter/add',
  // 删除筛选器
  dhcpFilterDel: '/staff.api/dhcp/filter/del',
  // 修改筛选器
  dhcpFilterMod: '/staff.api/dhcp/filter/mod',

  // DHCP-地址租用
  // 获取地址租用列表
  dhcpLeaseList: '/staff.api/dhcp/lease/list',

  // 系统角色
  // 获取服务角色
  sysRoleServer: '/opt.api/sys/role/server',

  // 后台服务
  // 获取服务信息
  svcInfo: '/opt.api/service/info',
  // 是否可在线重启
  svcRestartEnable: '/opt.api/service/restart/enable',
  // 重启服务
  svcRestart: '/opt.api/service/restart',
  // 是否可在线更新
  svcUpdateEnable: '/opt.api/service/update/enable',
  // 更新服务
  svcUpdate: '/opt.api/service/update',

  // 更新管理
  // 是否支持
  updEnable: '/opt.api/update/enable',
  // 获取服务信息
  updInfo: '/opt.api/update/info',
  // 是否可在线重启
  updRestartEnable: '/opt.api/update/restart/enable',
  // 重启服务
  updRestart: '/opt.api/update/restart',
  // 是否可在线更新
  updUploadEnable: '/opt.api/update/upload/enable',
  // 更新服务
  updUpload: '/opt.api/update/upload',

  // 系统信息
  // 获取主机信息
  monitorHost: '/opt.api/monitor/host',
  // 获取网卡信息
  monitorNetworkInterfaces: '/opt.api/monitor/network/interfaces',
  // 获取监听端口
  monitorListenPorts: '/opt.api/monitor/network/listen/ports',

  // 网站管理
  // 根站点
  // 获取文件列表
  siteRootFileList: '/opt.api/site/root/file/list',
  // 上传文件
  siteRootFileUpload: '/opt.api/site/root/file/upload',
  // 删除文件
  siteRootFileDelete: '/opt.api/site/root/file/delete',
  // 应用站点
  // 获取网站列表(ID)
  siteWebAppList: '/opt.api/site/app/list',
  // 获取网站信息
  siteWebAppInfo: '/opt.api/site/app/info',
  // 上传网站
  siteWebAppUpload: '/opt.api/site/app/upload',

  // 云端服务
  // 获取所有节点
  cloudNodeListAll: '/opt.api/cloud/node/list/all',
  // 获取在线节点
  cloudNodeListOnline: '/opt.api/cloud/node/list/online',
  // 修改节点信息
  cloudNodeInfoMod: '/opt.api/cloud/node/info/mod',
  // 删除节点
  cloudNodeInfoDel: '/opt.api/cloud/node/info/del',
  // 获取节点转发连接
  cloudNodeFwdConnList: '/opt.api/cloud/node/fwd/conn/list',

  // 节点服务
  // 获取节点信息
  nodeInfoGet: '/opt.api/node/info',
  // 获取启用状态
  nodeCfgEnableGet: '/opt.api/cfg/node/enable/get',
  // 获取在线状态
  nodeOnlineState: '/opt.api/node/online/state',
  // 获取在线目标节点
  nodeOnlineTargetList: '/opt.api/node/online/target/list',
  // 端口转发
  // 获取运行状态
  nodeFwdInputListenState: '/opt.api/node/fwd/input/listen/state',
  // 获取启用状态
  nodeFwdEnableGet: '/opt.api/cfg/node/fwd/enable/get',
  // 设置启用状态
  nodeFwdEnableSet: '/opt.api/cfg/node/fwd/enable/set',
  // 启动服务
  nodeFwdInputSvcListenStart: '/opt.api/cfg/node/fwd/input/svc/listen/start',
  // 停止服务
  nodeFwdInputSvcListenStop: '/opt.api/cfg/node/fwd/input/svc/listen/stop',
  // 获取转发列表
  nodeFwdItemList: '/opt.api/cfg/node/fwd/item/list',
  // 添加转发项目
  nodeFwdItemAdd: '/opt.api/cfg/node/fwd/item/add',
  // 修改转发项目
  nodeFwdItemMod: '/opt.api/cfg/node/fwd/item/mod',
  // 删除转发项目
  nodeFwdItemDel: '/opt.api/cfg/node/fwd/item/del'
}

export default {
  uris: uri
}

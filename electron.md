### 通过元素拖动窗口

```css
.menu-bar {
  -webkit-app-region: drag;
}
```

> Windows系统在元素设置了上面的属性后，子元素会无法被点击（click）
> 解决方案如下：

```css
.menu-item {
  -webkit-app-region: no-drag;
}
```

### 自定义标题栏

使用自定义标题栏，因为原生的标题栏在不同系统上的样式太丑、不统一。

解决方案：创建窗口时，指定 `frame: false` 属性，创建无边框窗口。然后使用css自定义标题栏，并且设置css属性 `-webkit-app-region: drag;`，使标题栏可被拖动。

### Windows通知栏不起作用

https://electronjs.org/docs/tutorial/notifications#%E9%80%9A%E7%9F%A5-windows-linux-macos


### 资源

https://www.emojione.com/

### electron 加密源码方案

https://github.com/electron/electron/issues/3041

1. 使用混淆工具混淆 js 代码
2. 将核心模块封装为 node 模块，用C++写
3. 更改electron源码（更改打包机制），使electron在打包或提取 `app.asar` 文件时进行加密解密

```bash
# https://www.v2ex.com/t/493344
# 加密方法 
在 asar 打包时写入文件之前, 通过加密算法把写入的文件进行加密

# 解密方法
修改 asar::Archive 类增加 C++解密方式, 供 Browser 和 atom 加载 asar 资源
修改 asar.js 增加 js 解密方式, 供 nodejs 加载 asar 资源
```

* 图片加密隐写

https://www.v2ex.com/t/278480
https://github.com/zeruniverse/CryptoStego


### 软件更新

[Electron应用自动更新实现思路](https://toyobayashi.github.io/2018/11/07/ElectronAsarUpdater/)

1. 因为软件基于Electron开发，所以我们在进行软件更新时，无需更新整个软件包，只需要将 `软件目录/resources/app.asar` 文件替换成最新软件包的 app.asar 文件即可。

文章参考：https://toyobayashi.github.io/2018/11/07/ElectronAsarUpdater/
具体逻辑：参看 `client/src/renderer/app.vue`
目前机制：软件每次打开的时候，都会从服务器下载 `服务器目录/release/app_update.asar` 文件至 `软件目录/resources` 目录，然后计算 `app.asar` 与 `app_update.asar` 文件的 md5 值，若不相同，弹窗提示更新软件。若用户点击确认更新，则执行 Windows系统的 `copy` 命令，将 app.asar 替换为最新的版本，然后重启软件。


[正确设置 ELECTRON_MIRROR ，加速下载 electron 预编译文件](https://newsn.net/say/electron-download-mirror.html)

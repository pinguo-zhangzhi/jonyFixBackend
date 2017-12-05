# framework-react-redux-tsx

## 结构层级

| 当前平台名称    | 子系统1  |  子系统2  | 子系统3 |
| ------------- |:-------:| --------:| ------:|
| 子系统1的模块A  |         |          |        |
| 子系统1的模块B  |         | 中间是内容 |        |
| 子系统1的模块C  |         |          |        |

### 目录结构说明

<pre>
 `/src/`
 `/src/system/`
 `/src/system/system1` *子系统1*
 `/src/system/system1/mouduleA` *子系统1的模块A*
 `/src/system/system1/mouduleB`
 `/src/system/system1/mouduleC`
 `/src/system/system1/mouduleD`
 `/src/system/system2` *子系统1*
 `/src/system/system2/mouduleA` 子系统2的模块A
 `/src/system/system2/mouduleB`
 `/src/system/system2/mouduleC`
 `/src/system/system2/mouduleD`
</pre>

* /src/system/system1 存放*子系统1*的文件
* /src/system/system2 存放*子系统2*的文件
* 每个子系统里面有若干个*模块*, 模块目录里面存放相关页面的实现代码


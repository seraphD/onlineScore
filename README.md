# 在线评分系统

技术栈：

- 用React和meterial-UI设计前端交互页面
- 用react-router进行不同页面的跳转
- 用express实现后端，处理打分的结果返回前端
- socket.io实现不同页面之间的信息交互

# 打分流程

- admin导入数据
- admin设置打分限制
- audit开始登陆
- audit登陆后会看一段随机排序的动画，确保公平
- admin开始打分
- audit都打分完毕后进入下一组的打分
- 所有小组打分完毕后admin进入结束画面
- 导出数据

# 打分限制

- admin设定的打分的优秀率和及格率会限制audit给出的高分或者低分的个数，例如总共有20个小组，优秀率为20%，则每个audit总共只能给4个小组打出90或以上的分数。
- 自己不能给自己小组的作品评分

# 打分过滤器

1. 所有的audit的打分结束后，计算打分的平均分(average)和方差(deviation)。
2. 对于每一个分数(score)，计算 z = (score - average)/deviation
3. 如果 |z| > 3.0,则这个分数将被弃用

设置这个数据过滤器的功能是为了避免打分者与被评价的小组有私情

# admin

![admin](./pic/admin.png)

# audit

![audit](./pic/audit.png)

项目地址：http://47.100.45.240:3000

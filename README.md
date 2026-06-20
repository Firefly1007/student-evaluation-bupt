# BUPT 学生期末评教自动化

一键完成北邮教务系统（jwgl.bupt.edu.cn）全部课程的期末评教。

## 功能

- 自动填充所有课程的评价表单（12 项评分 + 主观评语 + 文本框）
- 每门课评分带随机差异，避免千篇一律
- 默认总分 96~99，满足不低于 94 的要求
- 填完后一键批量提交，提交前会向用户确认

## 安装

```bash
npx skills install <github-repo-url>
```

## 使用方法

登录后打开教务系统任意页面，对 AI 说：

```
帮我评教
```

或更具体的：

```
帮我评教，每个老师总分不低于 95 分
```

AI 会自动：
1. 进入评教页面
2. 逐门填充并保存评价
3. 汇报各门课分数
4. 询问是否提交，确认后再批量提交

## 自定义参数

对话时可指定：
- **最低分数**：默认 94，说"不低于 96 分"即可调整
- **改进建议**：默认留空，可以说"改进建议填xxx"
- **亮点内容**：默认填"很好"，可以自定义

也可修改 `scripts/fill_evaluation.js` 顶部的参数：

```javascript
var MIN_DOWNGRADE = 1;  // 最少降级指标数
var MAX_DOWNGRADE = 2;  // 最多降级指标数
var MIN_POSITIVE = 3;   // 最少正面评语数
var MAX_POSITIVE = 5;   // 最多正面评语数
var HIGHLIGHTS = '很好'; // 亮点文本框内容
var IMPROVEMENT = '';    // 改进建议文本框内容
```

## 环境要求

- 已登录 BUPT 教务系统（jwgl.bupt.edu.cn）
- 浏览器自动化 MCP 可用

## 文件结构

```
student-evaluation/
├── SKILL.md                          # 技能说明（AI 读取）
├── README.md                         # 本文件
└── scripts/
    ├── fill_evaluation.js            # 核心：填充单门课评价并保存
    ├── navigate_next.js              # 导航到下一门未评价课程
    ├── enter_evaluation.js           # 从评教入口进入课程列表
    └── verify_results.js             # 验证评价完成情况和分数
```

## 已测试平台

- QoderWork
- Claude Code + Playwright MCP

## 免责声明

本工具仅供学习交流，使用风险自负。建议在评教前认真思考对各课程的真实评价。

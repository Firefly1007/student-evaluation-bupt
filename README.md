# BUPT 学生期末评教自动化

北邮教务系统（jwgl.bupt.edu.cn）期末评教自动化工具，一键完成全部课程的评价填写与提交。

## 功能

- 自动填充所有课程的评价表单（12 项评分 + 主观评语 + 文本框）
- 每门课评分带随机差异，避免千篇一律
- 默认总分 96~99，满足不低于 94 的要求
- 填完后一键批量提交，提交前会向用户确认

## 安装

```bash
npx @anthropic-ai/skills install Firefly1007/student-evaluation
```

安装后，在对话中提到"评教"即可自动触发。

## 使用

确保已登录教务系统（jwgl.bupt.edu.cn），然后对 AI 说：

```
帮我评教
```

也可以指定更具体的要求：

```
帮我评教，每个老师总分不低于 95 分
帮我评教，改进建议填"希望增加课堂互动"
```

AI 会自动完成以下流程：

1. 进入评教页面，获取课程列表
2. 逐门课程填充评价并保存
3. 汇报各门课分数
4. 经用户确认后批量提交

## 自定义

### 对话时指定

| 参数 | 默认值 | 示例 |
|------|--------|------|
| 最低分数 | 94 | "不低于 96 分" |
| 改进建议 | 留空 | "改进建议填xxx" |
| 亮点内容 | "很好" | "亮点填教学认真" |

### 修改脚本

编辑 `scripts/fill_evaluation.js` 顶部参数：

```javascript
var MIN_DOWNGRADE = 1;   // 最少降级指标数（从"完全符合"降为"基本符合"）
var MAX_DOWNGRADE = 2;   // 最多降级指标数
var MIN_POSITIVE = 3;    // 最少勾选正面评语数
var MAX_POSITIVE = 5;    // 最多勾选正面评语数
var HIGHLIGHTS = '很好';  // "亮点"文本框内容
var IMPROVEMENT = '';     // "改进建议"文本框内容
```

## 环境要求

- 已登录 BUPT 教务系统（jwgl.bupt.edu.cn）
- 可用的浏览器自动化 MCP（如 Playwright MCP、QoderWork 内置浏览器连接器等）

## 文件结构

```
student-evaluation/
├── SKILL.md                       # 技能说明文档（AI 读取）
├── README.md                      # 本文件
└── scripts/
    ├── fill_evaluation.js         # 核心：填充单门课评价并保存
    ├── navigate_next.js           # 导航到下一门未评价课程
    ├── enter_evaluation.js        # 从评教入口进入课程列表
    └── verify_results.js          # 验证评价完成情况和分数
```

## 已测试平台

- QoderWork
- Claude Code + Playwright MCP

## 免责声明

本工具仅供学习交流，使用风险自负。建议在评教前认真思考对各课程的真实评价。

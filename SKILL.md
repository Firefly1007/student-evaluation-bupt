---
name: student-evaluation
description: BUPT 教务系统学生期末评教自动化工具。当用户提到以下场景时使用：评教、学生评价、期末评教、教学评价、课程评价，或者用户在 jwgl.bupt.edu.cn 教务系统上需要批量完成课程评价时。即使用户只是说帮我评教、把评教做了、评价一下老师这类简短请求，也应该触发此技能。
---

# 学生期末评教自动化

本技能用于在 BUPT（北京邮电大学）教务系统 `jwgl.bupt.edu.cn` 上批量完成学生期末评教。通过浏览器 MCP 工具 + JavaScript 自动填充评价表单，支持自定义最低分数和随机性。

## 脚本文件

所有操作脚本位于本 skill 的 `scripts/` 目录下，执行时需先用 Read 工具读取对应 JS 文件内容，再通过 `javascript_tool` 在浏览器中执行。

| 脚本文件 | 用途 | 执行页面 |
|---------|------|---------|
| `scripts/enter_evaluation.js` | 从评教入口页跳转到课程列表 | `xspj_find.do` |
| `scripts/navigate_next.js` | 导航到下一门未评价课程 | `xspj_list.do` |
| `scripts/fill_evaluation.js` | 填充单门课评价表单并保存 | `xspj_edit.do` |
| `scripts/verify_results.js` | 验证评价完成情况和分数 | `xspj_list.do` |

## 前置条件

* 用户已登录教务系统，浏览器中打开了教务页面

* 浏览器 MCP 工具可用（`builtin_browser` 或 Playwright MCP）

## 整体流程

```
1. 导航到评教页面 → 2. 获取课程列表 → 3. 逐门课程填充并保存 → 4. 验证结果 → 5. 向用户确认后批量提交
```

### Step 1: 进入评教页面

先通过 `tabs_context_mcp` 获取当前浏览器标签页，找到教务系统标签页。

如果当前页面不在评教入口，导航到：

```
https://jwgl.bupt.edu.cn/jsxsd/xspj/xspj_find.do
```

然后**读取 `scripts/enter_evaluation.js`**，将其内容通过 `javascript_tool` 执行，自动点击"进入评价"链接跳转到课程列表。

### Step 2: 获取课程列表

课程列表页面 URL 形如 `xspj_list.do`，包含所有待评价课程。

**读取 `scripts/verify_results.js`** 并通过 `javascript_tool` 执行，获取所有课程的评价状态和未评价数量。

### Step 3: 逐门课程填充评价

对每门未评价的课程，循环执行以下步骤：

#### 3a. 进入课程评价页

**读取 `scripts/navigate_next.js`** 并通过 `javascript_tool` 执行。该脚本会找到第一门未评价的课程（URL 中含 `zpf=0`）并跳转。

如果返回 `'done'`，说明所有课程已评价完毕，进入 Step 4。

等待 2 秒让页面加载。

#### 3b. 填充表单并保存

**读取 `scripts/fill_evaluation.js`** 并通过 `javascript_tool` 执行。该脚本会：

* 为 12 个评教指标选择评分（大部分"完全符合"，随机 1-2 个降为"基本符合"）

* 随机勾选 3-5 个正面主观评语标签

* 在"亮点"文本框填写"很好"

* "改进建议"文本框留空

* 自动点击保存

**重要**：如果用户要求自定义分数或评语，在读取脚本后修改顶部变量再执行：

```javascript
var MIN_DOWNGRADE = 1;   // 最少降级指标数
var MAX_DOWNGRADE = 2;   // 最多降级指标数
var MIN_POSITIVE = 3;    // 最少正面评语数
var MAX_POSITIVE = 5;    // 最多正面评语数
var HIGHLIGHTS = '很好';  // 亮点文本框内容
var IMPROVEMENT = '';     // 改进建议文本框内容
```

详见 `scripts/fill_evaluation.js` 文件内注释。

#### 3c. 等待返回列表

保存后等待 2 秒，页面会自动跳回课程列表。

#### 3d. 重复

回到 Step 3a，继续处理下一门课程，直到所有课程评价完毕。

### Step 4: 验证结果

所有课程保存后，**读取 `scripts/verify_results.js`** 并通过 `javascript_tool` 执行，检查所有课程的评价状态和分数。

向用户报告：已完成数量、分数范围、最低分。

### Step 5: 批量提交所有评价

保存（status='0'）不等于提交，评价保存后仍处于"未提交"状态。课程列表页底部有一个"提交"按钮（`id="tj"`），点击后会调用 `bysubmit()` 函数，一次性将所有已保存的评价统一提交。

**重要**：提交后不可修改。点击此按钮前**必须先向用户确认**是否提交，得到明确同意后才能执行。绝不能自动跳过确认步骤。

确认后通过 JavaScript 点击该按钮：

```javascript
(function(){
  var btn = document.getElementById('tj');
  if (btn) { btn.click(); return 'clicked submit'; }
  return 'button not found';
})()
```

点击后等待 2 秒，页面会刷新。提交成功后：

* 所有课程的"是否提交"列变为"是"
* "操作"列从"评价"变为"查看"

#### 验证提交结果

提交后通过以下脚本确认所有课程均已提交：

```javascript
(function(){
  var links = document.querySelectorAll('a');
  var submitted = 0, notSubmitted = 0;
  for (var i = 0; i < links.length; i++) {
    if (links[i].textContent.trim() === '查看') submitted++;
    if (links[i].textContent.trim() === '评价') notSubmitted++;
  }
  return JSON.stringify({submitted: submitted, notSubmitted: notSubmitted});
})()
```

向用户报告提交结果：成功数量、是否有遗漏。

## 表单结构详解

评价页面包含以下元素：

**评分指标**：共 12 个单选按钮组，分三个板块：

* (001) 评课（20%）：4 个指标

* (002) 评教（30%）：4 个指标

* (003) 自评（50%）：4 个指标

每组 5 个选项，对应分值：

| 选项  | 含义    | 分值 | 后缀     |
| --- | ----- | -- | ------ |
| \_1 | 完全符合  | 5  | 最高     |
| \_2 | 基本符合  | 4  | <br /> |
| \_3 | 不确定   | 3  | <br /> |
| \_4 | 基本不符合 | 2  | <br /> |
| \_5 | 完全不符合 | 1  | 最低     |

满分 = 12 x 5 = 60（原始分），系统按权重换算为百分制。

**单选按钮命名规则**：

* 组名：`pj0601id_N`（N 为指标序号，通过隐藏字段 `pj06xh` 获取）

* 元素 ID：`pj0601id_N_M`（M 为选项序号 1-5）

* 分值存储：隐藏字段 `pj0601fz_N_VALUE`

**主观评语标签**：20 个复选框（`name="zgpyids"`），前 10 个为正面评价，后 10 个为负面评价。保存时至少需勾选 1 个。

**文本框**：2 个 `textarea`（`name="jynr"`）：

* 第 1 个：改进建议（用户要求留空）

* 第 2 个：亮点（填写"很好"）

**系统校验规则**：

* 所有 12 个指标必须选择

* 不能所有指标选同一个选项（`isxtjg="1"` 时校验）

* 至少勾选 1 个主观评语标签

* 当分数 > 95 时，"亮点"为必填

* 当分数 <= 85 时，"改进建议"为必填

## 自定义参数

执行前应向用户确认以下参数：

1. **最低分数要求**：默认 94 分。如果用户要求更高分数，需减少降级数量
2. **改进建议**：默认留空。用户可能想填写具体内容
3. **亮点内容**：默认填"很好"。用户可能想自定义
4. **随机性**：默认每门课随机降级 1-2 个指标。可调整范围

## 注意事项

* 使用 `saveData(btn, '0')` 保存但不提交，避免误操作

* 每次填充后等待页面跳转回列表再进行下一门

* 如果某门课程填充失败（如弹出校验错误），检查并修复后重试

* 所有 JS 脚本通过 `javascript_tool` 执行，减少不必要的页面点击

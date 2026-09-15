# 本地数据规范

脚本用 Python 3.10+ 标准库。以下 `<skill-directory>` 为当前安装技能目录的绝对路径，不能假设当前工作目录就是技能位置。

```text
python <skill-directory>/scripts/workbench.py init
python <skill-directory>/scripts/workbench.py archive --input <session-json>
python <skill-directory>/scripts/workbench.py serve
```

三者默认数据目录都是 `G:/AI/OpenAI/Workspaces/jpkouyu-data`，服务端口为 `8766`。更换位置时所有命令都加相同的 `--data-dir <绝对路径>`。无 G 盘的环境必须显式指定。保存前将本次 JSON 写入数据目录下的 `inbox/<唯一id>.json`，无需使用 C 盘临时目录。

`archive` 验证日语标记和数据类型，生成 `sessions/<id>.json`、`workbench-data.json` 与 `复习台.md`。同 id 同内容重复归档幂等；同 id 不同内容拒绝覆盖。不要用多个并发进程同时写同一数据目录。读写 UTF-8（输入也兼容 BOM）。初始化只有空记录，不预置伪造历史。

## Session JSON

下面只演示结构，不是 Ray 的真实记录，不可直接归档成他的表现：

```json
{
  "id": "example-convenience-store",
  "language": "ja",
  "created_at": "2026-09-15T12:00:00+08:00",
  "topic": {"id": "convenience-store", "label": "便利店结账", "emoji": "🏪"},
  "duration_minutes": 10,
  "level": "beginner",
  "hint_mode": "guided",
  "reading_mode": "kana",
  "register": "polite",
  "roles": {"learner": "顾客", "coach": "店员"},
  "mission": "购买便当，请求加热并告知是否需要袋子。",
  "mission_completed": true,
  "targets": [
    {
      "expression": "袋は要りません。",
      "reading": "ふくろはいりません。",
      "meaning_zh": "不需要袋子。",
      "status": "mastered",
      "support": "independent",
      "evidence": "袋は要りません。"
    }
  ],
  "repairs": [
    {
      "kind": "repair",
      "learner": "袋がください。",
      "natural": "袋をください。",
      "natural_reading": "ふくろをください。",
      "reason_zh": "要某件东西时用「名词をください」，这里把が改为を。"
    }
  ],
  "focus_next": ["用を连接想要的物品与ください"],
  "next_drill": "换到咖啡店，独立请求两杯热咖啡并说明带走。",
  "pronunciation": {"status": "not_observed", "notes": []}
}
```

- `id` 用唯一时间戳加随机后缀和 ASCII 场景名；日期带时区。
- `language` 必须为 `ja`；英语记录或英语版总表被拒绝，防止误混数据。
- `level` 为 `zero`／`beginner`／`intermediate`／`advanced`；`hint_mode` 为 `immersion`／`guided`／`learning`。
- `duration_minutes` 为 1–240 的分钟数，默认记录计划练习时长，不声称精确实测。短于一分钟的中止练习可记 1 并在报告中说明提前结束。
- 目标 `status` 为 `mastered`／`developing`／`needs_review`／`not_observed`。`support` 为 `independent`／`intent_hint`／`keyword_hint`／`model`／`none`。`mastered` 必须配 `independent`。
- `reading` 与 `natural_reading` 是建议表达的日语假名拼写，不是录音转写，也不是发音评分。助词书写仍保留は／へ／を。
- `repairs.kind` 为 `keep`／`repair`／`alternative`，可保留已正确原句。没有真实原句时不编造，必要时用明确标记的摘要。
- `focus_next` 最多三个；`next_drill` 为短字符串。可选 `scores` 包含任务完成、清晰度、范围和互动四项；没必要则省略。
- `pronunciation.status` 为 `observed` 或 `not_observed`；后者 notes 必须为空。有原始可听音频才用前者，notes 为有证据的简短观察。

网页只查看存档，每 8 秒刷新。它会显示日语表达、读音、提示等级、原句／纠正／保留选项与下次任务。用户要求打开时启动服务；不用为了每次归档都开服务。无本地文件能力则仅提供报告，明确未保存。

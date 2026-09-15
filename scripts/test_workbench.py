"""Isolated archive and HTTP regression checks; never touches learner history."""

import copy
import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen

import workbench as wb


class WorkbenchTests(unittest.TestCase):
    def setUp(self):
        scratch = Path("G:/AI/OpenAI/Workspaces")
        self.temp = tempfile.TemporaryDirectory(prefix="jpkouyu-check-", dir=scratch)
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.data_dir = self.root / "data"
        self.session = {
            "id": "test-ja-001", "language": "ja",
            "created_at": "2026-09-15T12:00:00+08:00",
            "topic": {"id": "store", "label": "便利店结账"},
            "duration_minutes": 10, "level": "beginner", "hint_mode": "guided",
            "targets": [{"expression": "袋は要りません。", "reading": "ふくろはいりません。",
                         "meaning_zh": "不需要袋子", "status": "mastered",
                         "support": "independent", "evidence": "袋は要りません。"}],
            "repairs": [{"kind": "repair", "learner": "袋がください。",
                         "natural": "袋をください。", "natural_reading": "ふくろをください。",
                         "reason_zh": "请求物品用を"}],
            "focus_next": ["请求物品时的助词"], "next_drill": "改在咖啡店请求两杯咖啡",
            "pronunciation": {"status": "not_observed", "notes": []},
        }
        self.input_path = self.root / "input.json"

    def archive(self, payload=None):
        wb.atomic_json(self.input_path, payload or self.session)
        wb.archive_session(self.data_dir, self.input_path)

    def test_unicode_archive_roundtrip_and_repeat(self):
        self.archive()
        self.archive()
        state = wb.load_state(self.data_dir)
        self.assertEqual(state["sessions"], [self.session])
        session_file = self.data_dir / "sessions/test-ja-001.json"
        self.assertEqual(json.loads(session_file.read_text(encoding="utf-8")), self.session)
        markdown = (self.data_dir / "复习台.md").read_text(encoding="utf-8")
        self.assertIn("ふくろはいりません。", markdown)
        self.assertIn("ふくろをください。", markdown)

    def test_conflicting_id_does_not_overwrite(self):
        self.archive()
        original = (self.data_dir / "workbench-data.json").read_bytes()
        changed = copy.deepcopy(self.session)
        changed["duration_minutes"] = 20
        with self.assertRaises(ValueError):
            self.archive(changed)
        self.assertEqual((self.data_dir / "workbench-data.json").read_bytes(), original)

    def test_other_language_is_rejected(self):
        payload = copy.deepcopy(self.session)
        payload["language"] = "en"
        with self.assertRaises(ValueError):
            self.archive(payload)
        self.assertFalse(self.data_dir.exists())
        wb.atomic_json(self.data_dir / "workbench-data.json", {"version": 1, "sessions": []})
        with self.assertRaises(ValueError):
            wb.load_state(self.data_dir)

    def test_imitation_and_text_pronunciation_are_not_mastery(self):
        payload = copy.deepcopy(self.session)
        payload["targets"][0]["support"] = "model"
        with self.assertRaises(ValueError):
            wb.validate_session(payload)
        payload = copy.deepcopy(self.session)
        payload["pronunciation"]["notes"] = ["伪造的发音判断"]
        with self.assertRaises(ValueError):
            wb.validate_session(payload)

    def test_default_paths_and_port(self):
        parser = wb.build_parser()
        for command in (["init"], ["archive", "--input", "example.json"], ["serve"]):
            self.assertEqual(parser.parse_args(command).data_dir, wb.DEFAULT_DATA_DIR)
        self.assertEqual(parser.parse_args(["serve"]).port, 8766)

    def test_http_ui_and_state(self):
        self.archive()
        static_dir = Path(wb.__file__).resolve().parent.parent / "assets/workbench"
        server = ThreadingHTTPServer(("127.0.0.1", 0), wb.make_handler(self.data_dir, static_dir))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            base = f"http://127.0.0.1:{server.server_address[1]}"
            with urlopen(base + "/api/state", timeout=5) as response:
                self.assertEqual(json.load(response)["sessions"][0], self.session)
            with urlopen(base + "/", timeout=5) as response:
                self.assertIn("日语口语复习台", response.read().decode("utf-8"))
            for path in ("/app.js", "/styles.css", "/api/health"):
                with urlopen(base + path, timeout=5) as response:
                    self.assertEqual(response.status, 200)
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)


if __name__ == "__main__":
    unittest.main()

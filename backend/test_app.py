import asyncio
import os
import unittest
from unittest.mock import MagicMock, patch

import httpx
from fastapi import HTTPException
from openai import OpenAIError

from app import app


class BirthdayChatApiTests(unittest.TestCase):
    def request(self, method, path, json=None, headers=None):
        async def send_request():
            transport = httpx.ASGITransport(app=app)
            async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
                return await client.request(method, path, json=json, headers=headers)

        return asyncio.run(send_request())

    def setUp(self):
        self.valid_messages = [
            {"role": "assistant", "content": "Hi Malu! Happy birthday!"},
            {"role": "user", "content": "Who made this website?"},
            {"role": "assistant", "content": "Bharath made it for your birthday."},
            {"role": "user", "content": "What did you say it was for?"},
        ]

    def test_chat_returns_generated_reply_and_forwards_context(self):
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.chat.completions.create.return_value.choices[0].message.content = (
            "Bharath made this website!"
        )

        with patch.dict(
            os.environ,
            {"GROQ_API_KEY": "test-key", "GROQ_MODEL": "openai/gpt-oss-20b"},
        ), patch("app.OpenAI", return_value=mock_client) as openai_client:
            response = self.request("POST", "/api/chat", json={"messages": self.valid_messages})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"reply": "Bharath made this website!"})
        openai_client.assert_called_once_with(
            api_key="test-key",
            base_url="https://api.groq.com/openai/v1",
            timeout=35.0,
        )
        request = mock_client.chat.completions.create.call_args.kwargs
        self.assertEqual(request["model"], "openai/gpt-oss-20b")
        self.assertEqual(request["messages"][0]["role"], "system")
        self.assertIn("Do not invent personal memories", request["messages"][0]["content"])
        self.assertEqual(request["messages"][1:], self.valid_messages)
        self.assertEqual(request["max_completion_tokens"], 350)

    def test_rejects_non_alternating_conversation(self):
        response = self.request(
            "POST",
            "/api/chat",
            json={
                "messages": [
                    {"role": "user", "content": "Hi"},
                    {"role": "user", "content": "Are you there?"},
                ]
            },
        )

        self.assertEqual(response.status_code, 422)

    def test_rejects_blank_and_oversized_messages(self):
        blank = self.request("POST", "/api/chat", json={"messages": [{"role": "user", "content": "  "}]})
        oversized = self.request(
            "POST",
            "/api/chat",
            json={"messages": [{"role": "user", "content": "x" * 1501}]},
        )

        self.assertEqual(blank.status_code, 422)
        self.assertEqual(oversized.status_code, 422)

    def test_missing_key_returns_configuration_error(self):
        with patch.dict(os.environ, {"GROQ_API_KEY": ""}):
            response = self.request("POST", "/api/chat", json={"messages": self.valid_messages})

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["detail"], "The birthday assistant is not configured yet.")

    def test_groq_errors_return_friendly_message_without_provider_details(self):
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.chat.completions.create.side_effect = OpenAIError("private provider details")

        with patch.dict(os.environ, {"GROQ_API_KEY": "test-key"}), patch(
            "app.OpenAI", return_value=mock_client
        ):
            response = self.request("POST", "/api/chat", json={"messages": self.valid_messages})

        self.assertEqual(response.status_code, 502)
        self.assertEqual(
            response.json()["detail"],
            "The birthday assistant is taking a little break. Please try again.",
        )
        self.assertNotIn("private provider details", response.text)

    def test_rate_limit_returns_a_friendly_error(self):
        with patch.dict(os.environ, {"GROQ_API_KEY": "test-key"}), patch(
            "app.enforce_rate_limit",
            side_effect=HTTPException(status_code=429, detail="Please try again in a minute."),
        ):
            response = self.request("POST", "/api/chat", json={"messages": self.valid_messages})

        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.json()["detail"], "Please try again in a minute.")

    def test_health_endpoint_does_not_require_api_key(self):
        response = self.request("GET", "/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_swagger_documentation_is_enabled(self):
        response = self.request("GET", "/docs")

        self.assertEqual(response.status_code, 200)
        self.assertIn("swagger-ui", response.text)

    def test_cors_allows_site_origin_and_rejects_unlisted_origins(self):
        headers = {
            "Origin": "https://bharath3-alt.github.io",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        }
        allowed = self.request("OPTIONS", "/api/chat", headers=headers)
        headers["Origin"] = "https://not-the-site.example"
        rejected = self.request("OPTIONS", "/api/chat", headers=headers)

        self.assertEqual(allowed.status_code, 200)
        self.assertEqual(
            allowed.headers["access-control-allow-origin"],
            "https://bharath3-alt.github.io",
        )
        self.assertEqual(rejected.status_code, 400)
        self.assertNotIn("access-control-allow-origin", rejected.headers)


if __name__ == "__main__":
    unittest.main()

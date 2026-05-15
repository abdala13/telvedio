#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
import os
import re
import sys
import logging
from datetime import datetime
from typing import Dict

from telethon import TelegramClient, events
from telethon.tl.types import Message
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

API_ID = int(os.getenv("TELEGRAM_API_ID", "0"))
API_HASH = os.getenv("TELEGRAM_API_HASH", "").strip()
PHONE_NUMBER = os.getenv("PHONE_NUMBER", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "").strip()
PRIVATE_CHANNEL = os.getenv("PRIVATE_CHANNEL", "").strip()
SITE_URL = os.getenv("SITE_URL", "https://your-site.vercel.app").strip()
CHANNELS_CONFIG = os.getenv("TELEGRAM_CHANNELS", "").strip()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler("collector.log", encoding="utf-8")]
)
logger = logging.getLogger("Collector")

class ArticleCollector:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.client = TelegramClient("article_session", API_ID, API_HASH)
        self.channels = self._parse_channels()

    def _parse_channels(self) -> Dict[str, str]:
        channels = {}
        if not CHANNELS_CONFIG:
            logger.error("No TELEGRAM_CHANNELS configured!"); return channels
        for item in CHANNELS_CONFIG.split(","):
            item = item.strip()
            if ":" in item:
                ch, cat = item.split(":", 1)
                channels[ch.strip()] = cat.strip()
            else: channels[item] = "general"
        logger.info(f"Monitoring {len(channels)} channels: {list(channels.keys())}")
        return channels

    def _slug(self, title: str, msg_id: int) -> str:
        slug = re.sub(r"[^\w\s-]", "", title.lower())
        slug = re.sub(r"[\s_]+", "-", slug).strip("-")
        return f"{slug[:50]}-{msg_id}" if slug else f"article-{msg_id}"

    def _title(self, text: str) -> str:
        for line in text.strip().split("\n"):
            line = line.strip()
            if line and len(line) > 3: return line[:150]
        return "Untitled Article"

    def _content(self, text: str) -> str:
        lines = text.strip().split("\n")
        out = []; found = False
        for line in lines:
            line = line.strip()
            if not line: continue
            if not found and len(line) > 3: found = True; continue
            out.append(line)
        return "\n\n".join(out) if out else text

    def _summary(self, text: str, max_len: int = 200) -> str:
        c = self._content(text)
        c = re.sub(r"[*_`#\[\]()|]", "", c)
        c = re.sub(r"\s+", " ", c).strip()
        return c[:max_len] + "..." if len(c) > max_len else c

    async def _duplicate(self, channel: str, msg_id: int) -> bool:
        try:
            r = self.supabase.table("articles").select("id").eq("channel_username", channel).eq("telegram_message_id", msg_id).execute()
            return len(r.data) > 0
        except: return True

    async def _publish_private(self, title: str, slug: str, category: str):
        if not PRIVATE_CHANNEL: return
        try:
            url = f"{SITE_URL}/article/{slug}"
            msg = f"📰 **{title}**\n\n📂 {category}\n🔗 [Read Article]({url})"
            await self.client.send_message(PRIVATE_CHANNEL, msg, link_preview=True)
            logger.info(f"✅ Published to private channel: {url}")
        except Exception as e: logger.error(f"❌ Private publish failed: {e}")

    async def _log(self, level: str, msg: str, src: str = "collector"):
        try: self.supabase.table("system_logs").insert({"level": level, "message": msg, "source": src}).execute()
        except: pass

    async def process(self, msg: Message, channel: str, category: str):
        if not msg.text: return
        if await self._duplicate(channel, msg.id): return
        try:
            title = self._title(msg.text)
            content = self._content(msg.text)
            summary = self._summary(msg.text)
            slug = self._slug(title, msg.id)
            data = {
                "telegram_message_id": msg.id, "channel_username": channel, "category": category,
                "title": title, "slug": slug, "content": content, "summary": summary,
                "telegram_link": f"https://t.me/{channel}/{msg.id}",
                "published_at": datetime.now().isoformat(), "is_published": True
            }
            r = self.supabase.table("articles").insert(data).execute()
            if r.data:
                logger.info(f"📝 Article: {title[:60]}... ({slug})")
                await self._log("info", f"New: {title[:80]} from @{channel}")
                await self._publish_private(title, slug, category)
        except Exception as e:
            logger.error(f"❌ Error {msg.id}: {e}")
            await self._log("error", f"Failed {channel}/{msg.id}: {str(e)[:200]}")

    async def fetch_historical(self, limit: int = 30):
        logger.info("📥 Fetching historical...")
        for ch, cat in self.channels.items():
            try:
                entity = await self.client.get_entity(ch)
                msgs = await self.client.get_messages(entity, limit=limit)
                count = 0
                for msg in msgs:
                    if msg.text and not msg.forward: await self.process(msg, ch, cat); count += 1
                logger.info(f"✅ {count}/{len(msgs)} from @{ch}")
            except Exception as e:
                logger.error(f"❌ @{ch}: {e}")
                await self._log("error", f"Fetch failed @{ch}: {str(e)[:200]}")

    async def setup_listeners(self):
        logger.info("👂 Setting up listeners...")
        @self.client.on(events.NewMessage(chats=list(self.channels.keys())))
        async def handler(event):
            if not event.message.text: return
            ch = None; cat = "general"
            for c, ca in self.channels.items():
                try:
                    ent = await self.client.get_entity(c)
                    if event.chat_id == ent.id: ch = c; cat = ca; break
                except: continue
            if ch: await self.process(event.message, ch, cat)
        logger.info("🟢 Listeners active")

    async def run(self):
        logger.info("🚀 Starting...")
        await self.client.start(phone=PHONE_NUMBER)
        me = await self.client.get_me()
        logger.info(f"✅ Connected: {me.first_name} (@{me.username})")
        await self.fetch_historical(limit=30)
        await self.setup_listeners()
        logger.info("⏳ Running... Press Ctrl+C to stop")
        await self.client.run_until_disconnected()

async def main():
    if not API_ID or not API_HASH: logger.error("❌ API_ID and API_HASH required!"); sys.exit(1)
    if not SUPABASE_URL or not SUPABASE_KEY: logger.error("❌ SUPABASE_URL and SERVICE_KEY required!"); sys.exit(1)
    if not CHANNELS_CONFIG: logger.error("❌ TELEGRAM_CHANNELS required!"); sys.exit(1)
    await ArticleCollector().run()

if __name__ == "__main__":
    try: asyncio.run(main())
    except KeyboardInterrupt: logger.info("👋 Stopped")
    except Exception as e: logger.error(f"💥 Fatal: {e}"); sys.exit(1)

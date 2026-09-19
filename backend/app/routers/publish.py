from fastapi import APIRouter

from app.data import save_user_post, load_user_posts
from app.schemas.publish import PublishCreate

router = APIRouter()


@router.post("/")
async def create_publish(item: PublishCreate):
    """学生自主发布活动/招募信息，发布后进入统一列表并可被筛选"""
    missing = []
    if not item.time_text:
        missing.append("活动时间")
    if not item.location:
        missing.append("活动地点")
    if not item.contact:
        missing.append("联系方式")
    if not item.threshold:
        missing.append("参与条件")

    post = {
        "title": item.title,
        "summary": item.summary,
        "category": item.category,
        "source": "student",
        "time_text": item.time_text or "时间待确认",
        "event_start": None,
        "deadline": item.deadline or None,
        "deadline_text": item.deadline or "未注明",
        "location": item.location,
        "audience": item.audience,
        "threshold": item.threshold,
        "contact": item.contact,
        "status": "open",
        "status_note": None,
        "missing_fields": missing,
        "risk_flag": False,
        "risk_reason": None,
        "is_user_post": True,
    }
    saved = save_user_post(post)
    return {"data": saved, "message": "发布成功，已进入活动列表"}


@router.get("/")
async def get_publish_list():
    """获取所有学生自主发布的信息"""
    return {"data": load_user_posts(), "total": len(load_user_posts())}

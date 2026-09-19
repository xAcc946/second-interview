from fastapi import APIRouter, HTTPException

from app.data import get_merged_activities, get_activity_by_id, CATEGORY_LABELS, load_user_posts

router = APIRouter()


@router.get("/")
async def get_activities():
    """获取全部活动（补充通知已合并进原活动，含用户发布内容）"""
    items = get_merged_activities() + load_user_posts()
    return {
        "data": items,
        "category_labels": CATEGORY_LABELS,
        "total": len(items),
    }


@router.get("/search")
async def search_activities(keyword: str = ""):
    """按关键词搜索活动标题与内容"""
    items = get_merged_activities() + load_user_posts()
    if keyword.strip():
        kw = keyword.strip().lower()
        items = [
            it for it in items
            if kw in it["title"].lower() or kw in it.get("summary", "").lower()
        ]
    return {"data": items, "total": len(items)}


@router.get("/{activity_id}")
async def get_activity_detail(activity_id: int):
    """获取活动详情（含变更时间线与关联信息）"""
    item = get_activity_by_id(activity_id)
    if item is None:
        raise HTTPException(status_code=404, detail="活动不存在")
    return {"data": item}

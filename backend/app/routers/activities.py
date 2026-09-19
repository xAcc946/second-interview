from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_activities():
    """获取所有活动列表"""
    # TODO: 实现活动查询逻辑
    return {"data": [], "message": "活动列表接口 - 待实现"}


@router.get("/{activity_id}")
async def get_activity_detail(activity_id: int):
    """获取活动详情"""
    # TODO: 实现活动详情查询
    return {"data": None, "message": f"活动 {activity_id} 详情接口 - 待实现"}


@router.get("/search")
async def search_activities(keyword: str = ""):
    """搜索活动"""
    # TODO: 实现搜索逻辑
    return {"data": [], "message": "搜索接口 - 待实现"}

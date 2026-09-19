from fastapi import APIRouter
from app.schemas.publish import PublishCreate

router = APIRouter()


@router.post("/")
async def create_publish(item: PublishCreate):
    """发布新活动/招募信息"""
    # TODO: 实现发布逻辑
    return {"data": item.model_dump(), "message": "发布接口 - 待实现"}


@router.get("/")
async def get_publish_list():
    """获取所有用户发布的信息"""
    # TODO: 实现查询逻辑
    return {"data": [], "message": "发布列表接口 - 待实现"}

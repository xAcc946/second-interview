from pydantic import BaseModel
from typing import Optional


class PublishCreate(BaseModel):
    """用户发布信息的请求模型"""
    title: str
    summary: str
    category: str  # activity / recruit / team / sport / resource / other
    time_text: Optional[str] = None  # 活动时间描述
    deadline: Optional[str] = None
    location: Optional[str] = None
    audience: Optional[str] = None
    threshold: Optional[str] = None
    contact: Optional[str] = None
    source: str = "student"


class PublishResponse(BaseModel):
    """发布信息响应模型"""
    id: int
    title: str
    summary: str
    category: str
    source: str
    time_text: Optional[str] = None
    deadline: Optional[str] = None
    location: Optional[str] = None
    audience: Optional[str] = None
    threshold: Optional[str] = None
    contact: Optional[str] = None
    status: str = "open"

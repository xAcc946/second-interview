from pydantic import BaseModel
from typing import Optional


class PublishCreate(BaseModel):
    """用户发布信息的请求模型"""
    title: str
    content: str
    category: str  # 活动类型：activity, recruit, team, resource 等
    source: str = "student"  # 来源：student(学生发布), official(官方)
    deadline: Optional[str] = None
    location: Optional[str] = None
    contact: Optional[str] = None
    max_participants: Optional[int] = None


class PublishResponse(BaseModel):
    """发布信息响应模型"""
    id: int
    title: str
    content: str
    category: str
    source: str
    deadline: Optional[str] = None
    location: Optional[str] = None
    contact: Optional[str] = None
    max_participants: Optional[int] = None
    status: str = "pending"  # pending, approved, rejected

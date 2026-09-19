from pydantic import BaseModel
from typing import Optional


class Activity(BaseModel):
    """活动信息模型"""
    id: int
    title: str
    content: str
    category: str  # competition, lecture, recruit, team, resource, sport, workshop
    source: str  # official, college, student
    deadline: Optional[str] = None
    location: Optional[str] = None
    target_audience: Optional[str] = None
    status: str = "upcoming"  # upcoming, ongoing, ended, cancelled
    is_supplement: bool = False  # 是否为补充通知
    original_id: Optional[int] = None  # 关联的原始活动ID
    risk_flag: bool = False  # 是否存在风险信息标记
    risk_reason: Optional[str] = None
